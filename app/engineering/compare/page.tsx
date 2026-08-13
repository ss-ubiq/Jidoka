import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CompareTool, type ComparableProduct } from "@/components/engineering/CompareTool";
import { catalogueProducts, familyById } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Compare Components",
  description:
    "Compare JIDOKA components side by side on family, category, applications and catalogue — an engineering comparison, not a shopping cart.",
};

export default function Page() {
  const products: ComparableProduct[] = catalogueProducts.map((p) => {
    const fam = familyById.get(p.family);
    return {
      code: p.code,
      name: p.name,
      slug: p.slug,
      familySlug: fam?.slug ?? "",
      familyName: fam?.name ?? p.internalCategory,
      familyCode: fam?.code ?? "—",
      category: p.internalCategory,
      applications: fam?.applications ?? [],
      catalogueFile: p.catalogueFile,
      catalogueSizeMB: p.catalogueSizeMB,
      related: (fam?.commonlyUsedWith ?? []).map((id) => familyById.get(id)?.name ?? "").filter(Boolean),
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Engineering"
        title="Compare components"
        lead="A side-by-side engineering comparison — family, category, applications and catalogue. This is a technical decision aid, never a shopping basket."
        crumbs={[{ label: "Home", href: "/" }, { label: "Engineering", href: "/engineering" }, { label: "Compare" }]}
      />
      <div className="container-page py-14">
        <CompareTool products={products} />
      </div>
    </>
  );
}
