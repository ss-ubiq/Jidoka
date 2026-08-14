import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 ease-precise focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "btn-sheen bg-accent text-accent-fg shadow-card hover:brightness-110 hover:shadow-card-lg hover:-translate-y-px active:translate-y-0 active:brightness-95",
  secondary:
    "bg-surface text-fg border border-border-strong hover:bg-surface-2 hover:border-muted/40 shadow-card",
  outline: "bg-transparent text-fg border border-border-strong hover:bg-surface-2",
  ghost: "bg-transparent text-fg-subtle hover:text-fg hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

type LinkButtonProps = {
  variant?: Variant;
  size?: Size;
  href: string;
} & Omit<React.ComponentProps<typeof Link>, "href">;

export function LinkButton({ variant, size, className, href, ...props }: LinkButtonProps) {
  return <Link href={href} className={buttonClasses(variant, size, className)} {...props} />;
}
