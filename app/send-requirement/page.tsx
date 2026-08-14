import type { Metadata } from "next";
import { FormPage } from "@/components/forms/FormPage";
export const metadata: Metadata = { title: "Send Your Requirement", description: "Don't know the exact product? Describe what you're building and send a drawing, photo, CAD or BOM. JIDOKA's engineers will help you find the right component." };
export default function Page() {
  return (
    <FormPage
      mode="requirement"
      motif="assembly"
      eyebrow="Send Requirement"
      title="Tell us what you are trying to build"
      lead="You don't need a part number. Describe the application, what the component must do, and upload a drawing or photo — we'll help you find the right component."
      crumbs={[{ label: "Home", href: "/" }, { label: "Send Requirement" }]}
      note={<><strong className="text-fg">No product code? No problem.</strong> This form is for when you know the need but not the exact part. If you already have a part number, <a className="font-medium text-accent hover:underline" href="/request-a-quote">request a quote</a> instead.</>}
    />
  );
}
