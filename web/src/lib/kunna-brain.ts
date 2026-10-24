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
  if (/just looking|browsing|only looking/.test(t))
    return { from: "bot", text: "No rush. Look around, and I will point things out as you go. Ask me whenever you like.", chips: SUGGESTIONS.slice(0, 2) };
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

/** What Kunna thinks aloud: a line, and optionally one place to go next. */
export type Thought = { text: string; cta?: [label: string, href: string]; choices?: [label: string, question: string][] };

const SECTION_THOUGHTS: Record<string, Thought[]> = {
  hero: [{ text: "Calibration, testing, inspection. Tell me your equipment and I will pick the service.", cta: ["See all services", "/services"] }],
  services: [
    { text: "Not sure which of these fits? Name the instrument and I will match it.", cta: ["Browse services", "/services"] },
    { text: "Each service lists its scope and standards. Open one to see if it covers your job." },
  ],
  industries: [{ text: "Which industry are you in? I can suggest the tests that usually apply.", cta: ["All industries", "/industries"] }],
  labs: [{ text: "Our laboratories are where traceable results come from. Ask me what can be tested there.", cta: ["Laboratories", "/laboratories"] }],
  calibration: [{ text: "Gauges, transmitters, thermocouples? Give me the instrument and I will point you on.", cta: ["Calibration services", "/services/calibration-services"] }],
  certifications: [{ text: "Got a certificate reference? You can verify it on the certifications page.", cta: ["Verify a certificate", "/certifications#verify"] }],
  projects: [{ text: "Have a look at jobs like yours. Describe yours and I will find the service.", cta: ["Projects", "/projects"] }],
  testimonials: [{ text: "Reading what clients say? When you are ready, a quote takes a few minutes.", cta: ["Request a Quote", "/request-a-quote"] }],
  assistant: [{ text: "That is me in the sample chat. Try one of the questions." }],
  footer: [{ text: "Ready? Start a quote, or call the team.", cta: ["Request a Quote", "/request-a-quote"] }],
};

// Inner pages: one line per section in reading order, repeating if the page has more sections.
const PAGE_THOUGHTS: [prefix: string, lines: Thought[]][] = [
  ["/services/", [{ text: "Does this match your equipment? Ask me, or start a quote for it.", cta: ["Request a Quote", "/request-a-quote"] }, { text: "Check the standards listed here against your job spec." }]],
  ["/services", [{ text: "Tell me the equipment and I will narrow these down." }, { text: "Some services run in the lab, some on site, some both. I can tell you which." }]],
  ["/request-a-quote", [{ text: "Take it one step at a time. Your answers are kept as you go." }, { text: "Not sure which service? Ask me and come back." }]],
  ["/certifications", [{ text: "Verifying a certificate? Have the reference ready." }, { text: "Questions about accreditation? Ask me." }]],
  ["/laboratories", [{ text: "Wondering if your equipment can come to the lab? Ask me." }]],
  ["/industries", [{ text: "Find your industry, then see which services usually go with it." }]],
  ["/projects", [{ text: "Similar job in mind? Tell me about it and I will match a service." }]],
  ["/about", [{ text: "The short version: we calibrate, test and inspect across the Kingdom." }]],
  ["/contact", [{ text: "Want a quick answer first? Ask me before you write." }]],
  ["/faq", [{ text: "Cannot find your answer here? Ask me." }]],
  ["/careers", [{ text: "Curious about a role? I can point you to the open positions." }]],
  ["/news", [{ text: "Looking for something specific? Ask me and I will point you." }]],
];

/**
 * The thought for a section that has come into view, or null when she has nothing useful to add.
 * `visit` counts earlier thoughts for the same section, so a second visit gets a different line.
 */
export function thoughtFor(key: string, heading: string | undefined, path: string, index: number, visit: number): Thought | null {
  const own = SECTION_THOUGHTS[key];
  if (own) return own[visit % own.length];
  const page = PAGE_THOUGHTS.find(([p]) => path.startsWith(p))?.[1];
  if (page) return page[index % page.length];
  const h = heading?.trim();
  return h && h.length <= 44 ? { text: `Reading about ${h.toLowerCase()}? Tell me what you are after and I will guide you.` } : null;
}
export const IDLE_LINE = "Still there? Tell me about your equipment and I will point you to a service.";
export const EXIT_LINE = "Before you go: want a quote? It takes a few minutes.";
export const FORM_ERROR = "Almost. Check the highlighted field.";
export const FORM_DONE = "Sent. Thank you!";

type Intro = { thought: Thought; mood: "happy" | "excited" | "celebrate" };
const part = (h: number) => (h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");

/**
 * How Kunna introduces herself when a visitor arrives. Several styles, never the same one twice in a
 * row for the same visitor: plain, time-aware, a question with quick answers, playful, and (for
 * someone who has been here before) a welcome back. `last` is the id used last time.
 */
export function introFor(hour: number, returning: boolean, last: number): { id: number } & Intro {
  const styles: [id: number, when: boolean, make: () => Intro][] = [
    [0, !returning, () => ({ mood: "happy", thought: { text: "Hi, I am Kunna, SAFETAG's assistant. I live on this page and I know the services well." } })],
    [1, !returning, () => ({ mood: "happy", thought: { text: `${part(hour)}! I am Kunna. Tell me what you need checked and I will find the right SAFETAG service.` } })],
    [
      2,
      true,
      () => ({
        mood: "excited",
        thought: {
          text: "Hello! Kunna here. What brings you to SAFETAG today?",
          choices: [["Calibration", "I need calibration"], ["Testing", "Tell me about NDT"], ["A certificate", "Verify a certificate"], ["Just looking", "Just looking"]],
        },
      }),
    ],
    [3, !returning, () => ({ mood: "celebrate", thought: { text: "Psst, over here! I am Kunna. Calibration, testing, inspection: ask me anything." } })],
    [4, !returning, () => ({ mood: "happy", thought: { text: "I am Kunna, the SAFETAG shield with eyes. Describe your equipment and I will point you to the service." } })],
    [5, returning, () => ({ mood: "excited", thought: { text: "Welcome back! Kunna here, still on duty.", cta: ["Start a quote", "/request-a-quote"] } })],
    [6, returning, () => ({ mood: "happy", thought: { text: `${part(hour)} again! Pick up where you left off, or ask me something new.` } })],
    [7, hour >= 21 || hour < 5, () => ({ mood: "happy", thought: { text: "Working late? I am Kunna. Ask away, I will keep you company." } })],
  ];
  const pool = styles.filter(([, when]) => when);
  const fresh = pool.filter(([id]) => id !== last);
  const [id, , make] = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
  return { id, ...make() };
}
