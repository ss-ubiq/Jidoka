import type React from "react";

/**
 * Layout for the privacy and terms pages.
 *
 * Both were shipped as "content in preparation" placeholders. Their text is now drafted
 * from what the code actually does — the fields the form collects, where an enquiry is
 * sent, what the browser stores, what analytics carries — so the published policy and the
 * implementation describe the same site. Business facts that cannot be read from the code
 * (retention, response commitment, jurisdiction) were supplied by JIDOKA.
 *
 * `awaitingApproval` keeps an honest banner on the page until JIDOKA confirms the wording.
 * Drafted from the implementation is not the same as approved by the business, and the
 * page should not imply otherwise.
 */
export function LegalDoc({
  effective,
  awaitingApproval = true,
  children,
}: {
  effective: string;
  awaitingApproval?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-14">
      {awaitingApproval && (
        <div className="mb-8 rounded-lg border border-warning/30 bg-warning/5 p-5 text-sm text-fg-subtle">
          <p className="font-medium text-fg">Draft pending JIDOKA approval</p>
          <p className="mt-1">
            This text describes how the website actually works today and is awaiting final
            confirmation by JIDOKA. If anything here matters to a decision you are making,
            please{" "}
            <a href="/contact" className="font-medium text-accent hover:underline">
              contact us
            </a>{" "}
            and we will confirm it in writing.
          </p>
        </div>
      )}
      <p className="text-sm text-muted">Effective {effective}</p>
      <div className="mt-8 space-y-10">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-subtle">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-subtle">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
