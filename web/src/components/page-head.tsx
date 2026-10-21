import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbLd } from "@/lib/seo";
import { ReadingRule } from "./reading-rule";
import { container, JsonLd, lead, padX } from "./ui";

export type Crumb = { name: string; path: string };

/**
 * Inner-page header on measuring paper: breadcrumbs, title, lead, optional actions and an
 * optional aside (a readout panel, facts or an illustration). Also mounts the reading rule.
 */
export function PageHead({
  crumbs,
  title,
  intro,
  actions,
  aside,
  children,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <>
      <ReadingRule />
      <JsonLd data={breadcrumbLd(trail)} />
      <header className={`grid-paper border-b border-grey-200 pt-[calc(var(--header)+40px)] pb-14 md:pb-18 ${padX}`}>
        <div className={`${container} grid items-end gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]`}>
          <div className="flex min-w-0 flex-col gap-6">
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 font-mono text-[12.5px] font-medium text-grey-600">
                {trail.map((c, i) => {
                  const last = i === trail.length - 1;
                  return (
                    <li key={c.path} className="flex items-center gap-2">
                      {last ? (
                        <span aria-current="page" className="text-ink">
                          {c.name}
                        </span>
                      ) : (
                        <>
                          <Link href={c.path} className="text-grey-600 no-underline hover:text-green-700">
                            {c.name}
                          </Link>
                          <span aria-hidden="true" className="text-grey-400">
                            /
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <h1 className="display m-0 max-w-[16ch] text-[clamp(38px,5.2vw,72px)] leading-[1] font-extrabold tracking-[-.018em] text-balance">{title}</h1>
            {intro && <p className={lead}>{intro}</p>}
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
          {aside && <div className="min-w-0">{aside}</div>}
        </div>
      </header>
    </>
  );
}
