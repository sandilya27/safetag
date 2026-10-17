"use client";

import { Droplets, MessageSquare, Send, X } from "lucide-react";
import { useChat } from "./chat-context";

const bubbleIn = "max-w-[88%] self-start rounded-[10px_10px_10px_2px] border border-grey-200 bg-white px-3 py-2.5 text-sm leading-[1.45]";

/** Floating "Ask SAFETAG" button and assistant panel. Static mock conversation for now. */
export function ChatWidget() {
  const { open, setOpen } = useChat();
  return (
    <div className="fixed end-[clamp(16px,2vw,28px)] bottom-[84px] z-45 flex flex-col items-end gap-3 md:bottom-6">
      {open && (
        <div
          role="dialog"
          aria-label="SAFETAG assistant"
          className="flex max-h-[min(600px,calc(100vh-160px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-grey-200 bg-white shadow-[0_8px_24px_rgb(11_15_14/.12)]"
        >
          <div data-surface="inverse" className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-green-500">
              <MessageSquare className="size-[18px] text-ink" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-semibold">SAFETAG assistant</span>
              <span className="font-mono text-[11px] text-grey-300">AI · answers from SAFETAG-approved content</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-grey-800"
            >
              <X className="size-[18px] text-white" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto bg-grey-50 p-4">
            <div className={bubbleIn}>Hello. I can explain SAFETAG services, point you to the right page, or collect your requirements for a quotation.</div>
            <div className="max-w-[80%] self-end rounded-[10px_10px_2px_10px] bg-ink px-3 py-2.5 text-sm leading-[1.45] text-white">Do you hydrotest pressure vessels on site?</div>
            <div className={`${bubbleIn} flex flex-col gap-2.5`}>
              <span>
                Yes. <strong>Hydro Testing</strong> covers leak and pressure testing for pipelines, pressure vessels and storage tanks, at your site or at the lab.
              </span>
              <a href="#" className="flex items-center gap-2.5 rounded border border-grey-200 p-2.5 text-ink no-underline hover:border-ink hover:text-ink">
                <Droplets className="size-5 text-green-700" />
                <span className="flex-1 text-sm font-semibold">Hydro Testing</span>
                <span className="font-mono text-xs text-green-700">VIEW</span>
              </a>
              <span>Shall I start a quote with these details?</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <a
                href="#assistant"
                onClick={() => setOpen(false)}
                className="flex h-10 items-center rounded-full bg-green-500 px-3.5 text-[13.5px] font-semibold text-ink no-underline hover:text-ink"
              >
                Start a quote
              </a>
              <button type="button" className="h-10 cursor-pointer rounded-full border border-grey-300 bg-white px-3.5 text-[13.5px] font-medium hover:border-ink">
                Talk to an engineer
              </button>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 border-t border-grey-200 p-3">
            <input
              aria-label="Message"
              placeholder="Type your question"
              className="h-11 min-w-0 flex-1 rounded border border-grey-400 px-3 text-[15px] outline-none focus:border-green-700 focus:shadow-[0_0_0_3px_#A9E7C0]"
            />
            <button aria-label="Send" className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-ink">
              <Send className="size-[18px] text-white" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Open SAFETAG assistant"
        aria-expanded={open}
        className="flex h-14 cursor-pointer items-center gap-2.5 rounded-full border border-grey-700 bg-ink ps-4 pe-5 text-[15px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgb(11_15_14/.18)] hover:bg-grey-800"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-green-500">
          <MessageSquare className="size-4 text-ink" />
        </span>
        {open ? "Close" : "Ask SAFETAG"}
      </button>
    </div>
  );
}
