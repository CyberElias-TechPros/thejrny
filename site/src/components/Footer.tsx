import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, MapPin } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'

export default function Footer() {
  const [email, setEmail] = useState('')

  const join = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Enter a valid email.')
      return
    }
    localStorage.setItem('jrny-newsletter', email)
    setEmail('')
    toast.success("You're on the list. First access to every drop.")
  }

  return (
    <footer className="border-t border-line bg-bone-2">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* newsletter band */}
        <div className="grid gap-10 border-b border-line py-14 md:grid-cols-[1fr_380px] md:items-end">
          <div>
            <p className="label-xs text-mute mb-3">The Journal</p>
            <h2 className="h3-display max-w-xl uppercase">
              One batch. One email. When it's back, it won't be.
            </h2>
          </div>
          <form onSubmit={join} className="flex items-center gap-3 border-b border-ink pb-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="bg-transparent text-mono text-[11px] uppercase tracking-[0.14em] outline-none flex-1 placeholder:text-mute"
            />
            <button type="submit" aria-label="Subscribe" className="text-ink hover:opacity-60">
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        {/* link columns */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-[20px] font-semibold tracking-[0.28em] uppercase">
              Journey
            </span>
            <p className="mt-4 max-w-xs text-[13px] leading-[1.7] text-ink/60">
              A single-batch wardrobe. Each artifact is produced once, in a finite
              quantity, and not restocked.
            </p>
            <div className="mt-6 flex gap-5 text-mute">
              <a
                href="https://instagram.com/thejrny"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-ink transition-colors"
              >
                @thejrny
              </a>
              <a
                href="https://x.com/thejrny"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="hover:text-ink transition-colors"
              >
                @thejrny
              </a>
              <a
                href="javascript:void(0)"
                aria-label="Store location"
                className="hover:text-ink transition-colors"
              >
                <MapPin size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <FooterCol
            title="SHOP"
            links={[
              { to: '/', label: 'New drops' },
              { to: '/mens', label: 'Mens' },
              { to: '/womens', label: 'Womens' },
              { to: '/accessories', label: 'Accessories' },
              { to: '/jersey', label: 'Jersey' },
              { to: '/shorts', label: 'Shorts' },
            ]}
          />
          <FooterCol
            title="HELP"
            links={[
              { to: '/about', label: 'About the brand' },
              { to: '/contact', label: 'Contact' },
              { to: '/about#shipping', label: 'Shipping & delivery' },
              { to: '/about#returns', label: 'Returns' },
              { to: '/shipping-policy', label: 'Shipping policy' },
              { to: '/refund-policy', label: 'Refund & returns' },
              { to: '/privacy-policy', label: 'Privacy policy' },
              { to: '/terms', label: 'Terms & conditions' },
            ]}
          />
          <div>
            <p className="label-xs text-mute mb-5">Payments</p>
            <div className="flex flex-wrap gap-1.5">
              {['VISA', 'MC', 'VSD', 'USSD', 'PAY'].map((m) => (
                <span
                  key={m}
                  className="border border-line px-2 py-1 text-mono text-[9px] text-mute"
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-ink/50 leading-[1.7]">
              Secured by Paystack. Bank transfer available at checkout.
            </p>
          </div>
        </div>

        {/* bottom strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-mono text-[9px] text-mute">
          <span>© JOURNEY {new Date().getFullYear()} — ALL RIGHTS RESERVED</span>
          <div className="flex gap-6 items-center">
            <WhatsAppButton
              variant="inline"
              message="Hi JOURNEY, I'd like to ask about an order."
              label="Chat on WhatsApp"
            />
            <Link to="/admin" className="hover:text-ink">
              CONNEXION ADMINISTRATEUR
            </Link>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
              SHIPS WORLDWIDE
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { to: string; label: string }[]
}) {
  return (
    <div>
      <p className="label-xs text-mute mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="link-underline text-[13px] text-ink/80 hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
