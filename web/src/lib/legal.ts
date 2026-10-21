// Legal pages. These are draft templates for structure only; SAFETAG supplies and approves
// the final legal text (see the proposal's client responsibilities).
import type { ArticleBlock } from "./articles";

export type LegalDoc = { title: string; updated: string; intro: string; body: ArticleBlock[] };

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  updated: "2026-10-01",
  intro: "This policy explains what personal data SAFETAG collects through this website, why we collect it, and the choices you have.",
  body: [
    { h2: "Data we collect" },
    { ul: ["Contact details you give us in a quote, contact or job application form", "Company and project information included in your request", "Files you attach, such as drawings, instrument lists or a CV", "Usage data collected by privacy-friendly analytics, such as pages viewed and device type"] },
    { h2: "How we use it" },
    { p: "We use your data to respond to your request, prepare quotations, deliver services, and assess job applications. We use aggregated analytics to improve the website." },
    { h2: "Legal basis" },
    { p: "We process personal data in line with the Personal Data Protection Law of the Kingdom of Saudi Arabia, on the basis of your consent or to take steps at your request before entering into a contract." },
    { h2: "Sharing" },
    { p: "We do not sell personal data. We share it only with service providers who host or operate this website on our behalf, under contracts that protect it, or where the law requires." },
    { h2: "Retention" },
    { p: "Enquiries are kept for as long as needed to respond and for our legitimate business records. Job applications are kept for the period stated on the application form." },
    { h2: "Your rights" },
    { p: "You can ask to access, correct or delete your personal data, or withdraw consent, by contacting us. We will respond within the period the law requires." },
    { h2: "Contact" },
    { p: "Questions about this policy can be sent to the email address in the website footer." },
  ],
};

export const termsAndConditions: LegalDoc = {
  title: "Terms & Conditions",
  updated: "2026-10-01",
  intro: "These terms govern your use of the SAFETAG website. Services are supplied under separate written agreements.",
  body: [
    { h2: "Use of this website" },
    { p: "You may use this website to learn about SAFETAG and to contact us. You must not misuse it, attempt to gain unauthorised access, or interfere with its operation." },
    { h2: "Information on this website" },
    { p: "We take care to keep information accurate, but it is provided for general guidance. Technical decisions should be based on a formal quotation, scope of work and the applicable standards." },
    { h2: "Quotations and services" },
    { p: "Submitting a request through this website does not create a contract. Services are supplied only under a quotation accepted in writing, subject to SAFETAG’s terms of service." },
    { h2: "Certificates" },
    { p: "Certificate verification on this website confirms that a certificate reference was issued by SAFETAG. The certificate itself remains the authoritative record." },
    { h2: "Intellectual property" },
    { p: "The SAFETAG name, quality mark and website content belong to SAFETAG. You may not reproduce them without permission." },
    { h2: "Liability" },
    { p: "To the extent permitted by law, SAFETAG is not liable for losses arising from use of this website." },
    { h2: "Governing law" },
    { p: "These terms are governed by the laws of the Kingdom of Saudi Arabia." },
  ],
};
