import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
export const metadata: Metadata = { title: "CAD & Drawings", description: "Request CAD files and drawings for JIDOKA components, per product where available." };
export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Technical Library" title="CAD & drawings" lead="CAD models and dimensioned drawings to drop straight into your assembly — available per product." crumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "CAD & Drawings" }]} />
      <div className="container-page py-14 max-w-3xl">
        <PlaceholderNotice>CAD availability varies by product and is being published progressively. Request the CAD or drawing you need for a specific component and we&apos;ll provide it where available.</PlaceholderNotice>
      </div>
      <CtaBand title="Need CAD for a component?" body="Tell us the product and format and we'll send what's available." primary={{ label: "Request CAD", href: "/engineering-desk" }} secondary={{ label: "Browse Products", href: "/products" }} />
    </>
  );
}
