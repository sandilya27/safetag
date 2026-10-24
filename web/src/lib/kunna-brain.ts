// What Kunna says. Pure functions: the keyword matcher behind the assistant (until the AI API is
// connected) and the proactive nudges shown on each page.
import { contact, services, type Service } from "./content";

export type Msg = { from: "me" | "bot"; text: string; services?: Service[]; links?: [string, string][]; chips?: string[]; miss?: boolean };

export const SUGGESTIONS = ["Pressure gauges need calibration", "PSV testing during a shutdown", "Verify a certificate"];

const TALK = "Talk to an engineer";
const WHERE = "Lab or on-site?";

// Words visitors use for each service, beyond the service title itself.
const KEYWORDS: Record<string, string[]> = {
  "calibration-services": ["calibrat", "gauge", "transmitter", "thermocouple", "rtd", "meter", "scale", "balance", "instrument", "micrometer", "caliper"],
  "non-destructive-testing": ["ndt", "ultrasonic", "radiograph", "x-ray", "magnetic particle", "penetrant", "crack", "flaw", "thickness"],
  "material-mechanical-testing": ["tensile", "hardness", "impact", "charpy", "material", "metallurg", "pmi", "composition"],
  "load-testing": ["load test", "crane", "hoist", "lifting", "sling", "shackle", "forklift"],
  "hydro-testing": ["hydro", "pressure test", "leak", "pipeline", "vessel", "tank", "pneumatic"],
  "valve-testing": ["valve", "psv", "relief", "safety valve", "set pressure"],
  "welding-testing": ["weld", "wps", "pqr", "welder"],
  "third-party-inspection": ["third party", "third-party", "tpi", "vendor", "itp", "witness", "coating", "expedit"],
  "environmental-testing": ["environment", "air quality", "emission", "stack", "noise", "water", "soil"],
  torquing: ["torqu", "bolt", "tension", "flange"],
  "shutdown-jobs": ["shutdown", "turnaround", "outage"],
  "operation-maintenance": ["maintenance", "o&m", "preventive"],
  "field-services": ["on site", "on-site", "field", "mobilis", "mobiliz"],
};

const whereText = (s: Service) => (s.where === "lab" ? "in our laboratory" : s.where === "site" ? "at your site" : "in our laboratory or at your site");

export const GREETING: Msg = {
  from: "bot",
  text: "Hi, I am Kunna. Describe your equipment or the job, and I will point you to the right SAFETAG service.",
  chips: SUGGESTIONS,
};

/** A gentle follow-up when the visitor goes quiet in an open chat. */
export const FOLLOW_UPS: Msg[] = [
  { from: "bot", text: "Still here if you need me. What equipment are you working with?", chips: SUGGESTIONS },
  { from: "bot", text: "I can also take you straight to a quote or to an engineer.", links: [["Request a Quote", "/request-a-quote"], ["Contact us", "/contact"]] },
];

/** Match a question to services and site pages. Runs locally until the AI API is connected. */
export function answer(q: string): Msg {
  const t = q.toLowerCase();
  if (/certificat|verif/.test(t))
    return { from: "bot", text: "You can check a certificate reference on the certifications page. For a confirmation letter, contact us with the reference.", links: [["Verify a certificate", "/certifications#verify"], ["Contact us", "/contact"]], chips: [TALK] };
  if (/price|cost|quot|how much/.test(t))
    return { from: "bot", text: "Every quotation is prepared by an engineer for your scope. The quote form takes a few minutes.", links: [["Request a Quote", "/request-a-quote"]], chips: [TALK] };
  if (/job|career|vacanc|hiring|cv/.test(t)) return { from: "bot", text: "Open roles and the application form are on the careers page.", links: [["Careers", "/careers"]] };
  if (/phone|call|email|address|contact|where are you|engineer|human|speak to|talk to/.test(t))
    return { from: "bot", text: `You can call ${contact.phone} or email ${contact.email}.`, links: [["Contact page", "/contact"]] };
  if (/lab or on-?site|in the lab|at my site/.test(t))
    return { from: "bot", text: "It depends on the service: some run in our laboratory, some at your site, some both. Name the equipment and I will tell you which applies.", chips: SUGGESTIONS.slice(0, 2) };
  const more = services.find((s) => t.includes(`more about ${s.title.toLowerCase()}`));
  if (more)
    return { from: "bot", text: `${more.description} Available ${whereText(more)}.`, links: [["Start a quote", `/request-a-quote?service=${more.slug}`], ["All services", "/services"]], chips: [WHERE, TALK] };
  const scored = services
    .map((s) => ({ s, score: (KEYWORDS[s.slug] ?? []).filter((k) => t.includes(k)).length + (t.includes(s.title.toLowerCase()) ? 2 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.s);
  if (scored.length)
    return {
      from: "bot",
      text: scored.length > 1 ? "That sounds like one of these services. Shall I start a quote with it?" : `That falls under ${scored[0].title}. Shall I start a quote with it?`,
      services: scored,
      chips: [scored.length === 1 ? `Tell me more about ${scored[0].title}` : WHERE, WHERE, TALK].filter((c, i, a) => a.indexOf(c) === i),
    };
  return {
    from: "bot",
    miss: true,
    text: "I could not match that to a service. An engineer can help: send your requirement through the quote form, or call us.",
    links: [["Request a Quote", "/request-a-quote"], ["Browse all services", "/services"]],
    chips: [TALK, SUGGESTIONS[0]],
  };
}

const NUDGES: [prefix: string, line: string][] = [
  ["/request-a-quote", "Stuck on the form? Describe the job and I can suggest the right service."],
  ["/certifications", "Need to check a certificate? I can take you straight to the verifier."],
  ["/services", "Looking for something specific? Tell me the equipment and I will narrow it down."],
  ["/laboratories", "Wondering what we can test in the lab? Ask me about your equipment."],
  ["/contact", "Want a quick answer first? Ask me before you write to the team."],
  ["/careers", "Curious about a role? I can point you to the open positions."],
  ["/projects", "Have a similar job in mind? Tell me about it and I will find the service."],
];
const HOME = "Hi, I am Kunna. Need calibration, testing or inspection? Ask me.";
const LATER = ["Still looking? Tell me what needs testing and I will find the service.", "One quick question can save you a search. I am here if you need me.", "Want a human? I can give you the engineers' number."];

/** The nudge line for a page. `n` is how many nudges this session has already shown. */
export function nudgeFor(path: string, n: number): string {
  if (n > 0) return LATER[(n - 1) % LATER.length];
  if (path === "/") return HOME;
  return NUDGES.find(([p]) => path.startsWith(p))?.[1] ?? "Can I help you find the right service?";
}
