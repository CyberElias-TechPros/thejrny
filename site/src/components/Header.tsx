import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCart } from '../contexts/CartContext'
import { api } from '../lib/convex'
import { useQuery } from 'convex/react'
import SearchOverlay from './SearchOverlay'
import ThemeToggle from './ThemeToggle'

const TICKER = [
  'SINGLE-BATCH FIRST RUN',
  'SHIPS WORLDWIDE',
  'NOT RESTOCKED',
  'THE WEBSITE IS THE BRAND',
  'INAUGURAL DROP — SS26',
]

export default function Header() {
  const { currency, setCurrency } = useCurrency()
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = (useQuery(api.categories.list, {}) ?? []) as any[]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: { to: string; label: string }[] = [
    { to: '/', label: 'NEW' },
    ...categories
      .filter((c: any) => c.name.toUpperCase() !== 'NEW')
      .map((c: any) => ({
        to: `/${String(c.name).toLowerCase().replace(/\s+/g, '-')}`,
        label: String(c.name).toUpperCase(),
      })),
  ]

  const go = (to: string) => {
    navigate(to)
    setMenuOpen(false)
  }

  return (
    <>
      {/* announcement ticker */}
      <div className="bg-bone text-ink overflow-hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 md:px-8">
          <div className="animate-marquee flex whitespace-nowrap py-3 text-mono text-[10px] gap-8">
            {[0, 1].map((k) => (
              <span key={k} className="flex" aria-hidden={k === 1}>
                {TICKER.map((t) => (
                  <span key={t} className="px-6 flex items-center gap-4">
                    {t} <span className="opacity-40">•</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 bg-bone/94 backdrop-blur-md border-b transition-colors duration-300 ${
          scrolled ? 'border-line' : 'border-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="flex h-16 items-center justify-between md:h-[76px]">
            {/* left: mobile menu + search */}
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-ink"
                aria-label="Menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <button
                className="text-ink hover:opacity-60 transition-opacity"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
            </div>

            {/* center: wordmark */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 select-none"
              aria-label="JOURNEY home"
            >
              <span className="font-display text-[22px] md:text-[28px] font-semibold tracking-[0.06em] uppercase text-ink">
                Journey
              </span>
            </Link>

            {/* right: currency (desktop) + bag + admin */}
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-2 text-mono text-[10px] text-mute">
                {(['NGN', 'GBP'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1.5 transition-colors ${
                      currency === c ? 'text-ink border-b border-ink font-medium' : 'hover:text-ink'
                    }`}
                  >
                    {c === 'NGN' ? '₦ NGN' : '£ GBP'}
                  </button>
                ))}
              </div>
              <div className="hidden lg:block">
                <Link
                  to="/admin"
                  className="text-mono text-[9px] text-mute hover:text-ink transition-colors"
                >
                  CONNEXION ADMINISTRATEUR
                </Link>
              </div>
              <button
                className="relative text-ink hover:opacity-60 transition-opacity"
                aria-label="Open bag"
                onClick={() => setOpen(true)}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bone px-1 text-[9px] font-medium text-ink">
                    {count}
                  </span>
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center justify-center gap-12 pb-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="link-underline text-mono text-[12px] text-mute hover:text-ink transition-colors font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className={`h-px bg-line md:hidden ${scrolled ? '' : 'opacity-0}'}`} />
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-[60] bg-bone transition-transform duration-600 ease-[cubic-bezier(.2,.8,.2,1)] md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-line">
          <span className="font-display text-[20px] font-semibold tracking-[0.3em] uppercase">
            Journey
          </span>
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="px-4 py-10">
          {nav.map((n, i) => (
            <button
              key={n.to}
              onClick={() => go(n.to)}
              className="group flex w-full items-center justify-between border-b border-line py-5 text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="h2-display text-[28px] text-ink">{n.label}</span>
              <ArrowUpRight size={20} strokeWidth={1.5} className="text-mute group-hover:text-ink" />
            </button>
          ))}
          <div className="mt-10 pt-6 border-t border-line">
            <div className="flex items-center gap-2 text-mono text-[10px] text-mute mb-4">
              {(['NGN', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 ${currency === c ? 'text-ink border border-ink font-medium' : 'hover:text-ink'}`}
                >
                  {c === 'NGN' ? '₦ NGN' : '£ GBP'}
                </button>
              ))}
            </div>
            <button
              onClick={() => go('/admin')}
              className="text-mono text-[10px] text-mute hover:text-ink"
            >
              ADMIN LOGIN →
            </button>
          </div>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
