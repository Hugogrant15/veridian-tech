import type { ReactNode } from "react";
import { COMPANY, formatAddress } from "../config/company";
import { PageHeader } from "../components/PageHeader";
import { Seo } from "../components/ui";

const LAST_UPDATED = "11 November 2026";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <div className="flex flex-col gap-3 text-lg leading-relaxed text-body">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy notice | Veridian Tech Innovations Ltd"
        description="How Veridian Tech Innovations Ltd handles the personal data you share through this website."
      />
      <PageHeader
        eyebrow="Privacy"
        title="Privacy notice"
        sub={`How we handle the personal data you share through this website. Last updated ${LAST_UPDATED}.`}
      />
      <article className="mx-auto flex max-w-3xl flex-col gap-12 px-5 pb-28 sm:px-8">
        <Block title="Who we are">
          <p>
            This website is run by {COMPANY.legalName} (RC {COMPANY.rcNumber}), {formatAddress()}. We are responsible
            for the personal data described here, under the Nigeria Data Protection Act 2023.
          </p>
        </Block>

        <Block title="What we collect">
          <p>
            When you use our contact form, we receive your name, your email address, your phone number if you give it,
            and your message. When you contact us by phone, WhatsApp or email, we receive whatever you choose to share.
          </p>
          <p>
            Like any website, our hosting provider processes your IP address to deliver pages, block spam and limit
            abuse of the contact form.
          </p>
        </Block>

        <Block title="Why we use it">
          <p>
            Only to reply to you and to discuss the work you asked about. We do not sell your data, add you to mailing
            lists you did not ask for, or use it for advertising.
          </p>
        </Block>

        <Block title="Cookies and tracking">
          <p>This website sets no tracking or advertising cookies and uses no analytics tools.</p>
        </Block>

        <Block title="Who else handles it">
          <p>
            Cloudflare hosts this website and the contact form. Brevo delivers contact-form messages to our inbox. Each
            handles your data only to provide that service to us.
          </p>
        </Block>

        <Block title="How long we keep it">
          <p>
            For as long as we need it to deal with your enquiry and any work that follows from it. After that we delete
            it.
          </p>
        </Block>

        <Block title="Your rights">
          <p>
            You can ask to see the personal data we hold about you, ask us to correct or delete it, object to how we
            use it, or withdraw your consent. Email us at{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-emerald-deep underline">
              {COMPANY.email}
            </a>
            . You can also complain to the Nigeria Data Protection Commission.
          </p>
        </Block>
      </article>
    </>
  );
}
