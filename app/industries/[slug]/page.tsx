import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoveryDetail } from "@/components/site/DiscoveryHub";
import { industries, industryBySlug, familiesFor } from "@/data/discovery";
export function generateStaticParams() { return industries.map((i) => ({ slug: i.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const i = industryBySlug.get(slug);
  return i ? { title: `${i.name} — Industry`, description: i.blurb } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = industryBySlug.get(slug); if (!item) notFound();
  return <DiscoveryDetail kind="Industry" item={item} families={familiesFor(item)} crumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: item.name }]} />;
}
