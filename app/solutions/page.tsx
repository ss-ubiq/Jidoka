import type { Metadata } from "next";
import { DiscoveryHub } from "@/components/site/DiscoveryHub";
import { solutions } from "@/data/discovery";
export const metadata: Metadata = { title: "Solutions", description: "Component solutions for mould & die, automation, machine building, linear motion, power transmission, pneumatics and multi-line sourcing." };
export default function Page() {
  return <DiscoveryHub eyebrow="Solutions" title="Components brought together around what you build" lead="When you know the discipline but not every part, start from a solution — then send us the requirement." basePath="/solutions" items={solutions} crumbs={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />;
}
