import Link from "next/link";
import { btnOutline, btnPrimary, padX } from "@/components/ui";

export const metadata = { title: "Page not found" };

/** 404 as an out-of-tolerance reading. */
export default function NotFound() {
  return (
    <main id="content" className={`grid-paper flex min-h-[100dvh] items-center pt-[calc(var(--header)+40px)] pb-20 ${padX}`}>
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="display m-0 text-[clamp(40px,5vw,68px)] leading-none font-extrabold text-balance">This page is out of tolerance.</h1>
          <p className="m-0 max-w-[46ch] text-[18px] leading-[1.6] text-grey-700">The address may have changed when the site was rebuilt. Try the services list, or tell us what you were looking for.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className={`${btnPrimary} h-13 px-6 text-base`}>
              Browse services
            </Link>
            <Link href="/" className={`${btnOutline} h-13 px-6 text-base`}>
              Back to home
            </Link>
          </div>
        </div>
        <div data-surface="inverse" aria-hidden="true" className="flex flex-col gap-3.5 rounded-md bg-ink px-6 py-[22px] text-white">
          <div className="flex justify-between font-mono text-[11.5px] font-semibold tracking-[.08em] text-grey-300">
            <span>PAGE LOOKUP · URL</span>
            <span className="text-amber">OUT OF TOLERANCE</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[clamp(48px,6vw,80px)] leading-none font-medium text-amber tabular-nums">404</span>
            <span className="font-mono text-lg text-grey-300">not found</span>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-grey-700 pt-3 font-mono text-[12.5px] text-grey-300">
            <span className="flex flex-col">
              EXPECTED<span className="text-[15px] text-white">200</span>
            </span>
            <span className="flex flex-col">
              READING<span className="text-[15px] text-white">404</span>
            </span>
            <span className="flex flex-col">
              ACTION<span className="text-[15px] text-white">Re-route</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
