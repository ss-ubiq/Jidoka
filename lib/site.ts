/**
 * JIDOKA site-wide constants: brand, contact surface, navigation.
 *
 * Contact values default to jidoka.in's published details but are overridable via
 * NEXT_PUBLIC_* env so JIDOKA staff can change them without a developer.
 * Nothing here asserts an unverified capability, certification, or claim.
 */

// JIDOKA registered office (confirmed).
const officeAddress = {
  name: "Jidoka Automation India LLP",
  full: "Jidoka Automation India LLP, 1102, 11th Floor, Tower-B, ATS Bouquet, Jaypee Wishtown Internal Rd, Block B, Sector 132, Noida, Uttar Pradesh 201304",
  street: "1102, 11th Floor, Tower-B, ATS Bouquet, Jaypee Wishtown Internal Rd, Block B, Sector 132",
  locality: "Noida",
  region: "Uttar Pradesh",
  postalCode: "201304",
  country: "IN",
  // A CLEAN landmark query that Google Maps geocodes reliably (the full unit/floor string
  // does not). This is what powers directions/embed so the pin lands on the building.
  // To pin an exact spot instead, set NEXT_PUBLIC_MAPS_QUERY to "lat,lng" or a Maps place URL.
  mapQuery: process.env.NEXT_PUBLIC_MAPS_QUERY || "ATS Bouquet, Sector 132, Noida, Uttar Pradesh 201304",
} as const;

export const site = {
  name: "JIDOKA",
  legalName: "Jidoka Automation India LLP",
  tagline: "Industrial Components. Engineering Solutions.",
  description:
    "Precision components and technical solutions for automation, mould & die, machine building and industrial manufacturing. Tell us what you are building — we help you find and specify the right component.",
  url: "https://jidoka.in",
  // Overridable contact surface (env wins), defaulting to JIDOKA's confirmed details.
  email: process.env.NEXT_PUBLIC_JIDOKA_EMAIL || "info@jidoka.in",
  phone: process.env.NEXT_PUBLIC_JIDOKA_PHONE || "+91-8826002054",
  whatsapp: process.env.NEXT_PUBLIC_JIDOKA_WHATSAPP || "918826002054",
  address: officeAddress,
  maps: {
    // Directions/embed use the clean landmark query so the pin is correct.
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeAddress.mapQuery)}`,
    embed: `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress.mapQuery)}&z=17&output=embed`,
    view: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress.mapQuery)}`,
  },
} as const;

/** Digits-only phone for tel: links. */
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;

/** Primary conversion actions — deliberately NOT e-commerce. */
export const primaryActions = {
  quote: { label: "Request a Quote", href: "/request-a-quote" },
  requirement: { label: "Send Requirement", href: "/send-requirement" },
  engineer: { label: "Talk to an Engineer", href: "/engineering-desk" },
} as const;

export type NavChild = { label: string; href: string; hint?: string };
export type NavGroup = { label: string; href: string; children?: NavChild[] };

/** Top-level information architecture (§70). */
export const mainNav: NavGroup[] = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Applications", href: "/applications" },
  { label: "Industries", href: "/industries" },
  { label: "Engineering", href: "/engineering" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

/** SOLUTIONS mega-menu (§54). */
export const solutionsMenu: NavChild[] = [
  { label: "Mould & Die", href: "/solutions/mould-and-die", hint: "Ejector, guide & die components" },
  { label: "Automation", href: "/solutions/automation", hint: "Positioning, motion & gripping" },
  { label: "Machine Building", href: "/solutions/machine-building", hint: "Frames, motion & transmission" },
  { label: "Linear Motion", href: "/solutions/linear-motion", hint: "Shafts, bearings & guides" },
  { label: "Power Transmission", href: "/solutions/power-transmission", hint: "Belts, pulleys, gears & chain" },
  { label: "Pneumatics", href: "/solutions/pneumatics", hint: "Fittings, valves & vacuum" },
  { label: "Component Sourcing", href: "/solutions/component-sourcing", hint: "Multi-line supply support" },
  { label: "BOM Support", href: "/engineering/submit-bom", hint: "Upload a full bill of materials" },
  { label: "Custom Components", href: "/engineering/custom-component", hint: "Made-to-drawing review" },
];

/** ENGINEERING mega-menu (§55). */
export const engineeringMenu: NavChild[] = [
  { label: "Product Finder", href: "/products", hint: "Browse by component family" },
  { label: "Part Number Search", href: "/search", hint: "Search by code or keyword" },
  { label: "Compare Components", href: "/engineering/compare", hint: "Side-by-side technical view" },
  { label: "Technical Library", href: "/resources", hint: "Catalogues, datasheets, guides" },
  { label: "CAD & Drawings", href: "/resources/cad", hint: "Where available per product" },
  { label: "Ask an Engineer", href: "/engineering-desk", hint: "Structured technical enquiry" },
  { label: "Find an Alternative", href: "/engineering/find-an-alternative", hint: "Replacement / equivalent review" },
  { label: "Submit BOM", href: "/engineering/submit-bom", hint: "Excel / CSV / PDF" },
  { label: "Custom Component", href: "/engineering/custom-component", hint: "Drawing / CAD upload" },
];

/** Requirement types offered on the RFQ / Engineering Desk (§32, §42). */
export const requirementTypes = [
  "Product quotation",
  "Alternative / replacement",
  "Technical recommendation",
  "Custom component",
  "BOM review",
  "Bulk requirement",
  "General enquiry",
] as const;
