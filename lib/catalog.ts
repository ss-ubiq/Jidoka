import { families, familiesByDemand, familyBySlug, familyById, type Family } from "@/data/families";
import { catalogueProducts, productsByFamily, productBySlug, type CatalogueProduct } from "@/data/products";

export { families, familiesByDemand, familyBySlug, familyById, catalogueProducts, productsByFamily, productBySlug };
export type { Family, CatalogueProduct };

/** Verified catalogue products that belong to a family. */
export function productsOf(familyId: string): CatalogueProduct[] {
  return productsByFamily[familyId] ?? [];
}

/** Resolve related families (engineering "commonly used with", §28). */
export function relatedFamilies(family: Family): Family[] {
  return family.commonlyUsedWith.map((id) => familyById.get(id)).filter(Boolean) as Family[];
}

/** Resolve a product from a family slug + product slug (URL: /products/[family]/[product]). */
export function resolveProduct(familySlug: string, productSlug: string): { family: Family; product: CatalogueProduct } | null {
  const family = familyBySlug.get(familySlug);
  const product = productBySlug.get(productSlug);
  if (!family || !product || product.family !== family.id) return null;
  return { family, product };
}

/** Other catalogue products in the same family (for "related products"). */
export function relatedProducts(product: CatalogueProduct, limit = 6): CatalogueProduct[] {
  return productsOf(product.family).filter((p) => p.code !== product.code).slice(0, limit);
}

/** Every (family, product) pair — for generateStaticParams and sitemaps. */
export function allProductPaths(): { slug: string; product: string }[] {
  return catalogueProducts
    .map((p) => {
      const fam = familyById.get(p.family);
      return fam ? { slug: fam.slug, product: p.slug } : null;
    })
    .filter(Boolean) as { slug: string; product: string }[];
}

/** Lightweight search across families, subfamilies and catalogue products (§23, §24). */
export type SearchHit =
  | { kind: "family"; family: Family }
  | { kind: "subfamily"; family: Family; name: string }
  | { kind: "product"; family: Family | undefined; product: CatalogueProduct };

export function searchCatalogue(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];

  for (const f of families) {
    if (f.name.toLowerCase().includes(q) || f.tagline.toLowerCase().includes(q) || f.blurb.toLowerCase().includes(q)) {
      hits.push({ kind: "family", family: f });
    }
    for (const sub of f.subfamilies) {
      if (sub.name.toLowerCase().includes(q)) hits.push({ kind: "subfamily", family: f, name: sub.name });
    }
  }
  for (const p of catalogueProducts) {
    if (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) {
      hits.push({ kind: "product", family: familyById.get(p.family), product: p });
    }
  }
  return hits;
}
