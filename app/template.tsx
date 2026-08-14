import { MotionAuto } from "@/components/motion/MotionAuto";

/**
 * Route template — remounts on every navigation, giving each page a soft
 * rise-in transition, and re-running the auto-motion engine that animates
 * cards and headings on every page. Pure transform/opacity;
 * prefers-reduced-motion neutralises it.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <MotionAuto />
      {children}
    </div>
  );
}
