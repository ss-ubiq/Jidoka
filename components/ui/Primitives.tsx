import { cn } from "@/lib/utils";

/** Section wrapper with consistent vertical rhythm. */
export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Small uppercase technical eyebrow. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow", className)}>
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </span>
  );
}

/** Standard section header: eyebrow + title + optional lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-heading-lg font-semibold text-fg">{title}</h2>
      {lead ? (
        <p className={cn("max-w-2xl text-lg leading-relaxed text-fg-subtle", align === "center" && "mx-auto")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

type BadgeTone = "neutral" | "accent" | "positive" | "heat";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-fg-subtle border-border",
  accent: "bg-accent-soft text-accent border-accent/20",
  positive: "bg-positive/10 text-positive border-positive/20",
  heat: "bg-heat/10 text-heat border-heat/20",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
