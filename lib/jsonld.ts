/**
 * JSON-LD structured data builders (§59). Only verifiable facts are emitted — no fabricated
 * specifications, prices, ratings, stock or offers. Product schema carries name/sku/category/
 * brand/url and a description, never an invented `offers.price` or spec value (§3).
 */
import { site } from "./site";
import type { Family, CatalogueProduct } from "./catalog";

const abs = (path: string) => new URL(path, site.url).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    address: {
      "@type": "PostalAddress",
      name: site.address.name,
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    hasMap: site.maps.view,
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: abs("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(crumbs: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}

export function familyItemListLd(family: Family, products: CatalogueProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: family.name,
    description: family.blurb,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: abs(`/products/${family.slug}/${p.slug}`),
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productLd(product: CatalogueProduct, family: Family) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    category: family.name,
    brand: { "@type": "Brand", name: site.name },
    url: abs(`/products/${family.slug}/${product.slug}`),
    description: `${product.name} — part of JIDOKA's ${family.name} range. ${family.tagline}. Catalogue, technical data and quotation on request.`,
    ...(product.catalogueFile
      ? { subjectOf: { "@type": "DigitalDocument", name: `${product.name} — Product Catalogue`, url: abs(product.catalogueFile) } }
      : {}),
  };
}
