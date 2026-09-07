/**
 * Catalogue sections inside the Component Configurator, each mapped to the JIDOKA
 * catalogue product it was transcribed from, so every configured product links back to
 * its own catalogue (§26, §36 — a product is never shown without its catalogue).
 *
 * Two catalogue products have no section here because their pages were not transcribed:
 * JID-CONVEYOR-GRIPPING-UNITS and JID-UNIVERSAL-JOINTS (the latter shares the Disc
 * Couplings book). Cutters was likewise left out of the configurator build.
 *
 * `configurator/publish_web.py` (in the offline build tooling) parses this file to bake
 * the catalogue links into the generated page — keep the literal shape simple, one entry
 * per line, or its regex will stop matching and the build will fail loudly.
 */
import { catalogueProducts } from "./products";
import { families } from "./families";

export type CatalogueSection = {
  /** Section key used by the configurator payload. */
  key: string;
  /** Section title as it reads in the configurator. */
  title: string;
  /** data/products.ts code of the catalogue these pages came from. */
  product: string;
  families: number;
  codes: number;
  /** Set where the source PDF's filename disagrees with what its pages actually contain. */
  note?: string;
};

export const catalogueSections: CatalogueSection[] = [
  { key: "Aluminium-Profile",                       title: "Aluminium Profiles",                        product: "JID-ALUMINIUM-PROFILE",           families:  139, codes:  210 },
  { key: "AA7-2",                                   title: "Ball Screw Supports",                       product: "JID-BALL-SCREW-SUPPORT",          families:   10, codes:   10 },
  { key: "AA7-3",                                   title: "Ball Screw Supports (2)",                   product: "JID-BALL-SCREW-SUPPORT",          families:   10, codes:   10,
    note: "Second Ball Screw Support section - the supplement catalogue." },
  { key: "Bearing-and-Cam-Followers",               title: "Bearings and Cam Followers",                product: "JID-BEARINGS-CAM-FOLLOWERS",      families:   53, codes:  202 },
  { key: "CASTERS",                                 title: "Casters",                                   product: "JID-CASTERS",                     families:   34, codes:   64 },
  { key: "chain-sprocket",                          title: "Chains and Sprockets",                      product: "JID-CHAIN-SPROCKET",              families:   36, codes:  110 },
  { key: "JJ1-4",                                   title: "Dampers",                                   product: "JID-DAMPERS",                     families:   10, codes:   10 },
  { key: "cj2-1",                                   title: "Disc Couplings",                            product: "JID-DISC-COUPLINGS",              families:   13, codes:   30 },
  { key: "DOOR-LATCHES",                            title: "Door Latches",                              product: "JID-DOOR-LATCHES",                families:   35, codes:   74 },
  { key: "AA9-3",                                   title: "Drag Chains",                               product: "JID-DRAG-CHAIN-CABLE",            families:   14, codes:   21 },
  { key: "EE3-4",                                   title: "Ducts and Hoses",                           product: "JID-DUCT-HOSE",                   families:    2, codes:    6 },
  { key: "FASTENERS",                               title: "Fasteners",                                 product: "JID-FASTENERS",                   families:   35, codes:   51 },
  { key: "FB2-1",                                   title: "Flat Belts",                                product: "JID-FLAT-BELTS-CONVEYOR",         families:   10, codes:   42 },
  { key: "BB5-3",                                   title: "Gear Racks",                                product: "JID-GEAR-RACK",                   families:   12, codes:   57 },
  { key: "Griping-Components",                      title: "Gripping Components",                       product: "JID-GRIPPING-COMPONENTS",         families:    9, codes:   10 },
  { key: "HANDLES",                                 title: "Handles",                                   product: "JID-HANDLES",                     families:   41, codes:   75 },
  { key: "JJ1-2",                                   title: "Heat Insulating Plates",                    product: "JID-URETHANE-PLATES",             families:    2, codes:    8,
    note: "Source PDF is filed as Urethane Plates but its pages are heat insulating plates." },
  { key: "HINGES",                                  title: "Hinges",                                    product: "JID-HINGES",                      families:   76, codes:  104 },
  { key: "Hinge-and-Cantilever-Pin",                title: "Hinges and Cantilever Pins",                product: "JID-HINGE-CANTILEVER-PIN",        families:   15, codes:   77 },
  { key: "AA4-2",                                   title: "Linear Bushings",                           product: "JID-LINEAR-BEARING",              families:   18, codes:   97 },
  { key: "AA6-3",                                   title: "Linear Guide Rails",                        product: "JID-LINEAR-GUIDE-RAIL",           families:    9, codes:   18 },
  { key: "AA1-3",                                   title: "Linear Shafts",                             product: "JID-GUIDE-SHAFT",                 families:   23, codes:   90 },
  { key: "manual-displacement-table",               title: "Manual Displacement Tables",                product: "JID-MANUAL-DISPLACEMENT-TABLE",   families:   46, codes:   55 },
  { key: "Mounted-Support-Bearing",                 title: "Mounted Support Bearings",                  product: "JID-MOUNTED-SUPPORT-BEARING",     families:   17, codes:   56 },
  { key: "EE3-3",                                   title: "Nozzles",                                   product: "JID-NOZZLE",                      families:    4, codes:    4 },
  { key: "AA5-2",                                   title: "Oil-Free Bushings",                         product: "JID-OIL-FREE-BUSHING",            families:   21, codes:   46 },
  { key: "Other-Funtional-parts",                   title: "Other Functional Parts",                    product: "JID-OTHER-FUNCTIONAL-PARTS",      families:    8, codes:   15 },
  { key: "Pneumatic-Clamps",                        title: "Pneumatic Clamps",                          product: "JID-PNEUMATIC-CLAMPS",            families:   42, codes:   86 },
  { key: "EE3-2",                                   title: "Pneumatic Joints and Speed Valves",         product: "JID-PNEUMATIC-JOINT-SPEED",       families:   14, codes:   27 },
  { key: "EE4-2",                                   title: "Pneumatic Parts",                           product: "JID-PNEUMATIC-PARTS",             families:   10, codes:   44 },
  { key: "Positioning-Pin-and-Guide-Bush-for-Jigs", title: "Positioning Pins and Guide Bushes",         product: "JID-POSITIONING-PIN-GUIDE",       families:   39, codes:  126 },
  { key: "Positioning-and-guide-components",        title: "Positioning and Guide Components",          product: "JID-POSITIONING-GUIDE-COMPONENTS", families:   31, codes:  194 },
  { key: "Post-Stands-struds-clamps",               title: "Post Stands, Struts and Clamps",            product: "JID-POSTS-STANDS-STRUTS",         families:   62, codes:  240 },
  { key: "BB7-2",                                   title: "Pulleys and Idlers",                        product: "JID-PULLEY-IDLER",                families:   26, codes:  106 },
  { key: "BB4-4",                                   title: "Rollers",                                   product: "JID-ROLLER",                      families:    9, codes:   16,
    note: "Steel and plastic ball rollers (ball transfer units)." },
  { key: "rollers",                                 title: "Rollers (2)",                               product: "JID-URETHANE-ROLLERS",            families:   23, codes:  128,
    note: "Lined conveyor rollers - matched to the Urethane Rollers catalogue." },
  { key: "Rotation-Shaft",                          title: "Rotation Shafts",                           product: "JID-ROTATION-SHAFT",              families:   25, codes:  147 },
  { key: "II3-2",                                   title: "Sealing Rings",                             product: "JID-SEALING-RING",                families:    5, codes:   28 },
  { key: "AA3-2",                                   title: "Shaft Collars",                             product: "JID-SHAFT-SUPPORT-FIXED",         families:   19, codes:   96,
    note: "Source PDF is filed as Shaft Support (Fixed / Right-angle) but its pages are shaft collars - the PDF filename is mislabelled, the transcription follows the printed pages." },
  { key: "AA2-2",                                   title: "Shaft Supports",                            product: "JID-GUIDE-SHAFT-SUPPORT",         families:   11, codes:   54 },
  { key: "JJ1-3",                                   title: "Shock Absorbers and Protectives",           product: "JID-SHOCK-ABSORBERS-PROTECTIVES", families:    7, codes:   16 },
  { key: "single-axis-robot",                       title: "Single Axis Robots",                        product: "JID-SINGLE-AXIS-ROBOT",           families:   41, codes:   48 },
  { key: "II4-2",                                   title: "Small Components",                          product: "JID-SMALL-COMPONENTS",            families:   17, codes:   56 },
  { key: "Springs",                                 title: "Springs",                                   product: "JID-SPRINGS",                     families:   40, codes:   49 },
  { key: "BB2-8",                                   title: "Timing Belts",                              product: "JID-TIMING-BELT",                 families:    9, codes:   23 },
  { key: "TIming-Pulley",                           title: "Timing Pulleys",                            product: "JID-TIMING-PULLEY",               families:   28, codes:  123 },
  { key: "trapezoidal-screw",                       title: "Trapezoidal Screws",                        product: "JID-TRAPEZOIDAL-SCREW",           families:   18, codes:   25 },
  { key: "EE2-2",                                   title: "Vacuum Generators and Pressure Switches",   product: "JID-VACUUM-GENERATOR-DIGITAL",    families:    5, codes:   11 },
  { key: "Vacuum-Sucker",                           title: "Vacuum Suckers",                            product: "JID-VACUUM-SUCKER",               families:   39, codes:   84 },
  { key: "DD3-2",                                   title: "Washers and Shaft Collars",                 product: "JID-WASHER-SHAFT-COLLAR",         families:    5, codes:   32 },
];

export const sectionByKey: Record<string, CatalogueSection> = Object.fromEntries(
  catalogueSections.map((s) => [s.key, s]),
);

/** Product code -> the configurator section built from that catalogue. */
export const sectionByProduct: Record<string, CatalogueSection> = Object.fromEntries(
  catalogueSections.map((s) => [s.product, s]),
);

/** Product code -> its page on this site, for linking out of the configurator. */
export const productHref: Record<string, string> = Object.fromEntries(
  catalogueProducts.flatMap((p) => {
    const family = families.find((f) => f.id === p.family);
    return family ? [[p.code, `/products/${family.slug}/${p.slug}`]] : [];
  }),
);

/**
 * Link into the configurator, preselecting the catalogue section a product was read from.
 */
export function configuratorHref(productCode?: string): string {
  const section = productCode ? sectionByProduct[productCode] : undefined;
  return `/tools/component-configurator${section ? `?cat=${encodeURIComponent(section.key)}` : ""}`;
}
