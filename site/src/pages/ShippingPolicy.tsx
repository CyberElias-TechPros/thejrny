import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function ShippingPolicy() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-14 md:py-24">
      <Reveal>
        <nav className="mb-10 flex items-center gap-2 text-mono text-[9px] text-mute">
          <Link to="/" className="hover:text-ink">HOME</Link>
          <span>/</span>
          <span className="text-ink">Shipping &amp; Delivery</span>
        </nav>
        <h1 className="h2-display mb-10">Shipping &amp; Delivery</h1>
      </Reveal>

      <p className="text-[13px] leading-[1.8] text-ink/70 mb-10 max-w-2xl">
        We dispatch orders worldwide with tracked couriers. Rates and delivery
        estimates are calculated at checkout before you pay.
      </p>

      <div className="grid gap-8 md:grid-cols-2 max-w-3xl">
        {[
          {
            t: 'Processing time',
            d: 'Orders are processed and dispatched within 2–3 working days of payment confirmation. You will receive a tracking number once your order ships.',
          },
          {
            t: 'Nigeria delivery',
            d: 'Deliveries within Nigeria typically arrive within 1–3 days after dispatch, depending on destination and courier.',
          },
          {
            t: 'International delivery',
            d: 'International deliveries typically arrive within 5–10 days after dispatch, depending on destination and customs clearance.',
          },
          {
            t: 'Shipping rates',
            d: 'Rates vary by region and courier and are shown at checkout before payment. Free shipping thresholds may apply during promotions.',
          },
          {
            t: 'Order tracking',
            d: 'Every order ships with a tracking number. Use it on the courier’s website to follow your delivery.',
          },
          {
            t: 'Delivery issues',
            d: 'If your delivery is delayed or lost, contact us at hello@thejrny.com.ng with your order reference (TJ-XXXX) and we will investigate with the courier.',
          },
        ].map((section, i) => (
          <section key={section.t} className="border border-line rounded-sm p-6 bg-bone-2">
            <Reveal key={section.t} delay={i * 80}>
              <p className="label-xs text-mute mb-2">{section.t}</p>
              <p className="text-[13px] leading-[1.8] text-ink/70">{section.d}</p>
            </Reveal>
          </section>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="mt-12 border border-line rounded-sm bg-bone-2 p-8 md:p-10">
          <p className="label-xs text-mute mb-3">Shipping questions</p>
          <p className="text-[13px] leading-[1.8] text-ink/65 mb-6">
            Contact us at hello@thejrny.com.ng or reach us fastest on WhatsApp.
          </p>
          <WhatsAppButton
            variant="pill"
            message="Hi JOURNEY, I have a question about shipping and delivery."
            label="Ask about shipping"
          />
        </div>
      </Reveal>
    </div>
  )
}
