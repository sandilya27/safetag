"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { contact, megaGroups, services } from "@/lib/content";
import { useChat } from "./chat-context";
import { Logo } from "./logo";

const NAV = [
  ["Industries", "#industries"],
  ["Laboratories", "#labs"],
  ["Certifications", "#certifications"],
  ["Projects", "#projects"],
  ["About", "#"],
  ["Contact", "#footer"],
] as const;

const MOBILE_NAV = NAV.filter(([label]) => label !== "About");

const navLink = "flex h-10 items-center rounded px-3 text-[15px] font-medium text-ink no-underline hover:bg-grey-100 hover:text-ink";

/**
 * Fixed header. Full navigation with the services mega-menu from 1180px; below that,
 * a menu button opens a full-height drawer.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [nav, setNav] = useState(false);
  const { setOpen: setChat } = useChat();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mega || nav;
  const closeNav = () => setNav(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color] duration-200"
      style={{ background: solid ? "#FFFFFF" : "rgba(250,251,250,0)", borderColor: solid ? "#DADFDD" : "transparent" }}
      onMouseLeave={() => mega && setMega(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setMega(false);
          setNav(false);
        }
      }}
    >
      <div className="mx-auto flex h-18 max-w-[1360px] items-center gap-3 sm:gap-8 px-[clamp(20px,3vw,40px)]">
        <a href="#" aria-label="SAFETAG home" className="flex flex-none">
          <Logo className="h-[38px] w-auto" />
        </a>
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-0.5 min-[1180px]:flex">
          <button
            type="button"
            onMouseEnter={() => setMega(true)}
            onClick={() => setMega(!mega)}
            aria-expanded={mega}
            aria-controls="mega"
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded border-0 bg-transparent px-3 text-[15px] font-medium text-ink hover:bg-grey-100"
          >
            Services
            <ChevronDown className="size-3.5 transition-transform duration-200" style={{ transform: `rotate(${mega ? 180 : 0}deg)` }} />
          </button>
          {NAV.map(([label, href]) => (
            <a key={label} href={href} className={navLink} onMouseEnter={label === "Industries" ? () => mega && setMega(false) : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a href={contact.phoneHref} className="hidden font-mono text-sm font-medium whitespace-nowrap text-ink no-underline hover:text-green-700 min-[1180px]:inline">
          {contact.phone}
        </a>
        <div className="ms-auto flex items-center gap-2">
          <a
            href="#assistant"
            className="flex h-11 items-center gap-2 rounded bg-green-500 px-3.5 sm:px-[18px] text-[15px] font-semibold whitespace-nowrap text-ink no-underline transition-colors duration-150 hover:bg-green-600 hover:text-ink active:bg-green-650"
          >
            Request a Quote
          </a>
          <button
            type="button"
            onClick={() => setNav(!nav)}
            aria-label="Menu"
            aria-expanded={nav}
            className="flex size-11 cursor-pointer items-center justify-center rounded border border-grey-200 bg-white min-[1180px]:hidden"
          >
            {nav ? <X className="size-5 text-ink" /> : <Menu className="size-5 text-ink" />}
          </button>
        </div>
      </div>

      {mega && (
        <div id="mega" className="hidden border-t border-grey-200 bg-white shadow-[0_8px_24px_rgb(11_15_14/.12)] min-[1180px]:block">
          <div className="mx-auto grid max-w-[1360px] grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.1fr)] gap-8 px-[clamp(20px,3vw,40px)] pt-8 pb-9">
            {megaGroups.map((g) => (
              <div key={g.title} className="flex flex-col gap-1.5">
                <div className="label-mono px-2.5 pb-2 uppercase">{g.title}</div>
                {g.items.map((s) => (
                  <a
                    key={s.title}
                    href="#"
                    className="flex items-center gap-3 rounded px-2.5 py-[9px] text-[15px] font-medium text-ink no-underline hover:bg-green-50 hover:text-green-800"
                  >
                    <s.icon className="size-5 flex-none text-green-700" />
                    {s.title}
                  </a>
                ))}
              </div>
            ))}
            <div data-surface="inverse" className="flex flex-col gap-3 rounded-md bg-ink p-6 text-white">
              <div className="font-mono text-[11.5px] font-semibold tracking-[.08em] text-green-500">NOT SURE WHERE TO START?</div>
              <div className="display-92 text-[22px] leading-[1.2] font-bold">Describe your equipment and we will recommend the right service.</div>
              <div className="mt-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setChat(true);
                    setMega(false);
                  }}
                  className="h-11 cursor-pointer rounded border-[1.5px] border-white bg-transparent px-4 text-sm font-semibold text-white hover:bg-grey-800"
                >
                  Ask the assistant
                </button>
                <a href="#assistant" className="flex h-11 items-center rounded bg-green-500 px-4 text-sm font-semibold text-ink no-underline hover:bg-green-400 hover:text-ink">
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {nav && (
        <div className="fixed inset-x-0 top-18 bottom-0 flex flex-col overflow-auto bg-white px-5 pt-4 pb-30 min-[1180px]:hidden">
          <div className="label-mono py-3">SERVICES</div>
          {services.map((s) => (
            <a key={s.title} href="#" onClick={closeNav} className="flex min-h-12 items-center gap-3 border-b border-grey-100 text-base font-medium text-ink no-underline">
              <s.icon className="size-5 flex-none text-green-700" />
              {s.title}
            </a>
          ))}
          <div className="label-mono pt-6 pb-3">COMPANY</div>
          {MOBILE_NAV.map(([label, href]) => (
            <a key={label} href={href} onClick={closeNav} className="flex min-h-12 items-center border-b border-grey-100 text-lg font-semibold text-ink no-underline">
              {label}
            </a>
          ))}
          <a href={contact.phoneHref} className="mt-5 font-mono text-base font-medium text-ink no-underline">
            {contact.phone}
          </a>
        </div>
      )}
    </header>
  );
}
