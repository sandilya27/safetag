// Inquiry intake for the quote, contact and careers forms. Validates the submission and
// returns a reference. Until the Express backend and Strapi are connected (proposal §4.4,
// §4.5), set INQUIRY_WEBHOOK_URL to forward submissions; otherwise they are logged only.
import { NextResponse } from "next/server";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const REQUIRED: Record<string, string[]> = {
  quote: ["name", "email", "phone", "company", "service", "location", "city", "requirement"],
  contact: ["name", "email", "message"],
  career: ["name", "email", "phone", "role"],
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "The form could not be read." }, { status: 400 });
  }
  const kind = String(form.get("kind") ?? "");
  const required = REQUIRED[kind];
  if (!required) return NextResponse.json({ error: "Unknown form." }, { status: 400 });

  // Honeypot: pretend success so bots learn nothing.
  if (String(form.get("website") ?? "")) return NextResponse.json({ reference: "ST-000000" }, { status: 202 });

  const fields: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string" && k !== "website") fields[k] = v.trim().slice(0, 5000);
  const missing = required.filter((k) => !fields[k]);
  if (missing.length) return NextResponse.json({ error: `Missing: ${missing.join(", ")}.` }, { status: 422 });
  if (!emailOk(fields.email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });

  const files = form.getAll("files").filter((f): f is File => typeof f !== "string");
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Attach up to ${MAX_FILES} files.` }, { status: 422 });
  if (files.some((f) => f.size > MAX_FILE_BYTES)) return NextResponse.json({ error: "Each file must be 10 MB or smaller." }, { status: 422 });

  const reference = `ST-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const record = { reference, kind, fields, files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })), receivedAt: new Date().toISOString() };

  const hook = process.env.INQUIRY_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record) });
      if (!res.ok) throw new Error(String(res.status));
    } catch (e) {
      console.error("Inquiry forward failed", reference, e);
      return NextResponse.json({ error: "We could not send your request just now. Please try again or call us." }, { status: 502 });
    }
  } else {
    console.info("Inquiry received (no INQUIRY_WEBHOOK_URL set)", record);
  }
  return NextResponse.json({ reference }, { status: 202 });
}
