import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/simple-forms";
import { PageHead } from "@/components/page-head";
import { container, padX, Placeholder, Tbc } from "@/components/ui";
import { contact } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact us",
  description: "Call, email or message SAFETAG about calibration, testing and inspection in Saudi Arabia.",
  path: "/contact",
});

const CHANNELS = [
  { icon: Phone, label: "Phone", value: contact.phone, href: contact.phoneHref },
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: MapPin, label: "Office", value: contact.address, tbc: true },
  { icon: Clock, label: "Hours", value: contact.hours, tbc: true },
];

export default function ContactPage() {
  return (
    <main id="content">
      <PageHead crumbs={[{ name: "Contact", path: "/contact" }]} title="Talk to an engineer." intro="For a priced scope, the quote form is fastest. For anything else, message us here or call." />
      <section className={`py-12 md:py-18 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]`}>
          <div className="flex flex-col gap-8">
            <ul className="m-0 flex list-none flex-col p-0">
              {CHANNELS.map((c) => (
                <li key={c.label} className="flex gap-4 border-b border-grey-200 py-5 first:pt-0">
                  <c.icon className="mt-0.5 size-5 flex-none text-green-700" />
                  <span className="flex flex-col gap-1">
                    <span className="label-mono">{c.label.toUpperCase()}</span>
                    {c.href ? (
                      <a href={c.href} className="font-mono text-[17px] font-medium text-ink no-underline hover:text-green-700">
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-[16px]">
                        {c.value}
                        {c.tbc && <Tbc />}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <Placeholder label="map · office location (to be supplied)" className="aspect-[4/3] rounded-md border border-grey-200" />
            <p className="m-0 text-[15px] leading-normal text-grey-700">
              Need a price? <Link href="/request-a-quote">Request a quote</Link> instead; it reaches an engineer directly.
            </p>
          </div>
          <div className="min-w-0 rounded-md border border-grey-200 bg-white p-[clamp(20px,3vw,40px)]">
            <h2 className="display m-0 mb-6 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-extrabold">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
