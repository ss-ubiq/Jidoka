/**
 * The 50 verified JIDOKA catalogue products (source: dev.db `Product` + `ProductDocument`).
 * Owned by the website so it stays self-contained (§79). Each product links to its public
 * `family` (data/families.ts) and to its real catalogue PDF in /public/catalogues (§26, §36).
 * Structured specs are intentionally omitted — the real technical data lives in the catalogue
 * document, and the site never invents specifications (§3).
 */
export type CatalogueProduct = {
  code: string;
  name: string;
  slug: string;
  family: string;
  internalCategory: string;
  catalogueFile: string | null;
  catalogueSizeMB: number;
  /** Additional catalogue documents for this product (e.g. supplements). */
  extraDocs?: { file: string; sizeMB: number; title: string }[];
};

export const catalogueProducts: CatalogueProduct[] = [
  { code: "JID-CONVEYOR-GRIPPING-UNITS", name: "Conveyor & Gripping Units", slug: "conveyor-and-gripping-units", family: "automation", internalCategory: "Functional Components", catalogueFile: "/catalogues/Conveyor-and-Gripping-Units.pdf", catalogueSizeMB: 49.3 },
  { code: "JID-GRIPPING-COMPONENTS", name: "Gripping Components", slug: "gripping-components", family: "automation", internalCategory: "Functional Components", catalogueFile: "/catalogues/Gripping-Components.pdf", catalogueSizeMB: 54.6 },
  { code: "JID-SINGLE-AXIS-ROBOT", name: "Single-Axis Robot", slug: "single-axis-robot", family: "automation", internalCategory: "Automation & Robotics", catalogueFile: "/catalogues/Single-Axis-Robot.pdf", catalogueSizeMB: 33.9 },
  { code: "JID-CUTTERS", name: "Cutters", slug: "cutters", family: "cutting-tools", internalCategory: "Machining & Tooling", catalogueFile: "/catalogues/Cutters.pdf", catalogueSizeMB: 8.3 },
  { code: "JID-CASTERS", name: "Casters", slug: "casters", family: "functional", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Casters.pdf", catalogueSizeMB: 9.5 },
  { code: "JID-DOOR-LATCHES", name: "Door Latches", slug: "door-latches", family: "functional", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Door-Latches.pdf", catalogueSizeMB: 34.2 },
  { code: "JID-HANDLES", name: "Handles", slug: "handles", family: "functional", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Handles.pdf", catalogueSizeMB: 77.4 },
  { code: "JID-HINGE-CANTILEVER-PIN", name: "Hinge & Cantilever Pin", slug: "hinge-and-cantilever-pin", family: "functional", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Hinge-and-Cantilever-Pin.pdf", catalogueSizeMB: 65.4 },
  { code: "JID-HINGES", name: "Hinges", slug: "hinges", family: "functional", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Hinges.pdf", catalogueSizeMB: 12.3 },
  { code: "JID-OTHER-FUNCTIONAL-PARTS", name: "Other Functional Parts", slug: "other-functional-parts", family: "functional", internalCategory: "Functional Components", catalogueFile: "/catalogues/Other-Functional-Parts.pdf", catalogueSizeMB: 20.8 },
  { code: "JID-URETHANE-PLATES", name: "Urethane Plates", slug: "urethane-plates", family: "industrial-materials", internalCategory: "Functional Components", catalogueFile: "/catalogues/Urethane-Plates.pdf", catalogueSizeMB: 10.9 },
  { code: "JID-BALL-SCREW-SUPPORT", name: "Ball Screw Support", slug: "ball-screw-support", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Ball-Screw-Support.pdf", catalogueSizeMB: 73.7, extraDocs: [{ file: "/catalogues/Ball-Screw-Support-Supplement.pdf", sizeMB: 11.6, title: "Ball Screw Support — Supplement Catalogue" }] },
  { code: "JID-BEARINGS-CAM-FOLLOWERS", name: "Bearings & Cam Followers", slug: "bearings-and-cam-followers", family: "linear-motion", internalCategory: "Bearings", catalogueFile: "/catalogues/Bearings-and-Cam-Followers.pdf", catalogueSizeMB: 17.0 },
  { code: "JID-GUIDE-SHAFT", name: "Guide Shaft", slug: "guide-shaft", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Guide-Shaft.pdf", catalogueSizeMB: 59.1 },
  { code: "JID-GUIDE-SHAFT-SUPPORT", name: "Guide Shaft Support", slug: "guide-shaft-support", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Guide-Shaft-Support.pdf", catalogueSizeMB: 50.3 },
  { code: "JID-LINEAR-BEARING", name: "Linear Bearing", slug: "linear-bearing", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Linear-Bearing.pdf", catalogueSizeMB: 65.0 },
  { code: "JID-LINEAR-GUIDE-RAIL", name: "Linear Guide Rail", slug: "linear-guide-rail", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Linear-Guide-Rail.pdf", catalogueSizeMB: 30.6 },
  { code: "JID-MANUAL-DISPLACEMENT-TABLE", name: "Manual Displacement Table", slug: "manual-displacement-table", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Manual-Displacement-Table.pdf", catalogueSizeMB: 16.1 },
  { code: "JID-MOUNTED-SUPPORT-BEARING", name: "Mounted Support Bearing", slug: "mounted-support-bearing", family: "linear-motion", internalCategory: "Bearings", catalogueFile: "/catalogues/Mounted-Support-Bearing.pdf", catalogueSizeMB: 3.3 },
  { code: "JID-OIL-FREE-BUSHING", name: "Oil-Free Bushing", slug: "oil-free-bushing", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Oil-Free-Bushing.pdf", catalogueSizeMB: 102.3 },
  { code: "JID-POSITIONING-GUIDE-COMPONENTS", name: "Positioning & Guide Components", slug: "positioning-and-guide-components", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Positioning-and-Guide-Components.pdf", catalogueSizeMB: 8.1 },
  { code: "JID-POSITIONING-PIN-GUIDE", name: "Positioning Pin & Guide Bush for Jigs", slug: "positioning-pin-and-guide-bush-for-jigs", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Positioning-Pin-and-Guide-Bush-for-Jigs.pdf", catalogueSizeMB: 4.4 },
  { code: "JID-ROTATION-SHAFT", name: "Rotation Shaft", slug: "rotation-shaft", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Rotation-Shaft.pdf", catalogueSizeMB: 6.8 },
  { code: "JID-SHAFT-SUPPORT-FIXED", name: "Shaft Support \u2013 Fixed / Right-angle", slug: "shaft-support-fixed-right-angle", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Shaft-Support-Fixed-Right-angle.pdf", catalogueSizeMB: 68.9 },
  { code: "JID-TRAPEZOIDAL-SCREW", name: "Trapezoidal Screw", slug: "trapezoidal-screw", family: "linear-motion", internalCategory: "Linear Motion & Guides", catalogueFile: "/catalogues/Trapezoidal-Screw.pdf", catalogueSizeMB: 80.4 },
  { code: "JID-FASTENERS", name: "Fasteners", slug: "fasteners", family: "machine-standard", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Fasteners.pdf", catalogueSizeMB: 76.1 },
  { code: "JID-SEALING-RING", name: "Sealing Ring", slug: "sealing-ring", family: "machine-standard", internalCategory: "Functional Components", catalogueFile: "/catalogues/Sealing-Ring.pdf", catalogueSizeMB: 7.8 },
  { code: "JID-SMALL-COMPONENTS", name: "Small Components", slug: "small-components", family: "machine-standard", internalCategory: "Functional Components", catalogueFile: "/catalogues/Small-Components.pdf", catalogueSizeMB: 34.8 },
  { code: "JID-WASHER-SHAFT-COLLAR", name: "Washer & Shaft Collar", slug: "washer-and-shaft-collar", family: "machine-standard", internalCategory: "Functional Components", catalogueFile: "/catalogues/Washer-and-Shaft-Collar.pdf", catalogueSizeMB: 6.4 },
  { code: "JID-DUCT-HOSE", name: "Duct & Hose", slug: "duct-and-hose", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Duct-and-Hose.pdf", catalogueSizeMB: 7.6 },
  { code: "JID-NOZZLE", name: "Nozzle", slug: "nozzle", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Nozzle.pdf", catalogueSizeMB: 8.6 },
  { code: "JID-PNEUMATIC-CLAMPS", name: "Pneumatic Clamps", slug: "pneumatic-clamps", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Pneumatic-Clamps.pdf", catalogueSizeMB: 5.6 },
  { code: "JID-PNEUMATIC-JOINT-SPEED", name: "Pneumatic Joint & Speed Valve", slug: "pneumatic-joint-and-speed-valve", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Pneumatic-Joint-and-Speed-Valve.pdf", catalogueSizeMB: 62.2 },
  { code: "JID-PNEUMATIC-PARTS", name: "Pneumatic Parts", slug: "pneumatic-parts", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Pneumatic-Parts.pdf", catalogueSizeMB: 23.1 },
  { code: "JID-VACUUM-GENERATOR-DIGITAL", name: "Vacuum Generator & Digital Pressure Switch", slug: "vacuum-generator-and-digital-pressure-switch", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Vacuum-Generator-and-Digital-Pressure-Switch.pdf", catalogueSizeMB: 26.3 },
  { code: "JID-VACUUM-SUCKER", name: "Vacuum Sucker", slug: "vacuum-sucker", family: "pneumatics", internalCategory: "Pneumatics", catalogueFile: "/catalogues/Vacuum-Sucker.pdf", catalogueSizeMB: 7.8 },
  { code: "JID-CHAIN-SPROCKET", name: "Chain & Sprocket", slug: "chain-and-sprocket", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Chain-and-Sprocket.pdf", catalogueSizeMB: 184.9 },
  { code: "JID-DISC-COUPLINGS", name: "Disc Couplings", slug: "disc-couplings", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Disc-Couplings.pdf", catalogueSizeMB: 50.5 },
  { code: "JID-DRAG-CHAIN-CABLE", name: "Drag Chain / Cable Carrier", slug: "drag-chain-cable-carrier", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Drag-Chain-Cable-Carrier.pdf", catalogueSizeMB: 111.4 },
  { code: "JID-FLAT-BELTS-CONVEYOR", name: "Flat Belts (Conveyor)", slug: "flat-belts-conveyor", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Flat-Belts-Conveyor.pdf", catalogueSizeMB: 35.0 },
  { code: "JID-GEAR-RACK", name: "Gear Rack", slug: "gear-rack", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Gear-Rack.pdf", catalogueSizeMB: 45.7 },
  { code: "JID-PULLEY-IDLER", name: "Pulley & Idler", slug: "pulley-and-idler", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Pulley-and-Idler.pdf", catalogueSizeMB: 42.7 },
  { code: "JID-ROLLER", name: "Roller", slug: "roller", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Roller.pdf", catalogueSizeMB: 32.0 },
  { code: "JID-URETHANE-ROLLERS", name: "Urethane Rollers", slug: "urethane-rollers", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Urethane-Rollers.pdf", catalogueSizeMB: 124.0 },
  { code: "JID-UNIVERSAL-JOINTS", name: "Universal Joints", slug: "universal-joints", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Disc-Couplings.pdf", catalogueSizeMB: 50.5 },
  { code: "JID-TIMING-BELT", name: "Timing Belt", slug: "timing-belt", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Timing-Belt.pdf", catalogueSizeMB: 3.1 },
  { code: "JID-TIMING-PULLEY", name: "Timing Pulley", slug: "timing-pulley", family: "power-transmission", internalCategory: "Power Transmission", catalogueFile: "/catalogues/Timing-Pulley.pdf", catalogueSizeMB: 22.8 },
  { code: "JID-ALUMINIUM-PROFILE", name: "Aluminium Profile", slug: "aluminium-profile", family: "profile-frame", internalCategory: "Structural & Framing", catalogueFile: "/catalogues/Aluminium-Profile.pdf", catalogueSizeMB: 47.5 },
  { code: "JID-POSTS-STANDS-STRUTS", name: "Posts, Stands, Struts & Clamps", slug: "posts-stands-struts-and-clamps", family: "profile-frame", internalCategory: "Structural & Framing", catalogueFile: "/catalogues/Posts-Stands-Struts-and-Clamps.pdf", catalogueSizeMB: 13.7 },
  { code: "JID-DAMPERS", name: "Dampers", slug: "dampers", family: "springs-and-force", internalCategory: "Functional Components", catalogueFile: "/catalogues/Dampers.pdf", catalogueSizeMB: 18.1 },
  { code: "JID-SHOCK-ABSORBERS-PROTECTIVES", name: "Shock Absorbers & Protectives", slug: "shock-absorbers-and-protectives", family: "springs-and-force", internalCategory: "Functional Components", catalogueFile: "/catalogues/Shock-Absorbers-and-Protectives.pdf", catalogueSizeMB: 18.1 },
  { code: "JID-SPRINGS", name: "Springs", slug: "springs", family: "springs-and-force", internalCategory: "Hardware & Fittings", catalogueFile: "/catalogues/Springs.pdf", catalogueSizeMB: 5.8 },
];

export const productsByFamily = catalogueProducts.reduce<Record<string, CatalogueProduct[]>>((acc, p) => {
  (acc[p.family] ||= []).push(p);
  return acc;
}, {});

export const productBySlug = new Map(catalogueProducts.map((p) => [p.slug, p]));
