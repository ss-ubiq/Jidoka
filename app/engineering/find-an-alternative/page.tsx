import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "Find an Alternative / Replacement", description: "Submit an existing part number, supplier, drawing or photo for technical review. JIDOKA proposes an equivalent only when technical equivalence is verified." };
export default function Page() {
  return (
    <FormPage
      mode="alternative"
      motif="pin"
      eyebrow="Find an Alternative"
      title="Find an alternative or replacement"
      lead="Enter the existing part number, manufacturer or supplier and attach a drawing, photo or specification. We review it and propose an equivalent only when technical equivalence is verified — never automatically."
      crumbs={[{ label: "Home", href: "/" }, { label: "Engineering", href: "/engineering" }, { label: "Find an Alternative" }]}
    />
  );
}
