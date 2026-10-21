import { LegalPage } from "@/components/legal-page";
import { termsAndConditions } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: termsAndConditions.title, description: termsAndConditions.intro, path: "/terms-and-conditions" });

export default function TermsPage() {
  return <LegalPage doc={termsAndConditions} path="/terms-and-conditions" />;
}
