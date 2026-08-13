import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoveryDetail } from "@/components/site/DiscoveryHub";
import { applications, applicationBySlug, familiesFor } from "@/data/discovery";
export function generateStaticParams() { return applications.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const a = applicationBySlug.get(slug);
  return a ? { title: `${a.name} — Application`, description: a.blurb } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = applicationBySlug.get(slug); if (!item) notFound();
  return <DiscoveryDetail kind="Application" item={item} families={familiesFor(item)} crumbs={[{ label: "Home", href: "/" }, { label: "Applications", href: "/applications" }, { label: item.name }]} />;
}
