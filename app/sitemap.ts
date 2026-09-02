import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { families } from "@/data/families";
import { applications, industries, solutions } from "@/data/discovery";
import { allProductPaths } from "@/lib/catalog";
import { keywordPages } from "@/data/keywords";
import { tools } from "@/data/tools";
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const staticPaths = ["/", "/products", "/solutions", "/applications", "/industries", "/engineering", "/resources", "/resources/catalogues", "/about", "/contact", "/request-a-quote", "/send-requirement", "/engineering-desk", "/engineering/find-an-alternative", "/engineering/submit-bom", "/engineering/custom-component"];
  return [
    ...staticPaths.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...families.map((f) => ({ url: u(`/products/${f.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...allProductPaths().map((p) => ({ url: u(`/products/${p.slug}/${p.product}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: u("/components"), changeFrequency: "weekly" as const, priority: 0.9 },
    ...keywordPages.map((k) => ({ url: u(`/components/${k.slug}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...tools.map((t) => ({ url: u(`/tools/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...solutions.map((s) => ({ url: u(`/solutions/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...applications.map((a) => ({ url: u(`/applications/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...industries.map((i) => ({ url: u(`/industries/${i.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
