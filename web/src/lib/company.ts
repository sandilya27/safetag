// About-us content, shaped after the Strapi "about" single type. Figures and history are
// placeholders until SAFETAG supplies its company profile.

export const companyIntro =
  "SAFETAG is an independent technical services company in the Kingdom of Saudi Arabia. We calibrate, test and inspect the equipment that critical industry depends on, and we stand behind every result with a traceable certificate.";

export const principles = [
  { title: "Independent", body: "Our results answer to the standard, not to the schedule. That is what makes a third-party report worth having." },
  { title: "Traceable", body: "Every reading is traced back to a reference standard that is itself periodically verified." },
  { title: "Responsive", body: "Lab and field teams mobilise to your site, including during shutdown windows." },
];

/** Company facts. All pending confirmation from SAFETAG's profile. */
export const companyFacts = [
  { value: "0000", label: "Founded" },
  { value: "00+", label: "Engineers and technicians" },
  { value: "00", label: "Accredited calibration parameters" },
  { value: "13", label: "Service lines" },
].map((f) => ({ ...f, needsConfirmation: f.label !== "Service lines" }));

export const milestones = [
  ["0000", "SAFETAG founded in the Eastern Province"],
  ["0000", "Calibration laboratory opens"],
  ["0000", "ISO/IEC 17025 accreditation"],
  ["0000", "NDT and third-party inspection division"],
].map(([year, text]) => ({ year, text }));

export const leadership = [
  { initials: "MD", role: "Managing Director" },
  { initials: "TM", role: "Technical Manager" },
  { initials: "QM", role: "Quality Manager" },
  { initials: "OM", role: "Operations Manager" },
];
