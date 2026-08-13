import type { Metadata } from "next";
import { DiscoveryHub } from "@/components/site/DiscoveryHub";
import { applications } from "@/data/discovery";
export const metadata: Metadata = { title: "Applications", description: "Find industrial components by application — mould & die, automation, machine building, packaging, assembly, robotics and more." };
export default function Page() {
  return <DiscoveryHub eyebrow="Applications" title="Find components by application" lead="Know what you're building but not every part number? Start from an application and we'll point you to the right component families." basePath="/applications" items={applications} crumbs={[{ label: "Home", href: "/" }, { label: "Applications" }]} />;
}
