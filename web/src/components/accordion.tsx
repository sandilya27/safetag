import type { ReactNode } from "react";
import { Plus } from "lucide-react";

/** Native disclosure row: works without JavaScript and is searchable with find-in-page. */
export function Disclosure({ q, children, name }: { q: ReactNode; children: ReactNode; name?: string }) {
  return (
    <details name={name} className="group border-b border-grey-200">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] leading-snug font-semibold [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <Plus className="size-5 flex-none text-green-700 transition-transform duration-200 group-open:rotate-45" />
      </summary>
      <div className="max-w-[65ch] pb-5 text-[15.5px] leading-[1.65] text-grey-700">{children}</div>
    </details>
  );
}
