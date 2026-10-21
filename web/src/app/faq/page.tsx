import { FaqList } from "@/components/faq-list";
import { PageHead } from "@/components/page-head";
import { container, JsonLd, padX, QuoteBand } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently asked questions",
  description: "Answers about SAFETAG quotations, calibration intervals, NDT methods, on-site work and certificates.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <main id="content">
      <PageHead crumbs={[{ name: "FAQ", path: "/faq" }]} title="Questions, answered." intro="Quotes, calibration, testing and certificates. If yours is not here, the assistant or our engineers can help." />
      <section className={`py-14 md:py-20 ${padX}`}>
        <div className={container}>
          <FaqList />
        </div>
      </section>
      <QuoteBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </main>
  );
}
