import type { Metadata } from "next";
import { DiscoveryHub } from "@/components/site/DiscoveryHub";
import { industries } from "@/data/discovery";
export const metadata: Metadata = { title: "Industries", description: "Industrial components for automotive, tool & die, packaging, electronics, robotics, general manufacturing and machine building." };
export default function Page() {
  return <DiscoveryHub eyebrow="Industries" title="Find components by industry" lead="Explore the applications, solutions and component families most relevant to your industry." basePath="/industries" items={industries} motif="factory" crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]} />;
}
