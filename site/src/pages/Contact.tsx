import { useState } from 'react'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Contact() {
  const [received, setReceived] = useState(false)

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-14 md:py-20">
      <div className="grid gap-14 md:grid-cols-2 lg:gap-24">
        {/* info column */}
        <div>
          <Reveal>
            <p className="label-xs text-mute mb-4">CONTACT</p>
            <h1 className="h2-display mb-6">
              Talk
              <br />
              <span className="text-mute">to us.</span>
            </h1>
            <p className="max-w-sm text-[13px] leading-[1.8] text-ink/60">
              Questions about a piece, a size, an order, or a delivery — this is the
              fastest path to an answer. We reply within 48 hours.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 space-y-4">
              <a
                href="mailto:hello@thejrny.com.ng"
                className="group flex items-center gap-4 border border-line px-5 py-4 transition-colors hover:border-ink"
              >
                <Mail size={17} strokeWidth={1.5} className="text-mute group-hover:text-ink" />
                <div>
                  <p className="label-xs text-mute">EMAIL</p>
                  <p className="mt-1 text-[13px] text-ink">hello@thejrny.com.ng</p>
                </div>
              </a>
              <a
                href="https://wa.me/2348137731227?text=Hi%20JOURNEY%2C%20I'd%20like%20to%20ask%20about%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-line px-5 py-4 transition-colors hover:border-ink"
              >
                <MessageCircle size={17} strokeWidth={1.5} className="text-mute group-hover:text-ink" />
                <div>
                  <p className="label-xs text-mute">WHATSAPP</p>
                  <p className="mt-1 text-[13px] text-ink">Fastest for order questions</p>
                </div>
              </a>
              <div className="flex items-center gap-4 border border-line px-5 py-4">
                <Clock size={17} strokeWidth={1.5} className="text-mute" />
                <div>
                  <p className="label-xs text-mute">HOURS</p>
                  <p className="mt-1 text-[13px] text-ink">Mon–Sat · 09:00–18:00 WAT</p>
                </div>
              </div>
              <WhatsAppButton
                variant="inline"
                message="Hi JOURNEY, I'd like to ask about an order."
                label="Chat on WhatsApp"
                className="mt-4 w-full justify-center"
              />
            </div>
          </Reveal>
        </div>

        {/* form column */}
        <Reveal delay={200}>
          {received ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center border border-line bg-bone-2 px-8 text-center">
              <p className="h2-display text-[clamp(1.4rem,3vw,2.2rem)] mb-3">Received</p>
              <p className="max-w-xs text-[13px] leading-[1.75] text-ink/60 mb-6">
                Your message is in the queue. We will reply within 48 hours — check
                your inbox (and spam) for our reply.
              </p>
              <WhatsAppButton
                variant="inline"
                message="Hi JOURNEY, I'm following up on a message I sent."
                label="Follow up on WhatsApp"
              />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setReceived(true)
              }}
              className="space-y-7 md:pt-16"
            >
              <input
                required
                type="text"
                placeholder="NAME"
                className="field-line"
              />
              <input
                required
                type="email"
                placeholder="EMAIL ADDRESS"
                className="field-line"
              />
              <input
                placeholder="ORDER REFERENCE (OPTIONAL — E.G. TJ-0421)"
                className="field-line"
              />
              <textarea
                required
                rows={5}
                placeholder="MESSAGE"
                className="field-line resize-none"
              />
              <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-[220px]">
                SEND MESSAGE
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  )
}
