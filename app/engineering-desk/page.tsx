import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "JIDOKA Engineering Desk — Ask an Engineer", description: "A structured technical enquiry service. Submit a part number, application, drawing, CAD, photo or BOM and get a considered engineering response." };
export default async function Page({ searchParams }: { searchParams: Promise<{ ref?: string; notes?: string; via?: string }> }) {
  const { ref, notes, via } = await searchParams;
  return (
    <FormPage
      mode="engineer"
      motif="caliper"
      eyebrow="JIDOKA Engineering Desk"
      title="Ask an engineer"
      lead="A structured technical enquiry — not a chatbot. Share your requirement and our engineering team will help you identify, specify, replace or customise a component."
      crumbs={[{ label: "Home", href: "/" }, { label: "Engineering Desk" }]}
      reference={ref}
      prefill={{ notes, via }}
    />
  );
}
