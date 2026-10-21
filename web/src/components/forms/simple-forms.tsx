"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { openings } from "@/lib/careers";
import { btnPrimary } from "../ui";
import { FilePicker, Honeypot, isEmail, isPhone, SelectField, submitInquiry, TextArea, TextField } from "./fields";

type Errors = Record<string, string | undefined>;

/** Shared submit flow: validate, post, then swap to a confirmation. */
function useInquiry(kind: "contact" | "career", validate: (v: Record<string, string>) => Errors) {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string>();
  const [done, setDone] = useState<string>();
  const onSubmit = (files: File[] = []) => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const errs = Object.fromEntries(Object.entries(validate(v)).filter(([, m]) => m));
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setSending(true);
    setFailure(undefined);
    const res = await submitInquiry(kind, v, files);
    setSending(false);
    if (res.ok) setDone(res.reference);
    else setFailure(res.error);
  };
  const clear = (k: string) => errors[k] && setErrors((x) => ({ ...x, [k]: undefined }));
  return { errors, sending, failure, done, onSubmit, clear };
}

function Sent({ title, body, reference }: { title: string; body: string; reference: string }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 py-6">
      <CheckCircle2 className="size-10 text-green-600" />
      <h3 className="display m-0 text-[28px] leading-[1.1] font-extrabold">{title}</h3>
      <p className="m-0 max-w-[48ch] text-[16px] leading-[1.6] text-grey-700">{body}</p>
      <p className="m-0 font-mono text-[14px] text-grey-600">Reference {reference}</p>
    </div>
  );
}

function Failure({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-[#f3b3ac] bg-[#fef3f2] p-4 text-[15px] text-[#7a271a]">
      {message}
    </div>
  );
}

export function ContactForm() {
  const f = useInquiry("contact", (v) => ({
    name: v.name?.trim() ? undefined : "Enter your name.",
    email: isEmail(v.email ?? "") ? undefined : "Enter an email address like name@company.com.",
    message: (v.message ?? "").trim().length >= 10 ? undefined : "Write a short message so we know how to help.",
  }));
  if (f.done) return <Sent title="Message sent." body="Thank you. The right person will reply by email, usually within one working day." reference={f.done} />;
  return (
    <form onSubmit={f.onSubmit()} noValidate className="relative flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" error={f.errors.name} onChange={() => f.clear("name")} />
        <TextField label="Company" name="company" optional autoComplete="organization" />
        <TextField label="Work email" name="email" type="email" autoComplete="email" error={f.errors.email} onChange={() => f.clear("email")} />
        <TextField label="Phone" name="phone" type="tel" optional autoComplete="tel" />
      </div>
      <SelectField label="Topic" name="topic" defaultValue="General enquiry">
        {["General enquiry", "Existing job or certificate", "Supplier or partnership", "Media"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </SelectField>
      <TextArea label="Message" name="message" error={f.errors.message} onChange={() => f.clear("message")} />
      <Failure message={f.failure} />
      <button type="submit" disabled={f.sending} className={`${btnPrimary} h-13 cursor-pointer justify-center self-start border-0 px-7 text-base`}>
        {f.sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export function CareerForm() {
  const [files, setFiles] = useState<File[]>([]);
  const f = useInquiry("career", (v) => ({
    name: v.name?.trim() ? undefined : "Enter your name.",
    email: isEmail(v.email ?? "") ? undefined : "Enter an email address like name@example.com.",
    phone: isPhone(v.phone ?? "") ? undefined : "Enter a phone number, including the country code.",
    role: v.role ? undefined : "Choose a role, or “Open application”.",
  }));
  if (f.done) return <Sent title="Application received." body="Our HR team reviews every application and will contact you if your profile matches an opening." reference={f.done} />;
  return (
    <form onSubmit={f.onSubmit(files)} noValidate className="relative flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" error={f.errors.name} onChange={() => f.clear("name")} />
        <TextField label="Email" name="email" type="email" autoComplete="email" error={f.errors.email} onChange={() => f.clear("email")} />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+966" error={f.errors.phone} onChange={() => f.clear("phone")} />
        <SelectField label="Role" name="role" defaultValue="" error={f.errors.role} onChange={() => f.clear("role")}>
          <option value="">Choose a role</option>
          {openings.map((o) => (
            <option key={o.slug}>{o.title}</option>
          ))}
          <option>Open application</option>
        </SelectField>
      </div>
      <TextArea label="Certifications and experience" name="message" optional rows={4} help="For example: ASNT Level II UT, 6 years on refinery shutdowns." />
      <FilePicker label="CV" files={files} onChange={setFiles} max={2} accept=".pdf,.doc,.docx" help="PDF or Word, up to 10 MB." />
      <Failure message={f.failure} />
      <button type="submit" disabled={f.sending} className={`${btnPrimary} h-13 cursor-pointer justify-center self-start border-0 px-7 text-base`}>
        {f.sending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
