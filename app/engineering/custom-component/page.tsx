import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "Request a Custom Component", description: "Send a drawing, CAD, PDF or image with material, dimensions, tolerance, finish and quantity. JIDOKA's engineering team reviews custom and made-to-drawing components." };
export default function Page() {
  return (
    <FormPage
      mode="custom"
      eyebrow="Custom Components"
      title="Need a custom component?"
      lead="Can't find the exact component? Send a drawing, CAD, PDF or image with your material, dimensions, tolerance, finish and quantity. We'll review it — manufacturing capability is confirmed per enquiry, never assumed."
      crumbs={[{ label: "Home", href: "/" }, { label: "Engineering", href: "/engineering" }, { label: "Custom Component" }]}
    />
  );
}
