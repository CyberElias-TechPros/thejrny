import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function About() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-14 md:py-20">
      <div className="grid gap-14 md:grid-cols-[1fr_1.4fr] lg:gap-24">
        {/* left rail */}
        <div>
          <Reveal>
            <p className="label-xs text-mute mb-4">ABOUT</p>
            <h1 className="h2-display mb-6">
              The website
              <br />
              <span className="text-mute">is the brand.</span>
            </h1>
          </Reveal>
        </div>

        {/* body */}
        <div>
          <Reveal delay={100}>
            <p className="max-w-2xl text-[16px] md:text-[19px] leading-[1.7] text-ink md:first-letter:float-left md:first-letter:mr-2 md:first-letter:text-[46px] md:first-letter:leading-[0.9] md:first-letter:font-medium">
              Journey is a single-batch wardrobe. Each artifact is produced once, in a
              finite quantity, and not restocked. The product feed is the interface.
              Silence is the loudest statement.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-7 max-w-xl text-[13px] leading-[1.8] text-ink/60">
              There is no seasonal calendar, no sale window, no back-catalogue. A piece
              appears when its batch is finished and disappears when it sells through.
              What remains online is what can still ship.
            </p>
          </Reveal>

          {/* policy blocks */}
          <div className="mt-14 space-y-10 max-w-xl">
            <Reveal delay={240}>
              <section id="shipping" className="border-t border-ink pt-5 scroll-mt-32">
                <p className="label-xs text-mute mb-3">01 — SHIPPING & DELIVERY</p>
                <p className="text-[13px] leading-[1.8] text-ink/65">
                  Orders dispatch within 2–3 working days of payment confirmation, via
                  tracked courier. Nigeria deliveries typically arrive in 1–3 days;
                  international 5–10 days depending on destination. Rates are shown at
                  checkout before payment.
                </p>
              </section>
            </Reveal>
            <Reveal delay={300}>
              <section id="returns" className="border-t border-ink pt-5 scroll-mt-32">
                <p className="label-xs text-mute mb-3">02 — RETURNS</p>
                <p className="text-[13px] leading-[1.8] text-ink/65">
                  Returns are accepted within 7 days of delivery on unworn, unwashed
                  pieces with tags intact. Quote your order reference (TJ-XXXX) when
                  contacting us and we'll arrange pickup or drop-off within Nigeria.
                  International returns are accepted at the customer's cost.
                </p>
              </section>
            </Reveal>
            <Reveal delay={360}>
              <section className="border-t border-ink pt-5">
                <p className="label-xs text-mute mb-3">03 — CARE</p>
                <p className="text-[13px] leading-[1.8] text-ink/65">
                  Cold wash, inside out. Hang dry in shade. Warm iron on reverse. With
                  this routine, the garment outlives the drop.
                </p>
              </section>
            </Reveal>
          </div>

          <Reveal delay={420}>
            <div className="mt-14 flex flex-wrap gap-3">
              <Link to="/" className="btn-primary">SHOP THE CURRENT BATCH</Link>
              <Link to="/contact" className="btn-outline">CONTACT US</Link>
              <WhatsAppButton
                variant="inline"
                message="Hi JOURNEY, I'd like to know more about the brand."
                label="Chat on WhatsApp"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
