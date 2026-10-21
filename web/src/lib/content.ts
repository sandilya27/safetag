// Site content. Shaped after the Strapi content types in the scroll spec (homepage single
// type; service, industry, project collections), so this module can later be swapped for a
// CMS fetch without touching components.
// Facts marked needsConfirmation (or listed under a TBC heading) render an amber "TBC"
// marker until SAFETAG confirms them.
import {
  Briefcase,
  CircleDot,
  ClipboardCheck,
  Droplets,
  Factory,
  Flame,
  Fuel,
  Gauge,
  HardHat,
  Layers,
  Leaf,
  MapPin,
  Power,
  ScanSearch,
  Settings,
  Thermometer,
  Weight,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ServiceGroup = "cal" | "insp" | "field";
/** Where the work happens: at a SAFETAG laboratory, at the client's site, or either. */
export type ServiceWhere = "lab" | "site" | "both";

export type Service = {
  num: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  group: ServiceGroup;
  /** One of the 8 services on the orbiting ring. */
  ring: boolean;
  where: ServiceWhere;
  /** What the service covers. Pending SAFETAG confirmation. */
  scope: string[];
  /** Codes and standards the work is commonly performed to. Pending SAFETAG confirmation. */
  standards: string[];
};

type ServiceRow = [title: string, slug: string, icon: LucideIcon, description: string, group: ServiceGroup, ring: boolean, where: ServiceWhere, scope: string[], standards: string[]];

const SERVICE_ROWS: ServiceRow[] = [
  [
    "Calibration Services", "calibration-services", Gauge,
    "Ensuring absolute accuracy and compliance for your industrial instruments through rigorous, traceable calibration procedures.",
    "cal", true, "both",
    ["Pressure gauges, transmitters and switches", "Temperature sensors, RTDs and thermocouples", "Dimensional instruments: calipers, micrometers and gauge blocks", "Electrical meters, clamp meters and insulation testers", "Flow meters and torque tools", "Weighing scales and balances"],
    ["ISO/IEC 17025", "SASO", "Manufacturer procedures"],
  ],
  [
    "Non-Destructive Testing (NDT)", "non-destructive-testing", ScanSearch,
    "Advanced flaw detection and structural integrity analysis without compromising your materials or operational workflow.",
    "insp", true, "both",
    ["Ultrasonic testing (UT) and thickness gauging", "Radiographic testing (RT)", "Magnetic particle testing (MT)", "Liquid penetrant testing (PT)", "Visual testing (VT)", "Level II and Level III report review"],
    ["ASME Section V", "ISO 9712", "ASNT SNT-TC-1A"],
  ],
  [
    "Material & Mechanical Testing", "material-mechanical-testing", Layers,
    "Comprehensive laboratory analysis to determine the strength, durability, and physical properties of your industrial materials.",
    "cal", true, "lab",
    ["Tensile, yield and elongation", "Hardness: Brinell, Rockwell and Vickers", "Charpy impact testing", "Bend and flattening tests", "Chemical composition and positive material identification", "Macro and micro examination"],
    ["ASTM E8", "ASTM E23", "ISO 6892"],
  ],
  [
    "Load Testing", "load-testing", Weight,
    "Verifying the structural safety and operational capacity of your lifting equipment, cranes, and heavy machinery.",
    "cal", true, "site",
    ["Proof load testing of cranes and hoists", "Slings, shackles and spreader beams", "Padeyes and lifting lugs", "Forklifts and aerial work platforms", "Water-bag load testing"],
    ["ASME B30 series", "BS EN 13155", "ISO 4309"],
  ],
  [
    "Hydro Testing", "hydro-testing", Droplets,
    "Reliable leak and pressure testing for pipelines, pressure vessels, and storage tanks to guarantee operational safety.",
    "cal", true, "site",
    ["Pipelines and piping spools", "Pressure vessels and heat exchangers", "Storage tanks", "Pneumatic and leak testing", "Pressure recording on calibrated chart recorders"],
    ["ASME B31.3", "ASME Section VIII", "API 650"],
  ],
  [
    "Valve Testing", "valve-testing", CircleDot,
    "Performance validation, calibration, and certification for industrial valves to prevent system failures and leaks.",
    "cal", true, "both",
    ["Safety and relief valve set-pressure testing", "Shell and seat leak testing", "Control valve calibration", "Bench and in-situ testing", "Test certificates for every valve tag"],
    ["API 598", "API 527", "API 6D"],
  ],
  [
    "Welding Testing", "welding-testing", Flame,
    "Expert inspection and certification of welding procedures and welder qualifications to ensure structural integrity.",
    "cal", true, "both",
    ["Welding procedure qualification (WPS / PQR)", "Welder performance qualification", "Visual weld inspection", "Destructive testing of test coupons", "Welding inspection on fabrication sites"],
    ["ASME Section IX", "AWS D1.1", "API 1104"],
  ],
  [
    "Third-Party Inspection", "third-party-inspection", ClipboardCheck,
    "Independent verification, quality assurance, and compliance auditing to protect your project investments.",
    "insp", true, "site",
    ["Vendor and shop inspection", "Inspection and test plan witnessing", "Pre-shipment and receipt inspection", "Coating and painting inspection", "Fabrication and erection surveillance", "Expediting"],
    ["ISO/IEC 17020", "Client specifications"],
  ],
  [
    "Environmental Testing", "environmental-testing", Thermometer,
    "Expert assessments and monitoring to ensure your operations comply with environmental safety and regulatory standards.",
    "cal", false, "both",
    ["Ambient air quality monitoring", "Stack emission testing", "Noise surveys", "Water and wastewater analysis", "Soil sampling"],
    ["NCEC regulations", "US EPA methods"],
  ],
  [
    "Torquing", "torquing", Wrench,
    "Precision bolt tightening and tensioning services critical for the secure assembly of pipelines and industrial structures.",
    "field", false, "site",
    ["Controlled bolt torquing", "Hydraulic bolt tensioning", "Flange joint integrity records", "Torque tool calibration"],
    ["ASME PCC-1"],
  ],
  [
    "Shutdown Jobs", "shutdown-jobs", Power,
    "Efficient, time-critical inspection and maintenance services designed to minimize downtime during plant turnarounds.",
    "field", false, "site",
    ["Instrument calibration inside the turnaround window", "Valve and relief valve testing campaigns", "NDT and inspection of static equipment", "Crew and equipment mobilisation", "Close-out documentation"],
    ["Client turnaround plans"],
  ],
  [
    "Operation & Maintenance", "operation-maintenance", Settings,
    "Ongoing technical support and strategic maintenance to guarantee the continuous reliability and longevity of your assets.",
    "field", false, "site",
    ["Preventive maintenance programmes", "Instrument and equipment upkeep", "Condition monitoring", "Calibration recall scheduling"],
    ["Client maintenance procedures"],
  ],
  [
    "Field Services", "field-services", MapPin,
    "Deploying highly skilled engineers and technicians directly to your facility or field site for immediate support.",
    "field", false, "site",
    ["On-site calibration teams", "On-site NDT crews", "Inspection engineers on call", "Mobilisation across the Kingdom"],
    ["Client site requirements"],
  ],
];

export const services: Service[] = SERVICE_ROWS.map(([title, slug, icon, description, group, ring, where, scope, standards], i) => ({
  num: String(i + 1).padStart(2, "0"),
  slug,
  title,
  description,
  icon,
  group,
  ring,
  where,
  scope,
  standards,
}));

export const serviceHref = (s: Pick<Service, "slug">) => `/services/${s.slug}`;
export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const ringServices = services.filter((s) => s.ring);
export const extraServices = services.filter((s) => !s.ring);

export const groupTitles: Record<ServiceGroup, string> = {
  cal: "Calibration & testing",
  insp: "Inspection & NDT",
  field: "Plant & field",
};

export const megaGroups = (Object.keys(groupTitles) as ServiceGroup[]).map((g) => ({ group: g, title: groupTitles[g], items: services.filter((s) => s.group === g) }));

export const whereLabel: Record<ServiceWhere, string> = {
  lab: "At a SAFETAG laboratory",
  site: "At your site",
  both: "In our labs or at your site",
};

export const heroFacts = [
  { value: "ISO/IEC 17025", label: "Accredited laboratories", needsConfirmation: true },
  { value: "LAB + ON-SITE", label: "Mobile calibration teams", needsConfirmation: false },
  { value: "24/7", label: "Shutdown response", needsConfirmation: true },
];

export type Industry = { slug: string; title: string; description: string; icon: LucideIcon; needs: string[]; services: string[] };

export const industries: Industry[] = [
  {
    slug: "oil-gas", title: "Oil & Gas Majors", icon: Fuel,
    description: "Calibration, NDT and metallurgical analysis for pipeline integrity and refinery operations in harsh environments.",
    needs: ["Pipeline and piping integrity ahead of commissioning", "Relief valve certification on a recall schedule", "Turnaround calibration inside a fixed window"],
    services: ["non-destructive-testing", "hydro-testing", "valve-testing", "shutdown-jobs"],
  },
  {
    slug: "construction", title: "Construction & Civil Engineering", icon: HardHat,
    description: "Soil, concrete and structural material testing for the Kingdom’s commercial mega-projects.",
    needs: ["Material verification for structural steel and rebar", "Load testing of site lifting equipment", "Weld inspection on structural fabrication"],
    services: ["material-mechanical-testing", "load-testing", "welding-testing", "third-party-inspection"],
  },
  {
    slug: "epc", title: "EPC Contractors", icon: Briefcase,
    description: "Responsive on-site third-party inspection, load testing and verification for accelerated timelines.",
    needs: ["Vendor inspection and ITP witnessing", "Hydrotest and pneumatic test packages", "Bolt torquing and flange records for handover"],
    services: ["third-party-inspection", "hydro-testing", "torquing", "field-services"],
  },
  {
    slug: "manufacturing", title: "Manufacturing Plants", icon: Factory,
    description: "Equipment calibration, mechanical testing and continuous quality assurance on production lines.",
    needs: ["Instrument calibration for quality audits", "Incoming material testing", "Preventive maintenance of critical equipment"],
    services: ["calibration-services", "material-mechanical-testing", "operation-maintenance"],
  },
  {
    slug: "environmental", title: "Environmental Agencies", icon: Leaf,
    description: "Air quality monitoring, water analysis and environmental impact testing for regulatory adherence.",
    needs: ["Ambient air and stack emission monitoring", "Water and wastewater analysis", "Evidence for regulatory reporting"],
    services: ["environmental-testing", "calibration-services"],
  },
  {
    slug: "utilities", title: "Utilities & Power Plants", icon: Zap,
    description: "Electrical calibration, valve certification and ongoing infrastructure integrity assessments.",
    needs: ["Electrical and process instrument calibration", "Valve testing during planned outages", "Integrity assessment of pressure equipment"],
    services: ["calibration-services", "valve-testing", "non-destructive-testing", "shutdown-jobs"],
  },
];

export const industryHref = (i: Pick<Industry, "slug">) => `/industries#${i.slug}`;

export const labZones = [
  ["Calibration & Metrology", "Pressure, temperature, dimensional, electrical, flow and mechanical calibration.", ["Pressure", "Temperature", "Dimensional", "Electrical", "Flow", "Torque"]],
  ["Metallurgical & Mechanical Testing", "Tensile, hardness, impact and chemical composition analysis.", ["Universal testing machine", "Hardness testers", "Impact tester", "Spectrometer"]],
  ["NDT Sample Evaluation", "Level II & III inspectors reviewing UT, RT, MT and PT results.", ["Film and digital radiography review", "UT data review", "Reference blocks"]],
  ["Environmental & Air Quality Testing", "Sampling and analysis aligned with national environmental regulations.", ["Air samplers", "Gas analysers", "Water analysis bench"]],
  ["Concrete & Soil Testing", "Material verification for civil and infrastructure projects.", ["Compression testing", "Soil classification", "Moisture and density"]],
].map(([title, description, equipment], i) => ({ n: String(i + 1).padStart(2, "0"), title: title as string, description: description as string, equipment: equipment as string[] }));

/** Calibration demo readout. Illustrative values for animation only. */
export const demoReadout = { label: "DIMENSIONAL", target: 32, unit: "mm", decimals: 2, tolerance: 4 };

export const certifications = [
  ["ISO/IEC 17025:2017", "Testing & calibration laboratories"],
  ["ISO 9001:2015", "Quality management system"],
  ["ISO 45001:2018", "Occupational health & safety"],
  ["ISO 14001:2015", "Environmental management"],
  ["SASO / GAC", "National conformity & accreditation"],
  ["Saudi Aramco vendor approval", "Approved scope to be confirmed"],
].map(([name, description]) => ({ name, description }));

export type Project = {
  slug: string;
  placeholder: string;
  service: string;
  serviceSlug: string;
  industry: string;
  location: string;
  title: string;
  metrics: [string, string][];
  challenge: string;
  approach: string[];
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "crude-export-line-hydrotest",
    placeholder: "line illustration · pipeline spool",
    service: "HYDRO TESTING", serviceSlug: "hydro-testing", industry: "oil-gas", location: "EASTERN PROVINCE",
    title: "Hydrostatic testing of a crude export line ahead of commissioning",
    metrics: [["00 km", "line tested"], ["0 days", "ahead of schedule"]],
    challenge: "A new crude export line had to be pressure tested section by section and handed over before a fixed commissioning date, with every test witnessed and recorded.",
    approach: ["Test packages prepared and agreed with the client’s inspectors before mobilisation", "Calibrated pressure recorders and gauges issued with certificates for each section", "Fill, stabilise, hold and drain sequence run by a dedicated crew per section", "Results documented the same day for client sign-off"],
    outcome: "All sections passed and the test records were accepted without revision, clearing the line for commissioning.",
  },
  {
    slug: "turnaround-instrument-calibration",
    placeholder: "line illustration · process plant",
    service: "SHUTDOWN JOBS", serviceSlug: "shutdown-jobs", industry: "oil-gas", location: "JUBAIL",
    title: "Turnaround calibration of pressure and temperature instruments",
    metrics: [["000", "instruments calibrated"], ["00 hrs", "shutdown window"]],
    challenge: "Several hundred pressure and temperature instruments had to be removed, calibrated and reinstalled inside a short planned shutdown.",
    approach: ["Instrument list split by unit and priority with the client’s planners", "Shift teams working around the clock alongside the client’s crews", "Tag-by-tag tracking so the client could see progress in real time", "Out-of-tolerance instruments flagged immediately for replacement"],
    outcome: "Every instrument on the list was calibrated and returned before restart, with certificates issued for the full scope.",
  },
  {
    slug: "site-lifting-equipment-load-testing",
    placeholder: "line illustration · crane",
    service: "LOAD TESTING", serviceSlug: "load-testing", industry: "construction", location: "RIYADH",
    title: "Proof load testing and certification of site lifting equipment",
    metrics: [["00", "cranes certified"], ["000 t", "max test load"]],
    challenge: "A large construction site needed its tower cranes, mobile cranes and lifting accessories proof tested and certified before heavy lifts could begin.",
    approach: ["Inspection of each crane and accessory before testing", "Proof loads applied with certified test weights and water bags", "Defects recorded with photographs and corrective actions", "Certificates and a lifting equipment register issued to the client"],
    outcome: "The site’s lifting equipment was certified on schedule and the register now drives the client’s re-test plan.",
  },
];

export const projectHref = (p: Pick<Project, "slug">) => `/projects/${p.slug}`;
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const testimonials = [
  { quote: "SAFETAG mobilised a calibration team to site within 48 hours and closed out every instrument before the turnaround window.", initials: "QA", role: "QA/QC Manager", org: "EPC contractor · placeholder quote" },
  { quote: "Their NDT reports were clear, complete and accepted by our client’s inspectors without revision.", initials: "PE", role: "Project Engineer", org: "Petrochemical operator · placeholder quote" },
  { quote: "One partner for hydrotesting, valve testing and third-party inspection made the handover far simpler.", initials: "CM", role: "Construction Manager", org: "Infrastructure developer · placeholder quote" },
];

export const assistantChips = ["Which service do I need?", "Verify a certificate", "Turnaround times"];

export const companyLinks: [label: string, href: string][] = [
  ["About Us", "/about"],
  ["Industries", "/industries"],
  ["Laboratories", "/laboratories"],
  ["Certifications", "/certifications"],
  ["Projects", "/projects"],
  ["Careers", "/careers"],
  ["News & Insights", "/news"],
  ["FAQ", "/faq"],
  ["Contact Us", "/contact"],
];

export const contact = {
  phone: "+966 13 330 0199",
  phoneHref: "tel:+966133300199",
  email: "info@safetag.sa",
  address: "Eastern Province, Kingdom of Saudi Arabia",
  hours: "Sunday to Thursday, 8:00 to 17:00",
};
