/**
 * Applications, Industries, Solutions and Machine-based discovery (§29–§31).
 * Content is **general, verifiable engineering knowledge** (what a packaging machine or a
 * mould typically needs) mapped to JIDOKA's real component families — never a fabricated
 * JIDOKA capability, customer story or specification (§3, §45, §68). Detailed write-ups and
 * case studies are added only when verified; every page ends in a technical enquiry (§67).
 */
import { families, type Family, familyById } from "./families";

export type DiscoveryItem = {
  slug: string;
  name: string;
  blurb: string;
  familyIds: string[];
  /** 1–2 sentence engineering overview. */
  overview?: string;
  /** Technical considerations when selecting components for this context. */
  considerations?: string[];
};

/** What each family contributes — used to render "common component needs" (§30). */
export const familyNeed: Record<string, string> = {
  "mould-and-die": "Ejector pins, punches, guide components and die parts",
  "linear-motion": "Shafts, bushings, bearings and guides for accurate motion",
  "power-transmission": "Belts, pulleys, gears and chain to move power",
  "springs-and-force": "Springs, gas springs and dampers for force and return",
  pneumatics: "Fittings, valves and vacuum for pneumatic actuation",
  "machine-standard": "Fasteners, collars, washers and seals",
  automation: "Positioning, gripping and conveying units",
  "profile-frame": "Aluminium profile and structural framing",
  "industrial-materials": "Engineering plastics, plates and material stock",
  "cutting-tools": "Cutters, drills and machining tools",
  functional: "Handles, hinges, casters and latches",
  custom: "Made-to-drawing and special components",
};

export const applications: DiscoveryItem[] = [
  {
    slug: "mould-and-die", name: "Mould & Die", blurb: "Ejector, guide, punch and die components for plastic moulds and press dies.",
    familyIds: ["mould-and-die", "springs-and-force", "linear-motion", "machine-standard"],
    overview: "Moulds and press dies rely on precise, hard-wearing components that repeat to tight tolerance over millions of cycles — ejection, guiding, cutting and cooling all matter.",
    considerations: ["Match ejector pin material/hardness (e.g. SKD61, SKH51) to the moulded material and cycle life.", "Guide components must hold alignment under repeated load.", "Springs and dampers control ejection force and return.", "Cooling components affect cycle time and part quality."],
  },
  {
    slug: "automation", name: "Automation", blurb: "Positioning, motion, gripping and handling for automated cells and lines.",
    familyIds: ["automation", "pneumatics", "linear-motion", "power-transmission"],
    overview: "Automated cells combine precise motion, reliable actuation and repeatable handling — the components must integrate cleanly and cycle reliably.",
    considerations: ["Size linear motion for the payload, stroke and required accuracy.", "Pneumatics must match available air supply and cycle rate.", "Gripping and positioning parts drive repeatability.", "Consider duty cycle and maintenance access."],
  },
  {
    slug: "machine-building", name: "Machine Building", blurb: "Frames, motion, transmission and hardware for building industrial machines.",
    familyIds: ["profile-frame", "linear-motion", "power-transmission", "machine-standard"],
    overview: "A machine is built up from a rigid frame, guided motion, power transmission and the standard hardware that fastens it together.",
    considerations: ["Aluminium profile section and connectors set frame rigidity.", "Match transmission ratios and torque to the drive.", "Standardise fasteners and hardware to simplify assembly and spares."],
  },
  {
    slug: "packaging", name: "Packaging", blurb: "Motion, transmission and pneumatic components for packaging machinery.",
    familyIds: ["power-transmission", "pneumatics", "linear-motion", "functional"],
    overview: "Packaging machines run at high rate with frequent format changes — smooth transport, fast actuation and easy access are key.",
    considerations: ["Belts and rollers set line speed and product transport.", "Pneumatics drive sealing, cutting and diverting at cycle rate.", "Functional hardware supports guards and quick-change access."],
  },
  {
    slug: "assembly", name: "Assembly", blurb: "Positioning, fastening and pneumatic handling for assembly stations.",
    familyIds: ["automation", "pneumatics", "machine-standard", "profile-frame"],
    overview: "Assembly stations need repeatable positioning, reliable clamping and an ergonomic, reconfigurable structure.",
    considerations: ["Positioning parts set locating accuracy.", "Pneumatic clamps and grippers hold and present parts.", "Profile framing enables quick reconfiguration."],
  },
  {
    slug: "inspection", name: "Inspection", blurb: "Precise linear motion and positioning for measurement and inspection systems.",
    familyIds: ["linear-motion", "automation", "machine-standard"],
    overview: "Measurement and vision systems depend on smooth, accurate, low-vibration motion and stable mounting.",
    considerations: ["Prioritise motion accuracy and repeatability over speed.", "Minimise backlash and vibration.", "Stable, kinematic mounting improves measurement stability."],
  },
  {
    slug: "robotics", name: "Robotics", blurb: "Motion, gripping and structural components for robotic systems and end-effectors.",
    familyIds: ["automation", "pneumatics", "linear-motion", "profile-frame"],
    overview: "Robotic cells and end-effectors combine motion, pneumatic gripping and lightweight structure around the robot.",
    considerations: ["Keep end-effector mass low to preserve payload.", "Match gripping force and stroke to the part.", "Profile framing builds safe, reconfigurable cells."],
  },
  {
    slug: "material-handling", name: "Material Handling", blurb: "Conveying, gripping and structural components for handling and conveyors.",
    familyIds: ["power-transmission", "automation", "profile-frame", "functional"],
    overview: "Handling systems move product reliably between processes — transport, transfer and guidance components dominate.",
    considerations: ["Rollers, belts and chain set conveying capacity.", "Gripping/transfer units handle pick-and-place.", "Casters and functional hardware aid mobility and access."],
  },
  {
    slug: "tooling", name: "Tooling", blurb: "Precision components and materials for jigs, fixtures and tool rooms.",
    familyIds: ["mould-and-die", "cutting-tools", "industrial-materials", "machine-standard"],
    overview: "Jigs, fixtures and tooling need precise locating, durable wear parts and the right material stock.",
    considerations: ["Locating pins and bushes set fixture accuracy.", "Select tool and material grades for the operation.", "Standard hardware holds the assembly repeatably."],
  },
  {
    slug: "industrial-manufacturing", name: "Industrial Manufacturing", blurb: "General-purpose components across manufacturing machines and equipment.",
    familyIds: ["machine-standard", "power-transmission", "linear-motion", "functional"],
    overview: "General manufacturing equipment draws on the full breadth of standard mechanical components.",
    considerations: ["Standardise on common component families to simplify sourcing and spares.", "Balance cost, availability and duty cycle."],
  },
  {
    slug: "conveying", name: "Conveying", blurb: "Rollers, belts, chain and structural components for conveyor systems.",
    familyIds: ["power-transmission", "profile-frame", "functional"],
    overview: "Conveyors are built from transport elements on a rigid frame with guarding and access hardware.",
    considerations: ["Match roller/belt type to load and environment.", "Frame rigidity affects tracking and wear.", "Plan for tensioning and maintenance access."],
  },
];

export const industries: DiscoveryItem[] = [
  {
    slug: "automotive", name: "Automotive", blurb: "Tooling, die and automation components for automotive manufacturing and its supply chain.",
    familyIds: ["mould-and-die", "springs-and-force", "linear-motion", "power-transmission"],
    overview: "Automotive manufacturing demands high-cycle-life tooling, precise automation and dependable supply across a large component base.",
    considerations: ["High cycle life and consistent quality are critical.", "Standardise components across lines and plants.", "Plan repeat and bulk supply for production continuity."],
  },
  {
    slug: "tool-and-die", name: "Tool & Die", blurb: "The mould, die and precision tooling components at the core of JIDOKA's demand.",
    familyIds: ["mould-and-die", "springs-and-force", "cutting-tools", "industrial-materials"],
    overview: "Tool rooms and die makers rely on precise ejection, guiding and cutting components plus the right material grades.",
    considerations: ["Material/hardness selection drives tool life.", "Guide and locate to tight tolerance.", "Springs manage ejection and stripping force."],
  },
  {
    slug: "packaging", name: "Packaging", blurb: "Components for packaging-machine builders and packaging lines.",
    familyIds: ["power-transmission", "pneumatics", "linear-motion", "profile-frame"],
    overview: "Packaging OEMs and lines need high-rate transport, fast pneumatic actuation and quick format change.",
    considerations: ["Line speed and changeover time drive selection.", "Hygiene/environment may constrain materials.", "Design for fast, tool-free access."],
  },
  {
    slug: "electronics-3c", name: "Electronics / 3C", blurb: "Precision motion and handling for electronics and 3C assembly.",
    familyIds: ["automation", "linear-motion", "pneumatics"],
    overview: "Electronics and 3C assembly needs fine, repeatable motion and gentle, precise handling of small parts.",
    considerations: ["High positioning accuracy and repeatability.", "Low-particulate, clean operation where required.", "Gentle gripping for delicate components."],
  },
  {
    slug: "industrial-robotics", name: "Industrial Robotics", blurb: "Motion, gripping and structure for robotic automation.",
    familyIds: ["automation", "pneumatics", "linear-motion", "profile-frame"],
    overview: "Robotic automation integrates end-effectors, auxiliary motion and safe cell structure.",
    considerations: ["Minimise end-effector mass.", "Match gripping to part geometry and weight.", "Build safe, reconfigurable guarded cells."],
  },
  {
    slug: "general-manufacturing", name: "General Manufacturing", blurb: "Standard mechanical components across manufacturing equipment.",
    familyIds: ["machine-standard", "power-transmission", "functional", "linear-motion"],
    overview: "General manufacturers source broadly across standard mechanical component families.",
    considerations: ["Standardise to simplify sourcing and spares.", "Balance cost, lead time and duty."],
  },
  {
    slug: "machine-building", name: "Machine Building", blurb: "For OEMs and machine builders sourcing across multiple component families.",
    familyIds: ["profile-frame", "linear-motion", "power-transmission", "machine-standard"],
    overview: "Machine builders need coordinated multi-family supply — often against a BOM — with technical support.",
    considerations: ["Coordinate multi-line BOM supply.", "Design for assembly and serviceability.", "Repeat supply supports production runs."],
  },
  {
    slug: "electrical", name: "Electrical", blurb: "Enclosure, structural and functional hardware for electrical equipment.",
    familyIds: ["profile-frame", "functional", "machine-standard"],
    overview: "Electrical equipment needs enclosures, structural framing and reliable functional hardware.",
    considerations: ["Framing and enclosure hardware set the structure.", "Hinges, latches and handles for access.", "Standard fasteners for assembly."],
  },
];

export const solutions: DiscoveryItem[] = [
  {
    slug: "mould-and-die", name: "Mould & Die", blurb: "Ejector pins, guide components, punches, button dies, springs and cooling parts for moulds and press dies.",
    familyIds: ["mould-and-die", "springs-and-force", "linear-motion", "machine-standard"],
    overview: "A complete component solution for mould and die making — ejection, guiding, cutting, force management and cooling.",
    considerations: ["Specify pin material/hardness for cycle life.", "Springs manage ejection and stripping.", "Guide and locate to tight tolerance."],
  },
  {
    slug: "automation", name: "Automation", blurb: "Positioning, linear motion, gripping and pneumatic handling to build automated cells.",
    familyIds: ["automation", "pneumatics", "linear-motion", "power-transmission"],
    overview: "Everything to build an automated cell: guided motion, pneumatic actuation, gripping and transport.",
    considerations: ["Size motion for payload, stroke and accuracy.", "Match pneumatics to air supply and rate.", "Repeatability comes from positioning parts."],
  },
  {
    slug: "machine-building", name: "Machine Building", blurb: "Aluminium frames, motion, transmission and standard hardware for machine builders.",
    familyIds: ["profile-frame", "linear-motion", "power-transmission", "machine-standard"],
    overview: "The building blocks of an industrial machine — frame, guided motion, power transmission and hardware.",
    considerations: ["Profile section sets frame rigidity.", "Match transmission to torque and ratio.", "Standardise hardware for assembly and spares."],
  },
  {
    slug: "linear-motion", name: "Linear Motion", blurb: "Shafts, bushings, bearings, guide rails and supports for accurate, repeatable motion.",
    familyIds: ["linear-motion", "machine-standard", "power-transmission"],
    overview: "A focused solution for accurate, repeatable linear and rotary motion.",
    considerations: ["Select for load, stroke and accuracy.", "Oil-free options reduce maintenance.", "Support and align shafts correctly."],
  },
  {
    slug: "power-transmission", name: "Power Transmission", blurb: "Timing belts and pulleys, gears, chain, couplings and rollers to move power.",
    familyIds: ["power-transmission", "linear-motion", "machine-standard"],
    overview: "Components to transmit and convert rotary power efficiently and reliably.",
    considerations: ["Match ratio, torque and speed.", "Consider backlash for positioning drives.", "Plan tensioning and alignment."],
  },
  {
    slug: "pneumatics", name: "Pneumatics", blurb: "Fittings, valves, vacuum, nozzles and clamps for pneumatic systems.",
    familyIds: ["pneumatics", "automation", "functional"],
    overview: "A complete pneumatic and vacuum handling solution.",
    considerations: ["Match fittings and tube to pressure and bore.", "Size vacuum for the part and surface.", "Speed valves tune actuation."],
  },
  {
    slug: "component-sourcing", name: "Component Sourcing", blurb: "Multi-line, bulk and repeat supply support across every JIDOKA component family.",
    familyIds: ["mould-and-die", "linear-motion", "springs-and-force", "machine-standard"],
    overview: "Coordinated sourcing across multiple component families — including from a BOM — for OEMs and procurement teams.",
    considerations: ["Consolidate multi-family requirements.", "Plan repeat and bulk supply.", "Send a BOM for a single coordinated review."],
  },
];

export function familiesFor(item: DiscoveryItem): Family[] {
  return item.familyIds.map((id) => familyById.get(id)).filter(Boolean) as Family[];
}

export const applicationBySlug = new Map(applications.map((a) => [a.slug, a]));
export const industryBySlug = new Map(industries.map((i) => [i.slug, i]));
export const solutionBySlug = new Map(solutions.map((s) => [s.slug, s]));
export { families };
