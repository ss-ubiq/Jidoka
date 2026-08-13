import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
export const metadata: Metadata = { title: "Privacy Policy", description: "How JIDOKA handles information submitted through this website." };
export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lead="How JIDOKA handles information submitted through this website." crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <div className="container-page py-14 max-w-3xl">
        <PlaceholderNotice>The final Privacy Policy text is being prepared with JIDOKA. This site collects only the information you choose to submit in an enquiry (your contact details, requirement and any files) and uses it solely to respond to that enquiry. It never publishes customer or sales data.</PlaceholderNotice>
      </div>
      <CtaBand title="Questions about your data?" body="Contact us and we'll be glad to help." primary={{ label: "Contact JIDOKA", href: "/contact" }} />
    </>
  );
}
