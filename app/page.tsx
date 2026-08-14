import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Layers,
  Factory,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Headset,
  PackageSearch,
  Wrench,
  Ruler,
  Upload,
} from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroVisual } from "@/components/home/HeroVisual";
import { HeroTicker } from "@/components/home/HeroTicker";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Section, SectionHeading, Eyebrow, Badge } from "@/components/ui/Primitives";
import { LinkButton } from "@/components/ui/Button";
import { familiesByDemand } from "@/data/families";

const discoveryPaths = [
  {
    icon: Boxes,
    title: "Products",
    line: "I know what component I need.",
    href: "/products",
    cta: "Browse products",
  },
  {
    icon: Layers,
    title: "Applications",
    line: "I know what I am building.",
    href: "/applications",
    cta: "Explore applications",
  },
  {
    icon: Factory,
    title: "Industries",
    line: "I know my industry.",
    href: "/industries",
    cta: "View industries",
  },
  {
    icon: Upload,
    title: "Send Requirement",
    line: "I don't know the exact product.",
    href: "/send-requirement",
    cta: "Send a drawing / BOM",
  },
];

const solutions = [
  { title: "Mould & Die", href: "/solutions/mould-and-die", desc: "Ejector, guide, punch & die tooling components." },
  { title: "Automation", href: "/solutions/automation", desc: "Positioning, motion, gripping & handling." },
  { title: "Machine Building", href: "/solutions/machine-building", desc: "Frames, motion, transmission & hardware." },
  { title: "Linear Motion", href: "/solutions/linear-motion", desc: "Shafts, bearings, guides & supports." },
  { title: "Power Transmission", href: "/solutions/power-transmission", desc: "Belts, pulleys, gears, chain & couplings." },
  { title: "Pneumatics", href: "/solutions/pneumatics", desc: "Fittings, valves, vacuum & clamps." },
];

const whyJidoka = [
  { icon: PackageSearch, title: "Product Range", desc: "A broad, engineering-organised catalogue across 12 component families — with real depth in mould & die, springs and linear motion." },
  { icon: Headset, title: "Technical Support", desc: "Talk to people who understand components and applications — not a call centre. Send a drawing or a requirement and get a considered response." },
  { icon: ShieldCheck, title: "Supply Capability", desc: "Sourcing and supply support for standard, bulk and repeat requirements, coordinated around your production needs." },
  { icon: Wrench, title: "Application Knowledge", desc: "Guidance on selecting and combining components for tooling, automation and machine-building applications." },
];

const resources = [
  { icon: FileText, title: "Product Catalogues", href: "/resources", desc: "Family and product catalogues." },
  { icon: Ruler, title: "Datasheets & Drawings", href: "/resources", desc: "Technical data where available." },
  { icon: Layers, title: "CAD", href: "/resources/cad", desc: "CAD files per product, where available." },
  { icon: MessageSquareText, title: "Selection Guides & FAQs", href: "/resources", desc: "Help choosing the right component." },
];

/** Staggered entrance delay for the hero cascade. */
const rise = (i: number) => ({ animationDelay: `${i * 110}ms` });

export default function HomePage() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Engineering grid backdrop — slowly drifting */}
        <div
          aria-hidden
          className="hero-grid pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] animate-pulse-soft rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full bg-heat/[0.06] blur-3xl"
        />
        <div className="container-page relative py-20 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_minmax(0,30rem)]">
            <div className="max-w-3xl">
              <div className="animate-hero-rise" style={rise(0)}>
                <Eyebrow>Industrial Components · Engineering Solutions</Eyebrow>
              </div>
              <h1 className="mt-5 text-display-lg font-bold text-fg">
                <span className="block animate-hero-rise" style={rise(1)}>
                  Industrial Components.
                </span>
                <span className="block animate-hero-rise text-accent" style={rise(2)}>
                  Engineering Solutions.
                </span>
              </h1>
              <p
                className="mt-6 max-w-2xl animate-hero-rise text-lg leading-relaxed text-fg-subtle sm:text-xl"
                style={rise(3)}
              >
                Precision components and technical solutions for automation, mould &amp; die, machine
                building and industrial manufacturing.
              </p>

              <div className="mt-8 animate-hero-rise" style={rise(4)}>
                <HeroSearch />
              </div>

              <div className="mt-8 flex animate-hero-rise flex-wrap items-center gap-3" style={rise(5)}>
                <LinkButton href="/request-a-quote" size="lg">
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/products" size="lg" variant="secondary">
                  Explore Products
                </LinkButton>
                <LinkButton href="/engineering-desk" size="lg" variant="ghost">
                  Talk to an Engineer
                </LinkButton>
              </div>
            </div>

            {/* Animated technical drawing — the JIDOKA character piece */}
            <div className="hidden animate-hero-rise lg:block" style={rise(3)}>
              <HeroVisual />
            </div>
          </div>

          {/* Not sure what you need? */}
          <div
            className="mt-14 max-w-3xl animate-hero-rise rounded-xl border border-accent/20 bg-accent-soft/60 p-6 backdrop-blur-sm sm:p-7"
            style={rise(6)}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                  <span aria-hidden className="absolute inset-0 animate-pulse-soft rounded-lg ring-1 ring-accent/40" />
                  <Upload className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-fg">Not sure what you need?</p>
                  <p className="mt-0.5 text-sm text-fg-subtle">
                    Tell us about your application. Send a drawing, photo, part number or BOM.
                  </p>
                </div>
              </div>
              <Link
                href="/send-requirement"
                className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-accent hover:underline"
              >
                Get technical assistance
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Family ticker */}
        <HeroTicker />
      </section>

      {/* ===================== DISCOVER JIDOKA — 4 PATHS ===================== */}
      <Section className="border-b border-border">
        <Reveal>
          <SectionHeading
            eyebrow="Discover JIDOKA"
            title="Four ways to find what you need"
            lead="Start from the product, the thing you're building, your industry — or just tell us your requirement."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {discoveryPaths.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <TiltCard>
                <Link
                  href={p.href}
                  className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-card-hover"
                >
                  <div>
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface-2 text-accent transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-accent/40">
                      <p.icon className="h-[1.35rem] w-[1.35rem]" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-fg">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-fg-subtle">&ldquo;{p.line}&rdquo;</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===================== PRODUCT FAMILIES ===================== */}
      <Section className="border-b border-border bg-surface-2/40">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Product Families"
              title="A catalogue organised the way engineers think"
              lead="Twelve component families, ordered by real demand. Every family links to its subfamilies, technical resources and a quote request."
            />
            <LinkButton href="/products" variant="secondary" className="shrink-0">
              View all products <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familiesByDemand.map((f, i) => (
            <Reveal key={f.id} delay={(i % 3) * 90} className="h-full">
              <TiltCard max={5}>
                <Link
                  href={`/products/${f.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface-2 font-mono text-xs font-semibold text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      {f.code}
                    </span>
                    {f.status === "catalogue" ? (
                      <Badge tone="positive">In catalogue</Badge>
                    ) : (
                      <Badge tone="heat">High demand</Badge>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-fg group-hover:text-accent">{f.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-fg-subtle">{f.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Explore family
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===================== SOLUTIONS ===================== */}
      <Section className="border-b border-border">
        <Reveal>
          <SectionHeading
            eyebrow="Solutions"
            title="Components brought together around what you build"
            lead="When you know the machine or the discipline but not every part number, start from a solution."
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group relative flex flex-col gap-2 bg-surface p-7 transition-colors hover:bg-surface-2"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-precise group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-fg group-hover:text-accent">{s.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </div>
                <p className="text-sm leading-relaxed text-fg-subtle">{s.desc}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ===================== ENGINEERING DESK ===================== */}
      <Section className="relative overflow-hidden border-b border-border bg-ink text-bg [--fg:210_30%_96%] [--fg-subtle:215_16%_75%]">
        {/* Blueprint backdrop for the dark band */}
        <div
          aria-hidden
          className="hero-grid pointer-events-none absolute inset-0 bg-grid opacity-[0.14] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_80%_90%_at_70%_50%,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 animate-pulse-soft rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal variant="left">
            <Eyebrow className="text-accent">JIDOKA Engineering Desk</Eyebrow>
            <h2 className="mt-5 text-heading-lg font-semibold text-bg">
              Need help selecting a component?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-bg/70">
              Send a part number, an existing supplier reference, a drawing, a photo or a full BOM.
              Our engineering team reviews it and comes back with the right component, an alternative,
              or a custom solution — never an invented equivalence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/engineering-desk" size="lg">
                Ask an Engineer <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <Link
                href="/engineering/find-an-alternative"
                className="inline-flex h-[3.25rem] items-center gap-2 rounded-md border border-bg/20 px-6 font-medium text-bg transition-colors hover:bg-bg/10"
              >
                Find an Alternative
              </Link>
            </div>
          </Reveal>
          <ul className="grid gap-3">
            {[
              "I need a quotation",
              "I need help identifying a component",
              "I need an alternative / replacement",
              "I need a custom component",
              "I have a BOM to review",
            ].map((item, i) => (
              <Reveal key={item} as="li" variant="left" delay={i * 90}>
                <span className="flex items-center gap-3 rounded-lg border border-bg/15 bg-bg/[0.06] px-4 py-3.5 text-sm font-medium text-bg/90 transition-all duration-300 hover:translate-x-1 hover:border-accent/40 hover:bg-bg/10">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded border border-accent/40 text-accent">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ===================== WHY JIDOKA ===================== */}
      <Section className="border-b border-border">
        <Reveal>
          <SectionHeading
            eyebrow="Why JIDOKA"
            title="An engineering partner, not an online shop"
            lead="We help industrial companies find, specify, source and discuss components — with the technical understanding that turns a part number into the right decision."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyJidoka.map((w, i) => (
            <Reveal key={w.title} delay={i * 80} className="h-full">
              <TiltCard max={5}>
                <div className="group h-full rounded-xl border border-border bg-surface p-6 shadow-card transition-colors duration-300 hover:border-accent/30">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <w.icon className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-fg">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{w.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===================== TECHNICAL RESOURCES ===================== */}
      <Section className="bg-surface-2/40">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Technical Resources"
              title="Catalogues, datasheets, CAD & guides"
              lead="Technical documentation to specify with confidence. We publish resources that genuinely exist — nothing is fabricated."
            />
            <LinkButton href="/resources" variant="secondary" className="shrink-0">
              Technical library <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r, i) => (
            <Reveal key={r.title} delay={i * 80} className="h-full">
              <TiltCard max={5}>
                <Link
                  href={r.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card transition-all hover:border-accent/40 hover:shadow-card-hover"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface-2 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <r.icon className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-fg group-hover:text-accent">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{r.desc}</p>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
