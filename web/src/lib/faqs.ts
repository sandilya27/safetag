// FAQ entries, shaped after the Strapi "faq" collection. Answers that depend on SAFETAG's
// own commitments (turnaround, coverage) are flagged needsConfirmation.

export type Faq = { q: string; a: string; topic: FaqTopic; needsConfirmation?: boolean; serviceSlug?: string };
export type FaqTopic = "Quotes & bookings" | "Calibration" | "Testing & inspection" | "Certificates";

export const faqTopics: FaqTopic[] = ["Quotes & bookings", "Calibration", "Testing & inspection", "Certificates"];

export const faqs: Faq[] = [
  { topic: "Quotes & bookings", q: "How do I request a quotation?", a: "Use the Request a Quote form and tell us the service, the equipment and where the work will take place. You can attach drawings, instrument lists or specifications. An engineer reviews every request." },
  { topic: "Quotes & bookings", q: "How quickly will I receive a quotation?", a: "Most quotations are issued within one working day. Large or multi-site scopes may need a short call to confirm details first.", needsConfirmation: true },
  { topic: "Quotes & bookings", q: "Do you work outside the Eastern Province?", a: "Yes. Field teams mobilise to sites across the Kingdom of Saudi Arabia. Tell us the location in your request and we will confirm logistics in the quotation.", needsConfirmation: true },
  { topic: "Quotes & bookings", q: "Can you support a planned shutdown or turnaround?", a: "Yes. Share your shutdown window and scope as early as possible so we can plan crews, equipment and certificates around it.", serviceSlug: "shutdown-jobs" },
  { topic: "Calibration", q: "Can you calibrate instruments at our site?", a: "Many instruments can be calibrated on site with portable reference standards. Some ranges and accuracies need laboratory conditions; we will advise which applies to your equipment.", serviceSlug: "calibration-services" },
  { topic: "Calibration", q: "Who decides the calibration interval?", a: "Your quality system sets the interval. We record as-found and as-left results so you have the drift history to justify it, and we can suggest intervals by instrument category." },
  { topic: "Calibration", q: "What happens if an instrument is out of tolerance?", a: "We record the as-found result, adjust the instrument where possible, and report the as-left result. You are informed immediately so you can review anything that relied on the reading." },
  { topic: "Testing & inspection", q: "Which NDT methods do you offer?", a: "Ultrasonic, radiographic, magnetic particle, liquid penetrant and visual testing, performed and reviewed by qualified Level II and Level III personnel.", serviceSlug: "non-destructive-testing" },
  { topic: "Testing & inspection", q: "Do you act as an independent third-party inspector?", a: "Yes. We witness inspection and test plans, inspect at vendor shops, and report independently to the party that appoints us.", serviceSlug: "third-party-inspection" },
  { topic: "Testing & inspection", q: "Do you supply the water and equipment for hydrotesting?", a: "We supply test pumps, calibrated gauges and recorders. Water supply and disposal are agreed per project in the test package.", serviceSlug: "hydro-testing" },
  { topic: "Certificates", q: "How do I verify a SAFETAG certificate?", a: "Enter the certificate reference in the verification field on the home or certifications page. If you need a confirmation letter, contact us with the reference." },
  { topic: "Certificates", q: "In what format are certificates issued?", a: "Certificates are issued as digitally authenticated PDF documents. Paper copies are available on request.", needsConfirmation: true },
];
