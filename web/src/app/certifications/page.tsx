import { FileText } from "lucide-react";
import { CertificationGrid } from "@/components/home/sections";
import { VerifyCertificateForm } from "@/components/home/islands";
import { PageHead } from "@/components/page-head";
import { container, h2, padX, QuoteBand, Tbc } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Certifications & accreditations",
  description: "SAFETAG accreditations and management system certifications, and how to verify a SAFETAG calibration or test certificate.",
  path: "/certifications",
});

const CHECKS = [
  ["Certificate number", "Unique to the instrument and the calibration date."],
  ["As-found and as-left results", "What the instrument read before and after any adjustment."],
  ["Measurement uncertainty", "How confident the result is, stated for each point."],
  ["Traceability statement", "The reference standards the result traces back to."],
];

const DOCUMENTS = ["ISO/IEC 17025 accreditation certificate", "Accreditation scope schedule", "ISO 9001 certificate", "Company profile"];

export default function CertificationsPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Certifications", path: "/certifications" }]}
        title="Aligned with ISO, SASO, GAC and ASTM standards."
        intro="The accreditations and certifications behind every SAFETAG report. Each body, scope and reference will be confirmed by SAFETAG before launch."
      />

      <section data-surface="inverse" aria-labelledby="accreditations" className={`bg-ink py-16 text-white md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-10`}>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 id="accreditations" className={`${h2} max-w-[18ch]`}>
              Accreditations and certificates
            </h2>
            <VerifyCertificateForm />
          </div>
          <CertificationGrid />
        </div>
      </section>

      <section aria-labelledby="reading" className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-10 lg:grid-cols-2`}>
          <div className="flex flex-col gap-5">
            <h2 id="reading" className={h2}>
              What to check on every certificate
            </h2>
            <p className="m-0 max-w-[52ch] text-[16.5px] leading-[1.6] text-grey-700">
              An auditor will look for these four things. Every SAFETAG calibration certificate carries them.
            </p>
          </div>
          <dl className="m-0 grid gap-px overflow-hidden rounded-md border border-grey-200 bg-grey-200 sm:grid-cols-2">
            {CHECKS.map(([t, d]) => (
              <div key={t} className="flex flex-col gap-2 bg-white p-6">
                <dt className="display-92 text-[19px] leading-[1.2] font-bold">{t}</dt>
                <dd className="m-0 text-[15px] leading-normal text-grey-700">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="documents" className={`border-t border-grey-200 bg-grey-50 py-16 md:py-20 ${padX}`}>
        <div className={`${container} flex flex-col gap-8`}>
          <h2 id="documents" className="display m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-extrabold">
            Documents
            <Tbc className="align-top" />
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {DOCUMENTS.map((d) => (
              <li key={d} className="flex items-start gap-3 rounded-md border border-dashed border-grey-300 bg-white p-5">
                <FileText className="size-5 flex-none text-grey-500" />
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] leading-snug font-semibold">{d}</span>
                  <span className="text-[13px] text-grey-600">PDF to be supplied by SAFETAG</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <QuoteBand />
    </main>
  );
}
