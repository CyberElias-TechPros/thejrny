import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function RefundPolicy() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-14 md:py-24">
      <Reveal>
        <nav className="mb-10 flex items-center gap-2 text-mono text-[9px] text-mute">
          <Link to="/" className="hover:text-ink">HOME</Link>
          <span>/</span>
          <span className="text-ink">Refund &amp; Return Policy</span>
        </nav>
        <h1 className="h2-display mb-10">Refund &amp; Return Policy</h1>
      </Reveal>

      <p className="text-[13px] leading-[1.8] text-ink/70 mb-10 max-w-2xl">
        Last updated: November 3, 2026. Because JOURNEY operates on a single-batch
        model, each artifact is produced once and not restocked. Please read this
        policy carefully before placing an order.
      </p>

      <div className="space-y-12 max-w-2xl">
        {[
          {
            t: 'Eligibility for returns',
            d: 'You may return an unworn, unwashed, undamaged item with all original tags intact within 7 days of delivery. Items that show signs of wear, washing, damage, or missing tags are not eligible for return or refund.',
          },
          {
            t: 'How to initiate a return',
            d: 'Contact us at hello@thejrny.com.ng or via WhatsApp within the 7-day window, quoting your order reference (TJ-XXXX). We will confirm eligibility and arrange pickup or drop-off within Nigeria.',
          },
          {
            t: 'International returns',
            d: 'International returns are accepted at the customer’s cost, including return shipping and any import duties. Contact us before shipping an item back.',
          },
          {
            t: 'Refunds',
            d: 'Once we receive and inspect your returned item, we will process your refund to the original payment method. Refunds typically appear within 5–10 business days, depending on your bank or payment provider.',
          },
          {
            t: 'Non-returnable items',
            d: 'Final sale items, gift cards, and customized or made-to-order pieces (if offered) are not eligible for return or refund.',
          },
          {
            t: 'Exchanges',
            d: 'Because each batch is finite, we cannot offer direct exchanges for the same piece in a different size or colour. You may return an item for a refund and place a new order if the item is still available.',
          },
          {
            t: 'Damaged or incorrect items',
            d: 'If you receive a damaged or incorrect item, contact us within 48 hours of delivery with photos of the issue and your order reference. We will arrange a replacement or refund at no cost to you.',
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
          <p className="label-xs text-mute mb-3">Questions about returns</p>
          <p className="text-[13px] leading-[1.8] text-ink/65 mb-6">
            Contact us at hello@thejrny.com.ng or reach us fastest on WhatsApp.
          </p>
          <WhatsAppButton
            variant="pill"
            message="Hi JOURNEY, I'd like to start a return or refund for my order."
            label="Start a return"
          />
        </div>
      </Reveal>
    </div>
  )
}
