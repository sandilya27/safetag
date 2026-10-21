import { formatDate } from "@/lib/articles";
import { tag } from "./ui";

export function ArticleMeta({ category, date, minutes }: { category: string; date: string; minutes: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[13.5px] text-grey-600">
      <span className={`${tag} bg-white text-ink`}>{category}</span>
      <time dateTime={date}>{formatDate(date)}</time>
      <span>{minutes} min read</span>
    </div>
  );
}
