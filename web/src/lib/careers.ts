// Careers content, shaped after the Strapi "job opening" collection. Openings are samples
// for layout until SAFETAG's HR team publishes real roles through the CMS.

export type Opening = { slug: string; title: string; team: string; location: string; type: string; summary: string };

export const openings: Opening[] = [
  { slug: "calibration-technician", title: "Calibration Technician", team: "Calibration & Metrology", location: "Dammam", type: "Full time", summary: "Calibrate pressure, temperature and dimensional instruments in the laboratory and on client sites." },
  { slug: "ndt-level-ii-inspector", title: "NDT Level II Inspector (UT / RT)", team: "Inspection & NDT", location: "Jubail", type: "Full time", summary: "Perform and report ultrasonic and radiographic inspections on piping, vessels and structural welds." },
  { slug: "welding-inspector", title: "Welding Inspector", team: "Inspection & NDT", location: "Eastern Province, site based", type: "Contract", summary: "Witness welder qualifications and inspect fabrication against project specifications." },
  { slug: "quality-engineer", title: "Quality Engineer", team: "Quality & Accreditation", location: "Dammam", type: "Full time", summary: "Maintain the laboratory quality system and support accreditation assessments." },
];

export const careerValues = [
  { title: "Accuracy first", body: "We would rather report an uncomfortable result than a convenient one." },
  { title: "Field and lab", body: "Engineers rotate between laboratory work and site work to stay sharp in both." },
  { title: "Qualified people", body: "We support certification and training for every technical role." },
];
