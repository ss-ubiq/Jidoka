"use client";

import Link from "next/link";
import { FileText, Phone, MessageCircle } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Mobile-only persistent action bar (§51, §86): Request Quote / Call / WhatsApp are
 * always one tap away on phones. Hidden on lg+ where the header carries the CTAs.
 * Respects iOS safe-area insets; body bottom padding is added in globals.css.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid h-16 grid-cols-3">
        <Link
          href="/request-a-quote"
          onClick={() => track("cta_click", { cta: "mobile_bar_quote" })}
          className="flex flex-col items-center justify-center gap-1 text-accent transition-colors active:bg-surface-2"
        >
          <FileText className="h-5 w-5" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide">Quote</span>
        </Link>
        <a
          href={telHref}
          onClick={() => track("contact_click", { channel: "phone" })}
          className="flex flex-col items-center justify-center gap-1 border-x border-border text-fg-subtle transition-colors active:bg-surface-2"
        >
          <Phone className="h-5 w-5" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide">Call</span>
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_click", { channel: "whatsapp" })}
          className="flex flex-col items-center justify-center gap-1 text-fg-subtle transition-colors active:bg-surface-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
