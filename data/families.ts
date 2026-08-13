/**
 * JIDOKA public product architecture — the 12 top-level component families (§71),
 * built from two verified sources ONLY:
 *   1. The JIDOKA catalogue (dev.db `Product` + `ProductDocument`).
 *   2. Real, already-classified customer demand from JIDOKA's internal sales data.
 *
 * `status` keeps the site honest (§4, §63):
 *   "catalogue"        → JIDOKA catalogue products exist in this family today.
 *   "demand-verified"  → strong, real customer demand; supplied on enquiry (no invented stock).
 *
 * `demandRank` orders families by real internal demand (§60) without exposing any
 * internal figures publicly (§81, §82).
 * Engineering context text is general, verifiable engineering knowledge — never an
 * invented JIDOKA-specific specification, certification, or claim (§3, §27).
 */

export type FamilyStatus = "catalogue" | "demand-verified";

export type Subfamily = {
  name: string;
  /** Maps to a catalogue product name where one exists, else undefined (enquiry-led). */
  product?: string;
};

export type Family = {
  id: string;
  slug: string;
  code: string; // short 2-letter engineering code for the explorer UI
  name: string;
  tagline: string;
  /** What it is / where it is used / why — engineering context, not a spec sheet. */
  blurb: string;
  status: FamilyStatus;
  /** internal dev.db categories that roll up into this public family */
  internalCategories: string[];
  /** 1 = highest real demand; used only for ordering. */
  demandRank: number;
  subfamilies: Subfamily[];
  /** Engineering-relationship intelligence (§28) — commonly-used-with families (by id). */
  commonlyUsedWith: string[];
  applications: string[];
};

export const families: Family[] = [
  {
    id: "mould-and-die",
    slug: "mould-and-die-components",
    code: "MD",
    name: "Mould & Die Components",
    tagline: "Ejector, guide, punch & die tooling components",
    blurb:
      "Precision components for plastic moulds and press dies — ejector pins, punches, button dies, guide pins and bushes, locating components and cooling parts. This is one of JIDOKA's highest-demand areas, driven by tool rooms and die makers.",
    status: "demand-verified",
    internalCategories: ["Linear Motion & Guides"],
    demandRank: 2,
    subfamilies: [
      { name: "Straight Ejector Pins" },
      { name: "Precision Ejector Pins" },
      { name: "Rectangular Ejector Pins" },
      { name: "Ejector Sleeves & Blades" },
      { name: "Punches" },
      { name: "Button Dies" },
      { name: "Locating Pins & Blocks", product: "Positioning Pin & Guide Bush for Jigs" },
      { name: "Guide Pins & Bushes", product: "Guide Shaft" },
      { name: "Leader Pins" },
      { name: "Cooling Components" },
    ],
    commonlyUsedWith: ["springs-and-force", "linear-motion", "machine-standard"],
    applications: ["mould-and-die", "tooling", "automotive"],
  },
  {
    id: "linear-motion",
    slug: "linear-motion-and-bearings",
    code: "LM",
    name: "Linear Motion & Bearings",
    tagline: "Shafts, bushings, guides, bearings & support",
    blurb:
      "Components that carry and guide motion: precision linear shafts, linear bushings and bearings, guide rails, oil-free bushings and slide plates, ball-screw and shaft supports. The backbone of accurate, repeatable machine movement.",
    status: "catalogue",
    internalCategories: ["Linear Motion & Guides", "Bearings"],
    demandRank: 3,
    subfamilies: [
      { name: "Linear Shafts", product: "Guide Shaft" },
      { name: "Rotation Shafts", product: "Rotation Shaft" },
      { name: "Shaft Supports", product: "Guide Shaft Support" },
      { name: "Linear Bearings", product: "Linear Bearing" },
      { name: "Linear Guide Rails", product: "Linear Guide Rail" },
      { name: "Oil-Free Bushings", product: "Oil-Free Bushing" },
      { name: "Ball Screw Supports", product: "Ball Screw Support" },
      { name: "Trapezoidal Screws", product: "Trapezoidal Screw" },
      { name: "Mounted Support Bearings", product: "Mounted Support Bearing" },
      { name: "Bearings & Cam Followers", product: "Bearings & Cam Followers" },
      { name: "Manual Displacement Tables", product: "Manual Displacement Table" },
    ],
    commonlyUsedWith: ["power-transmission", "machine-standard", "profile-frame"],
    applications: ["automation", "machine-building", "inspection"],
  },
  {
    id: "power-transmission",
    slug: "power-transmission",
    code: "PT",
    name: "Power Transmission",
    tagline: "Belts, pulleys, gears, chain & couplings",
    blurb:
      "Components that transmit and convert rotary power: timing belts and pulleys, flat conveyor belts, gears and racks, chain and sprockets, disc couplings, rollers and cable carriers.",
    status: "catalogue",
    internalCategories: ["Power Transmission"],
    demandRank: 5,
    subfamilies: [
      { name: "Timing Belts", product: "Timing Belt" },
      { name: "Timing Pulleys", product: "Timing Pulley" },
      { name: "Flat Belts (Conveyor)", product: "Flat Belts (Conveyor)" },
      { name: "Gear Racks", product: "Gear Rack" },
      { name: "Pulleys & Idlers", product: "Pulley & Idler" },
      { name: "Chain & Sprocket", product: "Chain & Sprocket" },
      { name: "Disc Couplings", product: "Disc Couplings" },
      { name: "Universal Joints", product: "Universal Joints" },
      { name: "Rollers", product: "Roller" },
      { name: "Urethane Rollers", product: "Urethane Rollers" },
      { name: "Drag Chain / Cable Carrier", product: "Drag Chain / Cable Carrier" },
    ],
    commonlyUsedWith: ["linear-motion", "machine-standard", "automation"],
    applications: ["machine-building", "conveying", "automation"],
  },
  {
    id: "springs-and-force",
    slug: "springs-and-force-components",
    code: "SP",
    name: "Springs & Force Components",
    tagline: "Coil, die, gas springs, dampers & shock absorbers",
    blurb:
      "Force-management components: coil and die springs across load ratings, gas springs, shock absorbers and dampers. JIDOKA's single largest demand family by value — used everywhere motion must be returned, cushioned or controlled.",
    status: "catalogue",
    internalCategories: ["Hardware & Fittings", "Functional Components"],
    demandRank: 1,
    subfamilies: [
      { name: "Coil Springs (Regular Load)", product: "Springs" },
      { name: "Die Springs" },
      { name: "Wire Springs" },
      { name: "Gas Springs" },
      { name: "Shock Absorbers", product: "Shock Absorbers & Protectives" },
      { name: "Dampers", product: "Dampers" },
    ],
    commonlyUsedWith: ["mould-and-die", "machine-standard", "linear-motion"],
    applications: ["mould-and-die", "automation", "machine-building"],
  },
  {
    id: "pneumatics",
    slug: "pneumatic-components",
    code: "PN",
    name: "Pneumatic Components",
    tagline: "Fittings, valves, vacuum, tubes & clamps",
    blurb:
      "Air and vacuum handling: quick fittings and joints, speed valves, nozzles, duct and hose, pneumatic clamps, vacuum generators, suckers and digital pressure switches.",
    status: "catalogue",
    internalCategories: ["Pneumatics"],
    demandRank: 8,
    subfamilies: [
      { name: "Pneumatic Joints & Speed Valves", product: "Pneumatic Joint & Speed Valve" },
      { name: "Pneumatic Clamps", product: "Pneumatic Clamps" },
      { name: "Nozzles", product: "Nozzle" },
      { name: "Duct & Hose", product: "Duct & Hose" },
      { name: "Vacuum Generators & Switches", product: "Vacuum Generator & Digital Pressure Switch" },
      { name: "Vacuum Suckers", product: "Vacuum Sucker" },
      { name: "Pneumatic Parts", product: "Pneumatic Parts" },
    ],
    commonlyUsedWith: ["automation", "machine-standard", "functional"],
    applications: ["automation", "assembly", "material-handling"],
  },
  {
    id: "machine-standard",
    slug: "machine-standard-components",
    code: "MS",
    name: "Machine Standard Components",
    tagline: "Fasteners, collars, washers, seals & mounts",
    blurb:
      "The standard mechanical hardware that machines are assembled from: fasteners, shaft collars and washers, sealing rings, struts, stands and clamps, and small precision parts.",
    status: "catalogue",
    internalCategories: ["Hardware & Fittings", "Functional Components", "Structural & Framing"],
    demandRank: 7,
    subfamilies: [
      { name: "Fasteners", product: "Fasteners" },
      { name: "Washers & Shaft Collars", product: "Washer & Shaft Collar" },
      { name: "Sealing Rings", product: "Sealing Ring" },
      { name: "Posts, Stands, Struts & Clamps", product: "Posts, Stands, Struts & Clamps" },
      { name: "Small Components", product: "Small Components" },
    ],
    commonlyUsedWith: ["linear-motion", "profile-frame", "power-transmission"],
    applications: ["machine-building", "assembly", "automation"],
  },
  {
    id: "automation",
    slug: "automation-components",
    code: "AU",
    name: "Automation Components",
    tagline: "Positioning, gripping, conveying & robots",
    blurb:
      "Components that build automated cells: single-axis robots, conveyor and gripping units, gripping components and positioning parts — the motion and handling layer of an automated line.",
    status: "catalogue",
    internalCategories: ["Automation & Robotics", "Functional Components"],
    demandRank: 9,
    subfamilies: [
      { name: "Single-Axis Robots", product: "Single-Axis Robot" },
      { name: "Conveyor & Gripping Units", product: "Conveyor & Gripping Units" },
      { name: "Gripping Components", product: "Gripping Components" },
      { name: "Positioning & Guide Components", product: "Positioning & Guide Components" },
    ],
    commonlyUsedWith: ["pneumatics", "linear-motion", "power-transmission"],
    applications: ["automation", "assembly", "material-handling", "robotics"],
  },
  {
    id: "profile-frame",
    slug: "profile-frame-and-structural",
    code: "PF",
    name: "Profile, Frame & Structural",
    tagline: "Aluminium extrusion, frames & structural parts",
    blurb:
      "Aluminium profile (extrusion) and the brackets, connectors and structural hardware used to build machine frames, guards, workstations and enclosures. A significant real-demand category at JIDOKA.",
    status: "catalogue",
    internalCategories: ["Structural & Framing"],
    demandRank: 4,
    subfamilies: [
      { name: "Aluminium Profile", product: "Aluminium Profile" },
      { name: "Posts, Stands, Struts & Clamps", product: "Posts, Stands, Struts & Clamps" },
      { name: "Brackets & Connectors" },
    ],
    commonlyUsedWith: ["machine-standard", "linear-motion", "functional"],
    applications: ["machine-building", "automation", "material-handling"],
  },
  {
    id: "industrial-materials",
    slug: "industrial-materials",
    code: "IM",
    name: "Industrial Materials",
    tagline: "Engineering plastics, plates, sheets & rods",
    blurb:
      "Engineering materials used in tooling and machine building — including urethane plates and other industrial material stock supplied on enquiry.",
    status: "catalogue",
    internalCategories: ["Functional Components"],
    demandRank: 10,
    subfamilies: [
      { name: "Urethane Plates", product: "Urethane Plates" },
      { name: "Engineering Plastics" },
      { name: "Plates, Sheets & Rods" },
    ],
    commonlyUsedWith: ["machine-standard", "mould-and-die"],
    applications: ["tooling", "machine-building", "industrial-manufacturing"],
  },
  {
    id: "cutting-tools",
    slug: "cutting-and-engineering-tools",
    code: "CT",
    name: "Cutting & Engineering Tools",
    tagline: "Drills, cutters & tooling",
    blurb:
      "Cutting and machining tools — cutters and drills for production. Made-to-order tooling is available on enquiry through the Engineering Desk.",
    status: "catalogue",
    internalCategories: ["Machining & Tooling"],
    demandRank: 11,
    subfamilies: [
      { name: "Cutters", product: "Cutters" },
      { name: "HSS Drills" },
      { name: "Carbide Tools" },
    ],
    commonlyUsedWith: ["machine-standard", "industrial-materials"],
    applications: ["tooling", "machine-building", "industrial-manufacturing"],
  },
  {
    id: "functional",
    slug: "functional-components",
    code: "FC",
    name: "Functional Components",
    tagline: "Handles, hinges, casters, latches & dampers",
    blurb:
      "The functional hardware that finishes a machine or enclosure: handles, hinges, casters, door latches, cantilever pins and other operator-facing parts.",
    status: "catalogue",
    internalCategories: ["Hardware & Fittings", "Functional Components"],
    demandRank: 6,
    subfamilies: [
      { name: "Handles", product: "Handles" },
      { name: "Hinges", product: "Hinges" },
      { name: "Hinge & Cantilever Pins", product: "Hinge & Cantilever Pin" },
      { name: "Casters", product: "Casters" },
      { name: "Door Latches", product: "Door Latches" },
      { name: "Other Functional Parts", product: "Other Functional Parts" },
    ],
    commonlyUsedWith: ["profile-frame", "machine-standard"],
    applications: ["machine-building", "material-handling", "industrial-manufacturing"],
  },
  {
    id: "custom",
    slug: "custom-components",
    code: "CX",
    name: "Custom Components",
    tagline: "Can't find the exact component?",
    blurb:
      "Made-to-drawing and special components. Send a drawing, CAD, PDF or photo with your material, dimensions, tolerance, finish and quantity and JIDOKA's engineering team will review it. Manufacturing capability is confirmed per enquiry — never assumed.",
    status: "demand-verified",
    internalCategories: [],
    demandRank: 12,
    subfamilies: [
      { name: "Made-to-Drawing Parts" },
      { name: "Special Tooling Components" },
      { name: "Modified Standard Components" },
    ],
    commonlyUsedWith: ["mould-and-die", "machine-standard"],
    applications: ["tooling", "machine-building", "mould-and-die"],
  },
];

export const familyById = new Map(families.map((f) => [f.id, f]));
export const familyBySlug = new Map(families.map((f) => [f.slug, f]));

/** Families ordered by real demand value — used for demand-led prioritisation (§60). */
export const familiesByDemand = [...families].sort((a, b) => a.demandRank - b.demandRank);
