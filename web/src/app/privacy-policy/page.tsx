import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: privacyPolicy.title, description: privacyPolicy.intro, path: "/privacy-policy" });

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} path="/privacy-policy" />;
}
