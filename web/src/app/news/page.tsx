import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { ArticleMeta as Meta } from "@/components/article-meta";
import { container, padX, Placeholder } from "@/components/ui";
import { articleHref, articles } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News & insights",
  description: "Practical guidance on calibration intervals, NDT methods, hydrotesting and accreditation from SAFETAG engineers.",
  path: "/news",
});

export default function NewsPage() {
  const [lead, ...rest] = articles;
  return (
    <main id="content">
      <PageHead crumbs={[{ name: "News & insights", path: "/news" }]} title="Notes from the lab and the field." intro="Practical guidance from SAFETAG engineers, written for the people who sign off the work." />
      <section aria-label="Articles" className={`py-14 md:py-20 ${padX}`}>
        <div className={`${container} flex flex-col gap-12`}>
          <Link href={articleHref(lead)} className="group grid gap-8 text-ink no-underline hover:text-ink lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
            <Placeholder label={`article image · ${lead.category.toLowerCase()}`} className="aspect-[16/10] rounded-md border border-grey-200" />
            <div className="flex flex-col gap-4">
              <Meta category={lead.category} date={lead.date} minutes={lead.readMinutes} />
              <h2 className="display m-0 text-[clamp(30px,3.2vw,46px)] leading-[1.04] font-extrabold text-balance group-hover:text-green-800">{lead.title}</h2>
              <p className="m-0 max-w-[52ch] text-[17px] leading-[1.6] text-grey-700">{lead.excerpt}</p>
              <span className="flex items-center gap-1.5 text-[15px] font-semibold text-green-700">
                Read the article
                <ArrowRight className="size-[15px] transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
          <ul className="m-0 grid list-none gap-x-8 gap-y-10 border-t border-ink p-0 pt-10 md:grid-cols-3">
            {rest.map((a) => (
              <li key={a.slug}>
                <Link href={articleHref(a)} className="group flex flex-col gap-3 text-ink no-underline hover:text-ink">
                  <Meta category={a.category} date={a.date} minutes={a.readMinutes} />
                  <h3 className="display-92 m-0 text-[22px] leading-[1.2] font-bold text-balance group-hover:text-green-800">{a.title}</h3>
                  <p className="m-0 text-[15px] leading-normal text-grey-700">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
