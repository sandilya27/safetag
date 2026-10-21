"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { faqs, faqTopics } from "@/lib/faqs";
import { Disclosure } from "./accordion";
import { Tbc } from "./ui";

/** Searchable FAQ grouped by topic. Every answer stays in the DOM for find-in-page and SEO. */
export function FaqList() {
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const match = (f: (typeof faqs)[number]) => !t || `${f.q} ${f.a}`.toLowerCase().includes(t);
  const count = faqs.filter(match).length;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex max-w-[560px] flex-col gap-2">
        <label htmlFor="faq-search" className="text-[14.5px] font-semibold">
          Search the questions
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3.5 top-3.5 size-5 text-grey-500" />
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. certificate, shutdown, on site"
            className="h-12 w-full rounded border border-grey-400 bg-white ps-11 pe-3.5 text-[16px] outline-none placeholder:text-grey-500 focus:border-green-700 focus:shadow-[0_0_0_3px_var(--color-green-200)]"
          />
        </div>
        <span aria-live="polite" className="text-[13.5px] text-grey-600">
          {t ? `${count} matching question${count === 1 ? "" : "s"}` : `${faqs.length} questions`}
        </span>
      </div>
      {count === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-grey-300 bg-white p-8">
          <p className="m-0 text-[17px] font-semibold">No questions match “{q}”.</p>
          <p className="m-0 text-[15px] text-grey-700">
            Try another word, or <Link href="/contact">ask us directly</Link>.
          </p>
        </div>
      )}
      {faqTopics.map((topic) => {
        const items = faqs.filter((f) => f.topic === topic && match(f));
        if (!items.length) return null;
        return (
          <section key={topic} aria-labelledby={`topic-${topic}`} className="grid gap-x-12 gap-y-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]">
            <h2 id={`topic-${topic}`} className="display-92 m-0 text-[22px] leading-[1.2] font-bold">
              {topic}
            </h2>
            <div className="border-t border-ink">
              {items.map((f) => (
                <Disclosure key={f.q} q={f.q}>
                  {f.a}
                  {f.needsConfirmation && <Tbc />}
                </Disclosure>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
