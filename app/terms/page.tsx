import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { LegalDoc, LegalSection, LegalList } from "@/components/site/LegalDoc";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms on which JIDOKA offers this website, its catalogue information and its enquiry service.",
};

const JURISDICTION = "Faridabad, Haryana, India";
const RESPONSE = "one working day";

export default function Page() {
  return (
    <>
      <PageHeader
        motif="sheet"
        eyebrow="Legal"
        title="Terms of Use"
        lead="The terms on which we offer this website, its catalogue information and its enquiry service."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
      />
      <LegalDoc effective="12 September 2026">
        <LegalSection title="In short">
          <p>
            This website helps you identify and specify industrial components and send us an
            enquiry. It is not a shop. Nothing here is an offer to sell, a price, or a promise
            of stock, and no contract is formed until JIDOKA issues a written quotation and
            you accept it.
          </p>
        </LegalSection>

        <LegalSection title="Who we are">
          <p>
            This website is operated by {site.legalName}. In these terms
            &ldquo;we&rdquo; and &ldquo;JIDOKA&rdquo; mean {site.legalName}, and
            &ldquo;you&rdquo; means the person or business using the site.
          </p>
        </LegalSection>

        <LegalSection title="This is not an online shop">
          <p>
            The site deliberately has no cart, no checkout and no payment. It shows no prices
            and makes no stock commitments. Part numbers you build in the configurators, and
            the quotation list you collect them into, are a way of describing what you need —
            not an order, and nothing is reserved.
          </p>
          <p>
            A binding contract arises only when JIDOKA provides a written quotation and you
            accept it, subject to JIDOKA&apos;s terms of sale for that order. We may decline
            or withdraw from any enquiry.
          </p>
        </LegalSection>

        <LegalSection title="Technical information, and the limits of it">
          <p>
            Catalogue data, dimensions, drawings, material and treatment descriptions on this
            site are reproduced from manufacturer catalogues to help you specify a component.
            We take care over them, but:
          </p>
          <LegalList
            items={[
              <>
                catalogue data can change, and a printed catalogue page remains the reference —
                every product page links to the catalogue it came from;
              </>,
              <>
                a part number the configurator accepts is a validly formed code, not a
                confirmation that the item is available or right for your application;
              </>,
              <>
                where a catalogue section has not yet been transcribed, the site says so and
                offers a manual enquiry route rather than guessing;
              </>,
              <>
                we never claim a JIDOKA part is equivalent to another manufacturer&apos;s
                without human verification. Alternatives are submitted for technical review,
                and equivalence is confirmed by an engineer or not at all.
              </>,
            ]}
          />
          <p>
            <strong className="text-fg">You remain responsible for the suitability of a
            component for your application.</strong> Selection depends on loads, tolerances,
            environment, duty cycle and safety requirements that we cannot see from an
            enquiry. Where safety, life or significant property depends on the choice, have it
            verified by a qualified engineer — ours or yours. Ask us and we will help.
          </p>
        </LegalSection>

        <LegalSection title="Enquiries and quotations">
          <p>
            Please give accurate contact and requirement details — we use them to prepare a
            response, and a quotation based on wrong information will be wrong. Do not submit
            anyone else&apos;s confidential information without their permission.
          </p>
          <p>
            We aim to respond to enquiries within {RESPONSE}. A reference number shown after
            you submit confirms that your enquiry reached us; it is not a quotation, an order
            acknowledgement or a status portal. If we cannot deliver your enquiry, the site
            tells you so at the time.
          </p>
          <p>
            Drawings, BOMs and specifications you send are treated as confidential and used
            only to answer your enquiry. See the{" "}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="Acceptable use">
          <p>You agree not to:</p>
          <LegalList
            items={[
              <>submit false contact details, or enquiries you have no genuine intent behind;</>,
              <>
                upload files containing malicious code, or anything you do not have the right
                to send us;
              </>,
              <>
                scrape, bulk-download or systematically copy the catalogue data, or attempt to
                extract it other than through normal use of the site;
              </>,
              <>
                interfere with the site or its enquiry endpoints, including attempting to
                overload them or bypass their limits;
              </>,
              <>use the site to break any applicable law.</>,
            ]}
          />
          <p>
            We may restrict access where use of the site threatens its availability or
            integrity.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual property">
          <p>
            The site&apos;s design, text, drawings and the structure of its catalogue data
            belong to JIDOKA or to the manufacturers whose catalogues they derive from.
            Downloadable catalogues and CAD files remain the property of their respective
            owners and are provided for you to specify and purchase components — not for
            redistribution or resale.
          </p>
          <p>
            Manufacturer and brand names are used only to identify products and their
            compatibility. They remain the trade marks of their owners, and their use here
            implies no endorsement or affiliation.
          </p>
        </LegalSection>

        <LegalSection title="Availability">
          <p>
            We aim to keep the site available, but it is provided as it is. Parts of it may be
            unavailable for maintenance or for reasons outside our control, and the interactive
            tools require a working connection to load drawings and catalogue downloads.
          </p>
        </LegalSection>

        <LegalSection title="Liability">
          <p>
            To the extent permitted by law, JIDOKA is not liable for indirect or consequential
            loss, or for loss of profit, production, contracts or data, arising from use of
            this website or reliance on the technical information it presents.
          </p>
          <p>
            Nothing in these terms limits liability for death or personal injury caused by
            negligence, for fraud, or for any other liability that cannot lawfully be excluded.
            Liability in connection with any component supplied is governed by JIDOKA&apos;s
            terms of sale for that order, not by this page.
          </p>
        </LegalSection>

        <LegalSection title="Links to other sites">
          <p>
            Where we link to a manufacturer, a catalogue host or a map service, we do not
            control those sites and are not responsible for their content or their handling of
            your information.
          </p>
        </LegalSection>

        <LegalSection title="Changes to these terms">
          <p>
            We may update these terms as the site changes. The version published here, with
            its effective date, is the one that applies to your use of the site.
          </p>
        </LegalSection>

        <LegalSection title="Governing law">
          <p>
            These terms are governed by the laws of India, and the courts of{" "}
            {JURISDICTION} have exclusive jurisdiction over any dispute arising from them or
            from use of this website.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-accent hover:underline">
              {site.email}
            </a>
            {site.phone ? <> or {site.phone}</> : null}.
          </p>
        </LegalSection>
      </LegalDoc>
      <CtaBand
        title="Need something clarified?"
        body="Ask us — we would rather answer than have you guess."
        primary={{ label: "Contact JIDOKA", href: "/contact" }}
      />
    </>
  );
}
