import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Terms() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-14 md:py-24">
      <Reveal>
        <nav className="mb-10 flex items-center gap-2 text-mono text-[9px] text-mute">
          <Link to="/" className="hover:text-ink">HOME</Link>
          <span>/</span>
          <span className="text-ink">Terms &amp; Conditions</span>
        </nav>
        <h1 className="h2-display mb-10">Terms &amp; Conditions</h1>
      </Reveal>

      <div className="space-y-12 max-w-2xl">
        {[
          {
            t: '1. Acceptance of terms',
            d: 'By accessing or using thejrny.com.ng (the "Site") or placing an order, you agree to be bound by these Terms &amp; Conditions. If you do not agree, you may not use the Site.',
          },
          {
            t: '2. Orders and pricing',
            d: 'All products are offered subject to availability. Because JOURNEY operates on a single-batch model, items may sell through quickly. Prices are displayed in Naira (₦) or Pounds (£) and are inclusive of applicable taxes where required. We reserve the right to correct pricing errors and to cancel or refuse any order.',
          },
          {
            t: '3. Payment',
            d: 'Payments are processed securely through Paystack (cards, USSD, bank transfer) or by manual bank transfer. Your order is confirmed once payment is received and verified.',
          },
          {
            t: '4. Fulfilment and shipping',
            d: 'Orders dispatch within 2–3 working days of payment confirmation via tracked courier. Delivery times vary by destination. Shipping rates are shown at checkout before payment.',
          },
          {
            t: '5. Single-batch policy',
            d: 'Each artifact is produced once, in a finite quantity, and is not restocked. Once a batch sells through, the item is archived and unavailable for purchase.',
          },
          {
            t: '6. Returns and refunds',
            d: 'Returns are accepted within 7 days of delivery on unworn, unwashed pieces with tags intact. Refunds are issued to the original payment method once the returned item is received and inspected. International returns are at the customer’s cost. See our Refund &amp; Return Policy for full details.',
          },
          {
            t: '7. User conduct',
            d: 'You agree not to use the Site for any unlawful purpose, to interfere with its operation, or to reproduce content without permission. All text, images, and designs on the Site are the property of JOURNEY.',
          },
          {
            t: '8. Limitation of liability',
            d: 'To the fullest extent permitted by law, JOURNEY is not liable for indirect, incidental, or consequential damages arising out of your use of the Site or any purchase.',
          },
          {
            t: '9. Governing law',
            d: 'These Terms are governed by the laws of the Federal Republic of Nigeria.',
          },
          {
            t: '10. Changes',
            d: 'We may update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.',
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
          <p className="label-xs text-mute mb-3">Contact us</p>
          <p className="text-[13px] leading-[1.8] text-ink/65 mb-6">
            If you have questions about these Terms, contact us at
            hello@thejrny.com.ng.
          </p>
          <WhatsAppButton
            variant="pill"
            message="Hi JOURNEY, I have a question about your Terms &amp; Conditions."
            label="Ask about terms"
          />
        </div>
      </Reveal>
    </div>
  )
}
