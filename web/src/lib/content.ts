// Homepage content. Shaped after the Strapi "homepage" single type in the scroll spec,
// so this module can later be swapped for a CMS fetch without touching components.
// Facts marked needsConfirmation render an amber "TBC" marker until SAFETAG confirms them.
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

export type Service = {
  num: string;
  title: string;
  description: string;
  icon: LucideIcon;
  group: ServiceGroup;
  /** One of the 8 services on the orbiting ring. */
  ring: boolean;
};

const SERVICE_ROWS: [string, LucideIcon, string, ServiceGroup, boolean][] = [
  ["Calibration Services", Gauge, "Ensuring absolute accuracy and compliance for your industrial instruments through rigorous, traceable calibration procedures.", "cal", true],
  ["Non-Destructive Testing (NDT)", ScanSearch, "Advanced flaw detection and structural integrity analysis without compromising your materials or operational workflow.", "insp", true],
  ["Material & Mechanical Testing", Layers, "Comprehensive laboratory analysis to determine the strength, durability, and physical properties of your industrial materials.", "cal", true],
  ["Load Testing", Weight, "Verifying the structural safety and operational capacity of your lifting equipment, cranes, and heavy machinery.", "cal", true],
  ["Hydro Testing", Droplets, "Reliable leak and pressure testing for pipelines, pressure vessels, and storage tanks to guarantee operational safety.", "cal", true],
  ["Valve Testing", CircleDot, "Performance validation, calibration, and certification for industrial valves to prevent system failures and leaks.", "cal", true],
  ["Welding Testing", Flame, "Expert inspection and certification of welding procedures and welder qualifications to ensure structural integrity.", "cal", true],
  ["Third-Party Inspection", ClipboardCheck, "Independent verification, quality assurance, and compliance auditing to protect your project investments.", "insp", true],
  ["Environmental Testing", Thermometer, "Expert assessments and monitoring to ensure your operations comply with environmental safety and regulatory standards.", "cal", false],
  ["Torquing", Wrench, "Precision bolt tightening and tensioning services critical for the secure assembly of pipelines and industrial structures.", "field", false],
  ["Shutdown Jobs", Power, "Efficient, time-critical inspection and maintenance services designed to minimize downtime during plant turnarounds.", "field", false],
  ["Operation & Maintenance", Settings, "Ongoing technical support and strategic maintenance to guarantee the continuous reliability and longevity of your assets.", "field", false],
  ["Field Services", MapPin, "Deploying highly skilled engineers and technicians directly to your facility or field site for immediate support.", "field", false],
];

export const services: Service[] = SERVICE_ROWS.map(([title, icon, description, group, ring], i) => ({
  num: String(i + 1).padStart(2, "0"),
  title,
  description,
  icon,
  group,
  ring,
}));

export const ringServices = services.filter((s) => s.ring);
export const extraServices = services.filter((s) => !s.ring);

export const megaGroups = [
  { title: "Calibration & testing", items: services.filter((s) => s.group === "cal") },
  { title: "Inspection & NDT", items: services.filter((s) => s.group === "insp") },
  { title: "Plant & field", items: services.filter((s) => s.group === "field") },
];

export const heroFacts = [
  { value: "ISO/IEC 17025", label: "Accredited laboratories", needsConfirmation: true },
  { value: "LAB + ON-SITE", label: "Mobile calibration teams", needsConfirmation: false },
  { value: "24/7", label: "Shutdown response", needsConfirmation: true },
];

export const industries: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Oil & Gas Majors", icon: Fuel, description: "Calibration, NDT and metallurgical analysis for pipeline integrity and refinery operations in harsh environments." },
  { title: "Construction & Civil Engineering", icon: HardHat, description: "Soil, concrete and structural material testing for the Kingdom’s commercial mega-projects." },
  { title: "EPC Contractors", icon: Briefcase, description: "Responsive on-site third-party inspection, load testing and verification for accelerated timelines." },
  { title: "Manufacturing Plants", icon: Factory, description: "Equipment calibration, mechanical testing and continuous quality assurance on production lines." },
  { title: "Environmental Agencies", icon: Leaf, description: "Air quality monitoring, water analysis and environmental impact testing for regulatory adherence." },
  { title: "Utilities & Power Plants", icon: Zap, description: "Electrical calibration, valve certification and ongoing infrastructure integrity assessments." },
];

export const labZones = [
  ["Calibration & Metrology", "Pressure, temperature, dimensional, electrical, flow and mechanical calibration."],
  ["Metallurgical & Mechanical Testing", "Tensile, hardness, impact and chemical composition analysis."],
  ["NDT Sample Evaluation", "Level II & III inspectors reviewing UT, RT, MT and PT results."],
  ["Environmental & Air Quality Testing", "Sampling and analysis aligned with national environmental regulations."],
  ["Concrete & Soil Testing", "Material verification for civil and infrastructure projects."],
].map(([title, description], i) => ({ n: String(i + 1).padStart(2, "0"), title, description }));

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

export const projects = [
  { placeholder: "line illustration · pipeline spool", service: "HYDRO TESTING", location: "EASTERN PROVINCE", title: "Hydrostatic testing of a crude export line ahead of commissioning", metrics: [["00 km", "line tested"], ["0 days", "ahead of schedule"]] },
  { placeholder: "line illustration · process plant", service: "SHUTDOWN JOBS", location: "JUBAIL", title: "Turnaround calibration of pressure and temperature instruments", metrics: [["000", "instruments calibrated"], ["00 hrs", "shutdown window"]] },
  { placeholder: "line illustration · crane", service: "LOAD TESTING", location: "RIYADH", title: "Proof load testing and certification of site lifting equipment", metrics: [["00", "cranes certified"], ["000 t", "max test load"]] },
];

export const testimonials = [
  { quote: "SAFETAG mobilised a calibration team to site within 48 hours and closed out every instrument before the turnaround window.", initials: "QA", role: "QA/QC Manager", org: "EPC contractor · placeholder quote" },
  { quote: "Their NDT reports were clear, complete and accepted by our client’s inspectors without revision.", initials: "PE", role: "Project Engineer", org: "Petrochemical operator · placeholder quote" },
  { quote: "One partner for hydrotesting, valve testing and third-party inspection made the handover far simpler.", initials: "CM", role: "Construction Manager", org: "Infrastructure developer · placeholder quote" },
];

export const assistantChips = ["Which service do I need?", "Verify a certificate", "Turnaround times"];

export const companyLinks = ["About Us", "Industries", "Laboratories", "Certifications", "Projects", "Careers", "News & Insights", "FAQ", "Contact Us"];

export const contact = {
  phone: "+966 13 330 0199",
  phoneHref: "tel:+966133300199",
  email: "info@safetag.sa",
  address: "Eastern Province, Kingdom of Saudi Arabia",
};
