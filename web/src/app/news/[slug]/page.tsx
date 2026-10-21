import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Blocks } from "@/components/blocks";
import { PageHead } from "@/components/page-head";
import { container, JsonLd, padX, QuoteBand, textLink } from "@/components/ui";
import { articleHref, articles, getArticle } from "@/lib/articles";
import { getService, serviceHref } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { ArticleMeta as Meta } from "@/components/article-meta";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return { ...pageMetadata({ title: a.title, description: a.excerpt, path: articleHref(a) }), openGraph: { type: "article", publishedTime: a.date, title: a.title, description: a.excerpt } };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const svc = a.serviceSlug ? getService(a.serviceSlug) : undefined;
  const more = articles.filter((o) => o.slug !== a.slug).slice(0, 2);

  return (
    <main id="content">
      <PageHead
        crumbs={[
          { name: "News & insights", path: "/news" },
          { name: a.category, path: articleHref(a) },
        ]}
        title={a.title}
        intro={a.excerpt}
      >
        <Meta category={a.category} date={a.date} minutes={a.readMinutes} />
      </PageHead>
      <article className={`py-14 md:py-20 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]`}>
          <div className="flex min-w-0 flex-col gap-8">
            <p className="m-0 w-fit rounded-[2px] bg-amber/20 px-2.5 py-1.5 font-mono text-[12px] text-grey-800">Draft article for SAFETAG review</p>
            <Blocks body={a.body} />
          </div>
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header)+40px)] lg:self-start">
            {svc && (
              <div className="flex flex-col gap-3 rounded-md border border-grey-200 bg-white p-6">
                <span className="label-mono">RELATED SERVICE</span>
                <Link href={serviceHref(svc)} className="flex items-center gap-2.5 font-semibold text-ink no-underline hover:text-green-700">
                  <svc.icon className="size-5 text-green-700" />
                  {svc.title}
                </Link>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <span className="label-mono">MORE TO READ</span>
              {more.map((m) => (
                <Link key={m.slug} href={articleHref(m)} className="text-[15.5px] leading-snug font-semibold text-ink no-underline hover:text-green-700">
                  {m.title}
                </Link>
              ))}
              <Link href="/news" className={textLink}>
                All articles
                <ArrowRight className="size-[15px]" />
              </Link>
            </div>
          </aside>
        </div>
      </article>
      <QuoteBand service={svc?.slug} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.date,
          url: `${SITE_URL}${articleHref(a)}`,
          publisher: { "@type": "Organization", name: "SAFETAG", url: SITE_URL },
        }}
      />
    </main>
  );
}
