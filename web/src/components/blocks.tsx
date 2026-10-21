import type { ArticleBlock } from "@/lib/articles";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Renders CMS-shaped rich text (headings, paragraphs, lists) inside `.prose`. */
export function Blocks({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="prose">
      {body.map((b, i) =>
        "h2" in b ? (
          <h2 key={i} id={slugify(b.h2)}>
            {b.h2}
          </h2>
        ) : "p" in b ? (
          <p key={i}>{b.p}</p>
        ) : (
          <ul key={i}>
            {b.ul.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

/** Headings of a body, for an on-page table of contents. */
export const headings = (body: ArticleBlock[]) => body.flatMap((b) => ("h2" in b ? [b.h2] : []));
