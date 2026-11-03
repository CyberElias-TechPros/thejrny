import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-14 md:py-24">
      <Reveal>
        <nav className="mb-10 flex items-center gap-2 text-mono text-[9px] text-mute">
          <Link to="/" className="hover:text-ink">HOME</Link>
          <span>/</span>
          <span className="text-ink">Privacy Policy</span>
        </nav>
        <h1 className="h2-display mb-10">Privacy Policy</h1>
      </Reveal>

      <div className="reveal-guard" />
      <Reveal delay={80}>
        <p className="text-[13px] leading-[1.8] text-ink/70 mb-6 max-w-2xl">
          Last updated: November 3, 2026. This Privacy Policy explains how JOURNEY
          ("we", "us", "our") collects, uses, and protects information when you visit
          or make a purchase at thejrny.com.ng (the "Site").
        </p>
      </Reveal>

      <div className="space-y-12 max-w-2xl">
        {[
          {
            t: '1. Information we collect',
            d: 'We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you place an order or contact us. We also automatically collect certain information about your device and browsing activity, including your IP address, browser type, pages viewed, and referral source, using cookies and similar technologies.',
          },
          {
            t: '2. How we use your information',
            d: 'We use your information to process and fulfil orders, communicate with you about your purchases, improve the Site, and send marketing communications (only where you have consented). We do not sell your personal data to third parties.',
          },
          {
            t: '3. Cookies and tracking',
            d: 'The Site uses cookies to remember your preferences, maintain your shopping bag, analyse traffic, and serve advertisements (including Google AdSense). You may accept or opt out of cookies via the cookie banner on your first visit, and you may disable cookies in your browser settings at any time.',
          },
          {
            t: '4. Sharing and disclosure',
            d: 'We share data only with service providers necessary to run the Site and fulfil orders, including our e-commerce platform, payment processor (Paystack), email provider, and courier partners. We do not share your data with unrelated third parties for their own marketing purposes.',
          },
          {
            t: '5. Data security',
            d: 'We implement reasonable technical and organisational measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
          },
          {
            t: '6. Your rights',
            d: 'You may request access to, correction of, or deletion of your personal data by contacting us. You may also withdraw consent to marketing communications at any time.',
          },
          {
            t: '7. Children',
            d: 'The Site is not directed to individuals under the age of 16, and we do not knowingly collect personal data from children.',
          },
          {
            t: '8. Changes to this policy',
            d: 'We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision.',
          },
        ].map((section, i) => (
          <section key={section.t} className="border-t border-ink pt-6 first:border-none">
            <Reveal key={section.t} delay={120 + i * 60}>
              <p className="label-xs text-mute mb-2">{section.t}</p>
              <p className="text-[13px] leading-[1.8] text-ink/70">{section.d}</p>
            </Reveal>
          </section>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="mt-16 border border-line rounded-sm bg-bone-2 p-8 md:p-10">
          <p className="label-xs text-mute mb-3">Questions about this policy</p>
          <p className="text-[13px] leading-[1.8] text-ink/65 mb-6">
            If you have any questions about this Privacy Policy or our data practices,
            contact us at hello@thejrny.com.ng.
          </p>
          <WhatsAppButton
            variant="pill"
            message="Hi JOURNEY, I have a question about your Privacy Policy."
            label="Ask about privacy"
          />
        </div>
      </Reveal>
    </div>
  )
}
