import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoveryDetail } from "@/components/site/DiscoveryHub";
import { solutions, solutionBySlug, familiesFor } from "@/data/discovery";
export function generateStaticParams() { return solutions.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const s = solutionBySlug.get(slug);
  return s ? { title: `${s.name} — Solution`, description: s.blurb } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = solutionBySlug.get(slug); if (!item) notFound();
  return <DiscoveryDetail kind="Solution" item={item} families={familiesFor(item)} crumbs={[{ label: "Home", href: "/" }, { label: "Solutions", href: "/solutions" }, { label: item.name }]} />;
}
