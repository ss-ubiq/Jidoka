import { PageHeader, type Crumb } from "@/components/site/PageHeader";
import { type HeaderMotif } from "@/components/site/HeaderVisual";
import { EnquiryForm, type EnquiryMode, type EnquiryPrefill } from "./EnquiryForm";
import { ShieldCheck, Clock, FileCheck2 } from "lucide-react";

const trust = [
  { icon: FileCheck2, text: "Send a part number, drawing, photo, CAD or BOM — whatever you have." },
  { icon: ShieldCheck, text: "Your enquiry is confidential. No account, no checkout, no obligation." },
  { icon: Clock, text: "Reviewed by JIDOKA's engineering team — you get a considered technical response." },
];

export function FormPage({
  mode,
  eyebrow,
  title,
  lead,
  crumbs,
  note,
  reference,
  prefill,
  motif = "sheet",
}: {
  mode: EnquiryMode;
  eyebrow: string;
  title: string;
  lead: string;
  crumbs: Crumb[];
  note?: React.ReactNode;
  reference?: string;
  prefill?: EnquiryPrefill;
  motif?: HeaderMotif;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} crumbs={crumbs} motif={motif} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-2xl">
          {note && (
            <div className="mb-8 rounded-lg border border-accent/20 bg-accent-soft/50 p-4 text-sm text-fg-subtle">
              {note}
            </div>
          )}
          <EnquiryForm mode={mode} reference={reference} prefill={prefill} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <h2 className="text-sm font-semibold text-fg">What happens next</h2>
            <ul className="mt-4 space-y-4">
              {trust.map((t) => (
                <li key={t.text} className="flex gap-3">
                  <t.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-fg-subtle">{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
