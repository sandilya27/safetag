import { Suspense } from "react";
import { Clock, FileCheck2, Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { PageHead } from "@/components/page-head";
import { container, padX, Tbc } from "@/components/ui";
import { contact } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description: "Request a quotation for calibration, testing or inspection. Six short steps; an engineer reviews every request.",
  path: "/request-a-quote",
});

export default function RequestQuotePage() {
  return (
    <main id="content" data-page="quote">
      <PageHead crumbs={[{ name: "Request a Quote", path: "/request-a-quote" }]} title="Request a Quote" intro="Six short steps. An engineer reviews every request and replies with a formal quotation." />
      <section className={`py-12 md:py-18 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]`}>
          <div className="min-w-0 rounded-md border border-grey-200 bg-white p-[clamp(20px,3vw,40px)]">
            {/* useSearchParams prefill: the form renders on the client inside this boundary. */}
            <Suspense fallback={<FormSkeleton />}>
              <QuoteForm />
            </Suspense>
          </div>
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header)+40px)] lg:self-start">
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              <li className="flex gap-4">
                <Clock className="size-6 flex-none text-green-700" />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">
                    Usually within one working day
                    <Tbc />
                  </span>
                  <span className="text-[14.5px] leading-normal text-grey-700">Large or multi-site scopes may need a short call first.</span>
                </span>
              </li>
              <li className="flex gap-4">
                <FileCheck2 className="size-6 flex-none text-green-700" />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">Attach what you have</span>
                  <span className="text-[14.5px] leading-normal text-grey-700">Instrument lists, drawings and specifications make the quotation exact.</span>
                </span>
              </li>
            </ul>
            <div data-surface="inverse" className="flex flex-col gap-3 rounded-md bg-ink p-6 text-white">
              <span className="font-semibold">Prefer to talk it through?</span>
              <a href={contact.phoneHref} className="flex items-center gap-2.5 font-mono text-[18px] font-medium text-green-500 no-underline hover:text-white">
                <Phone className="size-5" />
                {contact.phone}
              </a>
              <span className="text-[14px] text-grey-300">{contact.hours}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-8 motion-reduce:animate-none">
      <div className="h-16 rounded bg-grey-100" />
      <div className="h-9 w-2/3 rounded bg-grey-100" />
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[74px] rounded bg-grey-100" />
        ))}
      </div>
      <div className="ms-auto h-13 w-40 rounded bg-grey-100" />
    </div>
  );
}
