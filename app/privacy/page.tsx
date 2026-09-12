import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { LegalDoc, LegalSection, LegalList } from "@/components/site/LegalDoc";
import { site } from "@/lib/site";
import { ALLOWED_EXTENSIONS, UPLOAD_MAX_FILES, UPLOAD_MAX_FILE_BYTES, UPLOAD_MAX_TOTAL_BYTES, formatBytes } from "@/lib/uploads";
import { QUOTE_IDLE_MS, QUOTE_MAX_AGE_MS } from "@/lib/quote";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What this website collects, where it goes, how long it is kept, and what it never does.",
};

const RETENTION = "12 months";
const RESPONSE = "one working day";

export default function Page() {
  return (
    <>
      <PageHeader
        motif="sheet"
        eyebrow="Legal"
        title="Privacy Policy"
        lead="What this website collects, where it goes, how long we keep it, and what it never does."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <LegalDoc effective="12 September 2026">
        <LegalSection title="In short">
          <p>
            This site has no accounts, no shopping cart and no payment. It collects nothing
            about you until you choose to send an enquiry. We use what you send to answer
            you, and we never publish or sell it.
          </p>
        </LegalSection>

        <LegalSection title="Who is responsible">
          <p>
            {site.legalName} operates this website. For any
            question about your information, contact{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-accent hover:underline">
              {site.email}
            </a>
            {site.phone ? (
              <>
                {" "}
                or {site.phone}
              </>
            ) : null}
            .
          </p>
        </LegalSection>

        <LegalSection title="What we collect, and only when you send it">
          <p>When you submit an enquiry form, we receive what you filled in:</p>
          <LegalList
            items={[
              <>
                <strong className="text-fg">Contact details</strong> — your name, company and
                email address, which are required so we can reply, plus your phone number and
                preferred contact method if you give them.
              </>,
              <>
                <strong className="text-fg">Your requirement</strong> — part numbers,
                quantities, the configured items in your quotation list, industry, required
                date and anything you write in the notes.
              </>,
              <>
                <strong className="text-fg">Files you attach</strong> — drawings, CAD, BOMs or
                photos. Up to {UPLOAD_MAX_FILES} files, {formatBytes(UPLOAD_MAX_FILE_BYTES)}{" "}
                each and {formatBytes(UPLOAD_MAX_TOTAL_BYTES)} in total, in these formats:{" "}
                {ALLOWED_EXTENSIONS.join(", ")}.
              </>,
            ]}
          />
          <p>
            We do not ask for, and this site cannot accept, payment details, identity
            documents or any account password.
          </p>
        </LegalSection>

        <LegalSection title="Where your enquiry goes">
          <p>
            An enquiry is emailed to JIDOKA&apos;s team at {site.email}, with your attachments
            included. It may also be passed to JIDOKA&apos;s internal sales system so your
            requirement can be tracked through to a reply. Both are JIDOKA systems.
          </p>
          <p>
            Email is carried by our mail provider, and this website is hosted by Netlify,
            whose servers process the request in order to deliver it. Beyond those, your
            enquiry is not shared with anyone, and it is never used for advertising or sold.
          </p>
          <p>
            If we cannot deliver your enquiry, the site tells you so and asks you to try
            again — it will not confirm a reference for something that did not reach us.
          </p>
        </LegalSection>

        <LegalSection title="How long we keep it">
          <p>
            Enquiries and their attachments are kept for <strong className="text-fg">{RETENTION}</strong>{" "}
            from the date you send them, so we can answer follow-up questions and repeat
            orders, and are then deleted. If your enquiry becomes an order, the related
            records are kept for as long as tax and company law requires.
          </p>
          <p>
            You can ask us to delete your enquiry sooner by emailing {site.email}. We aim to
            respond to enquiries, including these requests, within {RESPONSE}.
          </p>
        </LegalSection>

        <LegalSection title="What stays in your browser only">
          <p>
            The part numbers you build in the{" "}
            <Link href="/tools/shaft-configurator" className="font-medium text-accent hover:underline">
              configurators
            </Link>{" "}
            and collect into a quotation list are stored in your own browser, in its session
            storage. They are not sent anywhere and we cannot see them until you submit an
            enquiry.
          </p>
          <LegalList
            items={[
              <>The list stays as you move between pages and refresh in the same tab.</>,
              <>
                It is discarded when you close the browser, after{" "}
                {QUOTE_IDLE_MS / 3_600_000} hours without a change, or{" "}
                {QUOTE_MAX_AGE_MS / 3_600_000} hours after you started it.
              </>,
              <>It is cleared as soon as an enquiry is successfully sent.</>,
              <>
                A new tab or window starts empty, except the &ldquo;Open full-screen&rdquo;
                link inside a configurator, which deliberately carries your list with it.
              </>,
            ]}
          />
          <p>
            While you are building a list it carries a random reference beginning{" "}
            <span className="font-mono text-xs">JQ-</span>. It identifies which parts belong
            together in that one working session. It is not linked to you, and it is
            discarded with the list. Only when you submit the form does it appear alongside
            the contact details you typed.
          </p>
        </LegalSection>

        <LegalSection title="Cookies and measurement">
          <p>
            <strong className="text-fg">This site sets no cookies at all</strong> — no
            advertising, no tracking, no third-party scripts, and nothing that needs a
            consent banner.
          </p>
          <p>
            We do count anonymous page and action events so we can see which parts of the
            catalogue people look for. Each event carries only a fixed set of categories and
            counts — for example which product family was viewed, or that a search was for a
            part code rather than a phrase.{" "}
            <strong className="text-fg">What you type into the search box is never sent</strong>
            , and neither is any free text. If your browser sends a Do&nbsp;Not&nbsp;Track
            signal, we record nothing at all.
          </p>
        </LegalSection>

        <LegalSection title="Server records">
          <p>
            Our servers log that an enquiry was received and whether it was delivered —
            a reference number, the mode, how many items and files it had, and the delivery
            status. Your contact details, your requirement text and your filenames are
            deliberately kept out of those logs.
          </p>
          <p>
            Our hosting provider keeps its own short-term technical logs, including IP
            addresses, to operate and protect the service. We do not store IP addresses
            ourselves.
          </p>
        </LegalSection>

        <LegalSection title="Your choices">
          <p>You can ask us to:</p>
          <LegalList
            items={[
              <>tell you what enquiry information we hold about you;</>,
              <>correct anything that is wrong;</>,
              <>delete your enquiry and its attachments;</>,
              <>stop contacting you.</>,
            ]}
          />
          <p>
            Email {site.email} and we will act on it. You can browse this entire website,
            search the catalogue and build part numbers without telling us anything about
            yourself.
          </p>
        </LegalSection>

        <LegalSection title="Children">
          <p>
            This is a business-to-business site for industrial buyers and engineers. It is
            not directed at children and we do not knowingly collect their information.
          </p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            If we change how information is handled, we will update this page and its
            effective date. Material changes will be described here rather than made quietly.
          </p>
        </LegalSection>
      </LegalDoc>
      <CtaBand
        title="Questions about your data?"
        body="Ask us directly — a person will answer."
        primary={{ label: "Contact JIDOKA", href: "/contact" }}
      />
    </>
  );
}
