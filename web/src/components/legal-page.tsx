import { Blocks, headings, slugify } from "./blocks";
import { PageHead } from "./page-head";
import { container, padX } from "./ui";
import { formatDate } from "@/lib/articles";
import type { LegalDoc } from "@/lib/legal";

export function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  return (
    <main id="content">
      <PageHead crumbs={[{ name: doc.title, path }]} title={doc.title} intro={doc.intro}>
        <p className="m-0 font-mono text-[13px] text-grey-600">
          Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
        </p>
      </PageHead>
      <section className={`py-14 md:py-20 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]`}>
          <nav aria-label="On this page" className="flex flex-col gap-2 lg:sticky lg:top-[calc(var(--header)+40px)] lg:self-start">
            <span className="label-mono pb-1">ON THIS PAGE</span>
            {headings(doc.body).map((h) => (
              <a key={h} href={`#${slugify(h)}`} className="text-[14.5px] text-grey-700 no-underline hover:text-green-700">
                {h}
              </a>
            ))}
          </nav>
          <div className="flex min-w-0 flex-col gap-6">
            <p className="m-0 w-fit rounded-[2px] bg-amber/20 px-2.5 py-1.5 font-mono text-[12px] text-grey-800">Draft template. Final text to be supplied and approved by SAFETAG.</p>
            <Blocks body={doc.body} />
          </div>
        </div>
      </section>
    </main>
  );
}
