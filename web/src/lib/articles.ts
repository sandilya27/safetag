// News & insights. Shaped after the Strapi "article" collection. These are draft articles
// written for layout and SEO structure; SAFETAG reviews and publishes the real set via the CMS.

export type ArticleBlock = { h2: string } | { p: string } | { ul: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Calibration" | "Inspection" | "Testing" | "Company";
  date: string; // ISO
  readMinutes: number;
  serviceSlug?: string;
  body: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "how-often-should-pressure-gauges-be-calibrated",
    title: "How often should pressure gauges be calibrated?",
    excerpt: "There is no single interval. Here is how criticality, drift history and your quality system decide it.",
    category: "Calibration",
    date: "2026-09-14",
    readMinutes: 5,
    serviceSlug: "calibration-services",
    body: [
      { p: "Every quality auditor will ask for it, yet the answer to “how often?” is rarely written down with a reason. A calibration interval should be a decision you can defend, not a habit carried over from the last plant." },
      { h2: "Start from criticality" },
      { p: "A gauge that protects people or a pressure boundary deserves a shorter interval than one used for indication only. Group your instruments by what happens if they read wrong." },
      { ul: ["Safety critical: relief settings, trip and alarm instruments", "Process critical: control loops that affect product quality", "Indication only: local gauges used for rounds"] },
      { h2: "Use the drift history" },
      { p: "Each calibration certificate records as-found and as-left values. If a gauge is repeatedly found in tolerance, the interval can often be extended. If it is found out of tolerance, shorten it and review the products or decisions that relied on it." },
      { h2: "Follow your own procedure" },
      { p: "ISO/IEC 17025 laboratories do not set your interval for you. Your quality system does. Write the rule down, apply it consistently, and keep the evidence on file." },
      { p: "If you are unsure where to start, our calibration engineers can review your instrument register and suggest intervals by category." },
    ],
  },
  {
    slug: "choosing-an-ndt-method",
    title: "UT, RT, MT or PT: choosing the right NDT method",
    excerpt: "Each method finds different flaws in different materials. A short guide to matching the method to the defect.",
    category: "Inspection",
    date: "2026-08-27",
    readMinutes: 6,
    serviceSlug: "non-destructive-testing",
    body: [
      { p: "Non-destructive testing is a family of methods, not one test. Picking the wrong one can mean a clean report on a component that still has a defect." },
      { h2: "Surface or volume?" },
      { p: "Liquid penetrant (PT) and magnetic particle (MT) testing find flaws that break or sit close to the surface. Ultrasonic (UT) and radiographic (RT) testing look through the full thickness." },
      { h2: "Material matters" },
      { ul: ["MT works only on ferromagnetic materials such as carbon steel", "PT works on most non-porous materials, including stainless steel and aluminium", "UT needs a coupling path and a trained operator to interpret the signal", "RT needs access to both sides and radiation safety controls on site"] },
      { h2: "Let the code decide" },
      { p: "In most projects the construction code or client specification already names the method and acceptance criteria. Our Level III personnel can review the specification with you before work begins." },
    ],
  },
  {
    slug: "preparing-for-a-hydrostatic-test",
    title: "Preparing for a hydrostatic test: a site checklist",
    excerpt: "Most hydrotest delays happen before the pump starts. What to have ready before the crew arrives.",
    category: "Testing",
    date: "2026-07-30",
    readMinutes: 4,
    serviceSlug: "hydro-testing",
    body: [
      { p: "A hydrostatic test proves a pressure boundary is sound. Done well it is routine. Done in a hurry it costs days." },
      { h2: "Before mobilisation" },
      { ul: ["Approved test package with test pressure, hold time and acceptance criteria", "Isolation points and blinds identified on the drawings", "Water source, quality and disposal route agreed", "Calibrated gauges and recorders with valid certificates"] },
      { h2: "On the day" },
      { p: "Fill slowly, vent high points, and let the temperature stabilise before you start the hold. Record everything, including the failures. A witnessed, well-documented test is what your client will accept." },
    ],
  },
  {
    slug: "what-iso-iec-17025-accreditation-means",
    title: "What ISO/IEC 17025 accreditation means for your certificates",
    excerpt: "Why an accredited certificate carries more weight in an audit, and what to check on every one you receive.",
    category: "Company",
    date: "2026-06-18",
    readMinutes: 4,
    body: [
      { p: "ISO/IEC 17025 sets the requirements for the competence of testing and calibration laboratories. Accreditation means an independent body has assessed the laboratory against it, for a defined scope." },
      { h2: "Check the scope" },
      { p: "Accreditation covers specific measurements and ranges. A certificate is only accredited for work inside that scope, so it is worth checking the laboratory’s scope document against your instruments." },
      { h2: "Read the certificate" },
      { ul: ["Unique certificate number and the instrument’s identification", "As-found and as-left results with measurement uncertainty", "Traceability statement to national or international standards", "Signature of an authorised person and the date of calibration"] },
      { p: "SAFETAG will publish its accreditation scope on the certifications page once confirmed." },
    ],
  },
];

export const articleHref = (a: Pick<Article, "slug">) => `/news/${a.slug}`;
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
