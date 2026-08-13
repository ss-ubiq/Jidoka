import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "Submit a BOM", description: "Upload a full bill of materials (Excel, CSV or PDF) for review. Multi-line and multi-component procurement support from JIDOKA — no cart, no checkout." };
export default function Page() {
  return (
    <FormPage
      mode="bom"
      eyebrow="BOM Support"
      title="Have a BOM?"
      lead="Upload your bill of materials as Excel, CSV or PDF — add a drawing package or CAD if you have one. We'll review the whole list and come back on availability and quotation."
      crumbs={[{ label: "Home", href: "/" }, { label: "Engineering", href: "/engineering" }, { label: "Submit BOM" }]}
    />
  );
}
