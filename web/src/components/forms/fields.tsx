"use client";

// Form primitives shared by the contact, careers and quote forms. Label above, help text
// below the label, error below the control; errors are announced and linked by aria-describedby.
import { useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Paperclip, X } from "lucide-react";

const control =
  "w-full rounded border border-grey-400 bg-white px-3.5 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-grey-500 hover:border-grey-600 focus:border-green-700 focus:shadow-[0_0_0_3px_var(--color-green-200)] aria-invalid:border-[#b42318] aria-invalid:focus:shadow-[0_0_0_3px_#fbd5d1]";

type Base = { label: string; name: string; error?: string; help?: ReactNode; optional?: boolean; className?: string };

function Frame({ id, label, error, help, optional, className = "", children }: Omit<Base, "name"> & { id: string; children: ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[14.5px] font-semibold text-ink">
        {label}
        {optional && <span className="ms-1.5 font-normal text-grey-600">(optional)</span>}
      </label>
      {help && (
        <span id={`${id}-help`} className="text-[13.5px] leading-snug text-grey-600">
          {help}
        </span>
      )}
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="text-[13.5px] font-medium text-[#b42318]">
          {error}
        </span>
      )}
    </div>
  );
}

const describedBy = (id: string, help?: ReactNode, error?: string) => [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

export function TextField({ label, name, error, help, optional, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Frame id={id} label={label} error={error} help={help} optional={optional} className={className}>
      <input id={id} name={name} aria-invalid={!!error} aria-describedby={describedBy(id, help, error)} className={`${control} h-12`} {...rest} />
    </Frame>
  );
}

export function TextArea({ label, name, error, help, optional, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Frame id={id} label={label} error={error} help={help} optional={optional} className={className}>
      <textarea id={id} name={name} rows={5} aria-invalid={!!error} aria-describedby={describedBy(id, help, error)} className={`${control} min-h-32 resize-y py-3 leading-normal`} {...rest} />
    </Frame>
  );
}

export function SelectField({ label, name, error, help, optional, className, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Frame id={id} label={label} error={error} help={help} optional={optional} className={className}>
      <div className="relative">
        <select id={id} name={name} aria-invalid={!!error} aria-describedby={describedBy(id, help, error)} className={`${control} h-12 appearance-none pe-10`} {...rest}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3.5 top-4 size-4 text-grey-600" />
      </div>
    </Frame>
  );
}

/** Option buttons that behave as a radio group (large touch targets, no tiny native radios). */
export function Choice<T extends string>({ label, value, onChange, options, error }: { label: string; value: T | ""; onChange: (v: T) => void; options: [T, string, string?][]; error?: string }) {
  const id = useId();
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0" aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="mb-1.5 p-0 text-[14.5px] font-semibold text-ink">{label}</legend>
      <div role="radiogroup" aria-label={label} className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {options.map(([v, title, note]) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(v)}
              className={`flex min-h-14 cursor-pointer flex-col items-start justify-center gap-0.5 rounded border-[1.5px] px-4 py-3 text-start transition-[border-color,background-color] duration-150 ${
                on ? "border-green-700 bg-green-50" : "border-grey-300 bg-white hover:border-grey-600"
              }`}
            >
              <span className="text-[15px] font-semibold text-ink">{title}</span>
              {note && <span className="text-[13px] leading-snug text-grey-600">{note}</span>}
            </button>
          );
        })}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-[13.5px] font-medium text-[#b42318]">
          {error}
        </span>
      )}
    </fieldset>
  );
}

export const MAX_FILE_MB = 10;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.dwg";

/** File picker with a visible list; validates size and type before upload. */
export function FilePicker({ label, files, onChange, help, max = 5, accept = ACCEPT }: { label: string; files: File[]; onChange: (f: File[]) => void; help?: string; max?: number; accept?: string }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const add = (list: FileList | null) => {
    if (!list) return;
    const allowed = accept.split(",");
    const next = [...files];
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) return setError(`${f.name} is larger than ${MAX_FILE_MB} MB.`);
      if (!allowed.some((ext) => f.name.toLowerCase().endsWith(ext))) return setError(`${f.name} is not a supported file type.`);
      if (next.length >= max) return setError(`You can attach up to ${max} files.`);
      next.push(f);
    }
    setError(undefined);
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-[14.5px] font-semibold text-ink">
        {label} <span className="font-normal text-grey-600">(optional)</span>
      </span>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        className="flex flex-col items-start gap-2 rounded-md border-[1.5px] border-dashed border-grey-400 bg-grey-50 p-5"
      >
        <button
          type="button"
          onClick={() => input.current?.click()}
          aria-describedby={`${id}-label`}
          className="flex h-11 cursor-pointer items-center gap-2 rounded border-[1.5px] border-ink bg-white px-4 text-[15px] font-semibold hover:bg-grey-100"
        >
          <Paperclip className="size-4" />
          Choose files
        </button>
        <span className="text-[13.5px] text-grey-600">{help ?? `Or drop them here. PDF, Office, image or DWG, up to ${MAX_FILE_MB} MB each.`}</span>
        <input ref={input} type="file" multiple accept={accept} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => add(e.target.files)} />
      </div>
      {error && (
        <span role="alert" className="text-[13.5px] font-medium text-[#b42318]">
          {error}
        </span>
      )}
      {files.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded border border-grey-200 bg-white py-1.5 ps-3 pe-1.5 text-[14px]">
              <Paperclip className="size-4 flex-none text-grey-500" />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="font-mono text-[12px] text-grey-600">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => onChange(files.filter((_, j) => j !== i))} className="flex size-9 cursor-pointer items-center justify-center rounded hover:bg-grey-100">
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Hidden field bots fill in and people never see; the API drops submissions that use it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/[^\d]/g, "").length >= 8;

export type SubmitResult = { ok: true; reference: string } | { ok: false; error: string };

/** Post a form to the inquiries API as multipart (fields + attachments). */
export async function submitInquiry(kind: "quote" | "contact" | "career", fields: Record<string, string>, files: File[] = []): Promise<SubmitResult> {
  const body = new FormData();
  body.set("kind", kind);
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  files.forEach((f) => body.append("files", f));
  try {
    const res = await fetch("/api/inquiries", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "We could not send your request. Please try again." };
    return { ok: true, reference: data.reference };
  } catch {
    return { ok: false, error: "No connection. Check your network and try again; nothing you entered has been lost." };
  }
}
