import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "Request a Quote", description: "Request a quotation for industrial components. Send a part number, drawing, CAD or BOM — no account or checkout required." };
export default async function Page({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <FormPage
      mode="quote"
      eyebrow="Request a Quote"
      title="Request a quote"
      lead="Tell us what you need. Attach a drawing, CAD, BOM or photo if you have one — we'll come back with a quotation or a recommendation."
      crumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
      reference={ref}
    />
  );
}
