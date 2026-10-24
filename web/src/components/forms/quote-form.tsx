"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Pencil } from "lucide-react";
import { contact, getService, industries, services } from "@/lib/content";
import { btnOutline, btnPrimary } from "../ui";
import { Choice, FilePicker, Honeypot, isEmail, isPhone, SelectField, submitInquiry, TextArea, TextField } from "./fields";

type Values = {
  name: string; email: string; phone: string; jobTitle: string;
  company: string; industry: string;
  service: string;
  location: "" | "lab" | "site"; city: string; site: string; date: string;
  requirement: string; quantity: string; urgency: "" | "standard" | "urgent" | "shutdown";
  consent: string;
};

const EMPTY: Values = {
  name: "", email: "", phone: "", jobTitle: "", company: "", industry: "", service: "", location: "", city: "", site: "", date: "",
  requirement: "", quantity: "", urgency: "", consent: "",
};

type Errors = Partial<Record<keyof Values, string>>;

const STEPS: { title: string; check: (v: Values) => Errors }[] = [
  {
    title: "Contact",
    check: (v) => ({
      ...(!v.name.trim() && { name: "Enter your name." }),
      ...(!isEmail(v.email) && { email: "Enter an email address like name@company.com." }),
      ...(!isPhone(v.phone) && { phone: "Enter a phone number we can call, including the area code." }),
    }),
  },
  { title: "Company", check: (v) => ({ ...(!v.company.trim() && { company: "Enter your company name." }) }) },
  { title: "Service", check: (v) => ({ ...(!v.service && { service: "Choose a service, or “Not sure” and we will advise." }) }) },
  {
    title: "Location",
    check: (v) => ({
      ...(!v.location && { location: "Choose where the work will happen." }),
      ...(!v.city.trim() && { city: "Enter the city or site location." }),
    }),
  },
  {
    title: "Requirement",
    check: (v) => ({
      ...(v.requirement.trim().length < 15 && { requirement: "Describe the equipment and what needs doing, in a sentence or two." }),
    }),
  },
  { title: "Documents", check: (v) => ({ ...(!v.consent && { consent: "Agree to the privacy policy so we can contact you." }) }) },
];

const DRAFT_KEY = "safetag-quote-draft";

export function QuoteForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  // Restore an unsent draft, then apply ?service= / ?location= from links elsewhere on the
  // site. useSearchParams keeps this form client-rendered (the server prerenders the
  // Suspense fallback), so reading sessionStorage here cannot cause a hydration mismatch.
  const [v, setV] = useState<Values>(() => {
    let draft: Partial<Values> = {};
    try {
      draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "{}");
    } catch {}
    const svc = params.get("service");
    const loc = params.get("location");
    return {
      ...EMPTY,
      ...draft,
      ...(svc && getService(svc) && { service: svc }),
      ...((loc === "lab" || loc === "site") && { location: loc }),
    };
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string>();
  const [done, setDone] = useState<string>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (done) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(v));
    } catch {}
  }, [v, done]);

  const set = <K extends keyof Values>(k: K) => (val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const input = (k: keyof Values) => ({ name: k, value: v[k], error: errors[k], onChange: (e: { target: { value: string } }) => set(k)(e.target.value as never) });

  const go = (to: number) => {
    setStep(to);
    setFailure(undefined);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const next = () => {
    const e = STEPS[step].check(v);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return false;
    }
    if (step < STEPS.length - 1) go(step + 1);
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return void next();
    // Re-check every step in case a draft skipped one.
    const bad = STEPS.findIndex((s) => Object.keys(s.check(v)).length);
    if (bad >= 0) {
      setErrors(STEPS[bad].check(v));
      return go(bad);
    }
    setSending(true);
    setFailure(undefined);
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const fields = { ...v, service: getService(v.service)?.title ?? "Not sure", website: honeypot };
    const res = await submitInquiry("quote", fields, files);
    setSending(false);
    if (!res.ok) return setFailure(res.error);
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    setDone(res.reference);
  };

  if (done) return <QuoteSent reference={done} email={v.email} />;

  const svc = getService(v.service);
  const last = step === STEPS.length - 1;

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-8">
      <Honeypot />
      <StepRule step={step} onJump={(i) => i < step && go(i)} />

      <div className="flex flex-col gap-6">
        <h2 ref={headingRef} tabIndex={-1} className="display m-0 text-[clamp(26px,2.6vw,36px)] leading-[1.08] font-extrabold outline-none">
          {["Who should we reply to?", "Which company is this for?", "What do you need?", "Where will the work happen?", "Tell us about the job.", "Anything to attach?"][step]}
        </h2>

        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full name" autoComplete="name" {...input("name")} />
            <TextField label="Job title" optional autoComplete="organization-title" {...input("jobTitle")} />
            <TextField label="Work email" type="email" autoComplete="email" inputMode="email" {...input("email")} />
            <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+966" {...input("phone")} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Company" autoComplete="organization" {...input("company")} />
            <SelectField label="Industry" optional {...input("industry")}>
              <option value="">Choose an industry</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.title}>
                  {i.title}
                </option>
              ))}
              <option value="Other">Other</option>
            </SelectField>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <SelectField label="Service" help="Pick the closest match. You can describe anything else in the requirement step." {...input("service")}>
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value="not-sure">Not sure, please advise</option>
            </SelectField>
            {svc && (
              <p className="m-0 flex items-start gap-3 rounded-md bg-green-50 p-4 text-[15px] leading-normal text-grey-700">
                <svc.icon className="mt-0.5 size-5 flex-none text-green-700" />
                {svc.description}
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <Choice
              label="Location of work"
              value={v.location}
              onChange={set("location")}
              error={errors.location}
              options={[
                ["lab", "At a SAFETAG laboratory", "You send or bring the equipment to us"],
                ["site", "On-site", "Our team comes to your facility"],
              ]}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label={v.location === "lab" ? "Your city" : "City or site location"} autoComplete="address-level2" {...input("city")} />
              <TextField label="Preferred start date" type="date" optional {...input("date")} />
            </div>
            {v.location === "site" && <TextArea label="Site details" optional rows={3} help="Plant or project name, access requirements, permits." {...input("site")} />}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <TextArea
              label="Requirement"
              help="Equipment type, ranges or sizes, the standard you work to, and any deadline."
              placeholder="e.g. 40 pressure gauges, 0 to 100 bar, calibration certificates required before a shutdown starting 12 November."
              {...input("requirement")}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Quantity" optional inputMode="numeric" placeholder="Number of items" {...input("quantity")} />
            </div>
            <Choice
              label="How urgent is it?"
              value={v.urgency}
              onChange={set("urgency")}
              options={[
                ["standard", "Standard"],
                ["urgent", "Urgent", "Within the next week"],
                ["shutdown", "Planned shutdown", "Fixed window"],
              ]}
            />
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-6">
            <FilePicker label="Drawings, instrument lists or specifications" files={files} onChange={setFiles} />
            <Summary v={v} files={files} onEdit={go} />
            <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-normal">
              <input
                type="checkbox"
                checked={!!v.consent}
                onChange={(e) => set("consent")(e.target.checked ? "yes" : "")}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-0.5 size-5 flex-none cursor-pointer"
              />
              <span>
                SAFETAG may use these details to prepare a quotation and contact me about it, as described in the{" "}
                <Link href="/privacy-policy" target="_blank">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {errors.consent && (
              <span id="consent-error" role="alert" className="-mt-4 text-[13.5px] font-medium text-[#b42318]">
                {errors.consent}
              </span>
            )}
          </div>
        )}
      </div>

      {failure && (
        <div role="alert" className="rounded-md border border-[#f3b3ac] bg-[#fef3f2] p-4 text-[15px] text-[#7a271a]">
          {failure} You can also call <a href={contact.phoneHref}>{contact.phone}</a>.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-grey-200 pt-6">
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className={`${btnOutline} h-13 cursor-pointer gap-2 bg-white px-5 text-base`}>
            <ArrowLeft className="size-[18px]" />
            Back
          </button>
        )}
        <button type="submit" disabled={sending} className={`${btnPrimary} ms-auto h-13 cursor-pointer gap-2.5 border-0 px-6 text-base`}>
          {last ? (sending ? "Sending…" : "Send request") : "Continue"}
          {!sending && <ArrowRight className="size-[18px]" />}
        </button>
      </div>
    </form>
  );
}

/**
 * Step progress drawn as a caliper scale: the jaw slides to the current step, which reads
 * as a measurement rather than a stepper. Completed steps are buttons back to that step.
 */
function StepRule({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  const n = STEPS.length;
  return (
    <nav aria-label="Quote progress" className="flex flex-col gap-3">
      <p className="m-0 font-mono text-[12.5px] font-medium text-grey-600">
        Step {step + 1} of {n} · {STEPS[step].title}
      </p>
      <div aria-hidden="true" className="relative h-9">
        <div className="reading-rule absolute inset-x-0 bottom-0 h-[9px] border-b-0" />
        <div
          className="absolute bottom-0 h-full w-[3px] rounded-t-sm bg-green-500 transition-[left] duration-500 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
          style={{ left: `calc(${(step / (n - 1)) * 100}% - ${(step / (n - 1)) * 3}px)` }}
        />
        <div className="absolute bottom-0 h-[3px] bg-green-500 transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none" style={{ width: `${(step / (n - 1)) * 100}%` }} />
      </div>
      {/* Phones show only the "Step x of 6" line above; the labels need the width. */}
      <ol className="m-0 grid list-none grid-cols-6 p-0 max-sm:hidden">
        {STEPS.map((s, i) => (
          <li key={s.title} className={i === 0 ? "text-start" : i === n - 1 ? "text-end" : "text-center"}>
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i >= step}
              aria-current={i === step ? "step" : undefined}
              className={`cursor-pointer border-0 bg-transparent p-0 text-[12.5px] font-semibold disabled:cursor-default ${
                i === step ? "text-ink" : i < step ? "text-green-700 underline-offset-2 hover:underline" : "text-grey-500"
              }`}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Summary({ v, files, onEdit }: { v: Values; files: File[]; onEdit: (step: number) => void }) {
  const svc = getService(v.service);
  const rows: [string, string, number][] = [
    ["Contact", [v.name, v.email, v.phone].filter(Boolean).join(" · "), 0],
    ["Company", [v.company, v.industry].filter(Boolean).join(" · "), 1],
    ["Service", svc?.title ?? (v.service ? "Not sure, please advise" : ""), 2],
    ["Location", [v.location === "lab" ? "SAFETAG laboratory" : v.location === "site" ? "On-site" : "", v.city, v.date].filter(Boolean).join(" · "), 3],
    ["Requirement", v.requirement, 4],
    ["Files", files.length ? `${files.length} attached` : "None", 5],
  ];
  return (
    <div className="flex flex-col rounded-md border border-grey-200 bg-white">
      <h3 className="label-mono m-0 border-b border-grey-200 px-5 py-3">CHECK YOUR REQUEST</h3>
      <dl className="m-0">
        {rows.map(([k, val, s]) => (
          <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-start gap-3 border-b border-grey-100 px-5 py-3 last:border-b-0">
            <dt className="text-[13.5px] font-semibold text-grey-600">{k}</dt>
            <dd className="m-0 line-clamp-3 text-[14.5px] leading-snug break-words">{val || "Not provided"}</dd>
            {s < 5 && (
              <button type="button" onClick={() => onEdit(s)} aria-label={`Edit ${k.toLowerCase()}`} className="flex size-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-grey-100">
                <Pencil className="size-4 text-green-700" />
              </button>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

function QuoteSent({ reference, email }: { reference: string; email: string }) {
  return (
    <div role="status" data-kunna-done className="flex flex-col gap-6">
      <CheckCircle2 className="size-12 text-green-600" />
      <h2 className="display m-0 text-[clamp(30px,3vw,42px)] leading-[1.05] font-extrabold">Request received.</h2>
      <p className="m-0 max-w-[52ch] text-[17px] leading-[1.6] text-grey-700">
        An engineer will review your requirement and reply to <strong className="text-ink">{email}</strong> with a formal quotation.
      </p>
      <dl data-surface="inverse" className="m-0 flex w-fit flex-col gap-1 rounded-md bg-ink px-6 py-4 text-white">
        <dt className="font-mono text-[11.5px] tracking-[.08em] text-grey-300">YOUR REFERENCE</dt>
        <dd className="m-0 font-mono text-[28px] font-medium text-green-500">{reference}</dd>
      </dl>
      <p className="m-0 text-[15px] text-grey-700">
        Quote this reference if you call us on <a href={contact.phoneHref}>{contact.phone}</a>.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/services" className={`${btnOutline} h-12 px-5 text-[15px]`}>
          Browse services
        </Link>
        <Link href="/" className={`${btnOutline} h-12 px-5 text-[15px]`}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
