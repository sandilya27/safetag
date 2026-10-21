import Link from "next/link";
import { projectHref, projects } from "@/lib/content";
import { Tbc } from "./ui";

/** Case-study cards: home page, projects index (filtered) and anywhere else they are listed. */
export function ProjectGrid({ items = projects }: { items?: typeof projects }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
      {items.map((p) => (
        <Link
          key={p.title}
          href={projectHref(p)}
          className="flex flex-col overflow-hidden rounded-md border border-grey-200 bg-white text-ink no-underline transition-colors duration-150 hover:border-ink hover:text-ink"
        >
          <div className="hatch flex aspect-video items-center justify-center border-b border-grey-200 font-mono text-[11px] text-grey-600">{p.placeholder}</div>
          <div className="flex flex-1 flex-col gap-3 p-[22px]">
            <div className="flex flex-wrap gap-1.5">
              {[p.service, p.location].map((tag) => (
                <span key={tag} className="rounded-[2px] border border-grey-200 px-[7px] py-[3px] font-mono text-[11px] font-medium tracking-[.06em]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="display-92 text-[21px] leading-[1.2] font-bold text-pretty">{p.title}</div>
            <div className="mt-auto grid grid-cols-2 gap-2.5 border-t border-grey-100 pt-3">
              {p.metrics.map(([value, label]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[19px] font-semibold">
                    {value}
                    <Tbc className="align-top" />
                  </span>
                  <span className="text-[12.5px] text-grey-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
