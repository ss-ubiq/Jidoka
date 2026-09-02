/**
 * Interactive engineering tools — self-contained HTML apps served from /public/tools
 * and framed by a site route under /tools/<slug>. Tools build catalogue-valid part
 * numbers; they never quote price or stock (non-e-commerce mandate).
 */
export type EngineeringTool = {
  slug: string;
  name: string;
  short: string;
  /** Static file under /public that the route embeds. */
  file: string;
  /** Catalogue source the tool's rules were transcribed from (honest provenance). */
  source: string;
  familyIds: string[];
  productCodes: string[];
  /** Subfamily rows (data/families.ts) that get a "Configure" action. */
  subfamilyNames: string[];
  /** Keyword landing pages (data/keywords.ts) that link to the tool. */
  keywordSlugs: string[];
  /** Part-number family prefixes the tool can build — used by site search deep links. */
  codePrefixes: string[];
  /** Free-text terms that should surface the tool in search. */
  terms: RegExp;
};

export const tools: EngineeringTool[] = [
  {
    slug: "shaft-configurator",
    name: "Linear Shaft Configurator",
    short: "Build a catalogue-valid linear shaft part number: family, material, diameter, length, end dimensions and optional processing.",
    file: "/tools/shaft-configurator.html",
    source: "Guide Shaft catalogue, pages 11–30",
    familyIds: ["linear-motion"],
    productCodes: ["JID-GUIDE-SHAFT"],
    subfamilyNames: ["Linear Shafts"],
    keywordSlugs: ["linear-shafts", "linear-bearings"],
    codePrefixes: ["SAD", "SAE", "SCD", "SCE", "SCJ", "SCK", "SEP", "SER", "SHM", "SHN", "SHP", "SLD", "SLF", "SLJ", "SLL", "SLM", "SLN"],
    terms: /\b(linear |guide |precision |hardened )?shafts?\b|configurat/i,
  },
];

export const toolHref = (t: EngineeringTool, code?: string) =>
  `/tools/${t.slug}${code ? `?code=${encodeURIComponent(code)}` : ""}`;

const groupBy = (key: (t: EngineeringTool) => string[]) =>
  tools.reduce<Record<string, EngineeringTool[]>>((acc, t) => {
    for (const k of key(t)) (acc[k] ||= []).push(t);
    return acc;
  }, {});

export const toolsByFamily = groupBy((t) => t.familyIds);
export const toolsByProduct = groupBy((t) => t.productCodes);
export const toolsBySubfamily = groupBy((t) => t.subfamilyNames);
export const toolsByKeyword = groupBy((t) => t.keywordSlugs);

/**
 * Does a search query look like something a tool can build?
 * "SCD06-D10-L300", "scd06", "SAD" → deep link with the code preselected;
 * "linear shaft" → plain link to the tool.
 */
export function matchTool(query: string): { tool: EngineeringTool; href: string; code?: string; full?: boolean } | null {
  const q = query.trim();
  if (!q) return null;
  const compact = q.toUpperCase().replace(/_/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  for (const t of tools) {
    // Full part number (any separator style: "SCE02-D10-L300", "SCE02 D10 L300", "SCE02D10L300M3S10"),
    // a variant ("SCD06") or just a family prefix ("SCD").
    const m = compact.match(new RegExp(`^(${t.codePrefixes.join("|")})(\\d{2}[A-Z0-9.\\-]*)?(?![A-Z])`));
    if (m) return { tool: t, href: toolHref(t, m[0]), code: m[0], full: /\d{2}-?D\d/.test(m[0]) };
    if (t.terms.test(q)) return { tool: t, href: toolHref(t) };
  }
  return null;
}
