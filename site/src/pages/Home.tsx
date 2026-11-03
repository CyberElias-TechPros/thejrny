import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { api } from '../lib/convex'
import ProductGrid from '../components/ProductGrid'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import { useSEO } from '../lib/seo'

export default function Home() {
  useSEO({
    title: 'JOURNEY — Single-Batch Wardrobe. Not Restocked.',
    path: '/',
  })

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const products = useQuery(api.products.list, {}) as any[] | undefined
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const categories = useQuery(api.categories.list, {}) as any[] | undefined

  const fresh = useMemo(
    () =>
      (products ?? [])
        .filter((p) => p.is_new)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [products],
  )

  const hero = fresh[0] ?? products?.[0]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const tiles = useMemo(() => {
    if (!categories || !products) return []
    return categories
      .filter((c) => String(c.name).toUpperCase() !== 'NEW')
      .slice(0, 4)
      .map((c) => {
        const catId = c.id ?? c._id
        const img = products.find((p) => p.categories?.includes(catId) && p.image_url)?.image_url
        return {
          to: `/${String(c.name).toLowerCase().replace(/\s+/g, '-')}`,
          name: String(c.name).toUpperCase(),
          img,
        }
      })
  }, [categories, products])

  const loading = products === undefined

  return (
    <div>
      {/* ─────────────────────────────── HERO */}
      <section className="relative">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
            <div>
              <Reveal>
                <p className="label-xs text-mute mb-6">INAUGURAL DROP — SS26</p>
              </Reveal>
              <h1 className="h1-display">
                <Reveal delay={80}>Single-batch</Reveal>
                <Reveal delay={160}>
                  <span className="text-mute">Wardrobe.</span>
                </Reveal>
                <Reveal delay={240}>
                  <span className="text-mute">Not restocked.</span>
                </Reveal>
              </h1>
              <Reveal delay={320}>
                <p className="mt-7 max-w-md text-[14px] leading-[1.75] text-ink/60">
                  Each artifact is produced once, in a finite quantity. When the batch
                  sells through, it is archived permanently.
                </p>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link to="/#new" className="btn-primary">
                    SHOP THE DROP
                  </Link>
                  <WhatsAppButton
                    variant="inline"
                    message="Hi JOURNEY, I'd like help shopping the current batch."
                    label="Chat on WhatsApp"
                  />
                  <Link to="/about" className="btn-outline">
                    THE MANIFESTO
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* hero image */}
            <Reveal delay={200}>
              <Link
                to={hero ? `/products/${hero.id ?? hero._id}` : '/'}
                className="group relative block overflow-hidden bg-ash aspect-[4/5] md:aspect-[3/4]"
              >
                {hero?.image_url ? (
                  <img
                    src={hero.image_url}
                    alt={hero.name}
                    className="img-cover hover-zoom"
                  />
                ) : (
                  <div className="absolute inset-0 skeleton" />
                )}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-void/80 to-transparent px-5 pb-5 pt-16">
                  <span className="text-mono text-[9px] text-ink/90">
                    {hero?.code ?? 'LOADING'}
                  </span>
                  <span className="flex items-center gap-1.5 text-mono text-[9px] text-ink/90">
                    VIEW PIECE <ArrowUpRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── MARQUEE */}
      <div className="border-y border-line bg-bone-2 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap py-3 text-mono text-[9px] text-mute">
          <span className="px-6">SINGLE BATCH</span>
          <span className="px-6" aria-hidden>◦</span>
          <span className="px-6">MADE IN LAGOS</span>
          <span className="px-6" aria-hidden>◦</span>
          <span className="px-6">SHIPS WORLDWIDE</span>
          <span className="px-6" aria-hidden>◦</span>
          <span className="px-6">FINITE QUANTITIES</span>
          <span className="px-6" aria-hidden>◦</span>
          <span className="flex" aria-hidden>
            <span className="px-6">SINGLE BATCH</span>
            <span className="px-6">◦</span>
            <span className="px-6">MADE IN LAGOS</span>
            <span className="px-6">◦</span>
            <span className="px-6">SHIPS WORLDWIDE</span>
            <span className="px-6">◦</span>
            <span className="px-6">FINITE QUANTITIES</span>
            <span className="px-6">◦</span>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────── CATEGORY TILES */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="h2-display">Browse</h2>
            <span className="label-xs text-mute">
              {loading ? '—' : `${(products ?? []).length} ARTIFACTS IN THE ARCHIVE`}
            </span>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {tiles.length === 0
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] skeleton" />
              ))
            : tiles.map((t, i) => (
                <Reveal key={t.to} delay={i * 90}>
                  <Link to={t.to} className="group relative block overflow-hidden bg-ash aspect-[3/4]">
                    {t.img ? (
                      <img src={t.img} alt={t.name} className="img-cover hover-zoom" loading="lazy" />
                    ) : null}
                    <div className="absolute inset-0 bg-void-3/20 transition-colors group-hover:bg-void-3/40" />
                    <span className="absolute bottom-4 left-4 text-mono text-[10px] text-ink">
                      {t.name}
                    </span>
                    <span className="absolute top-4 right-4 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </Link>
                </Reveal>
              ))}
        </div>
      </section>

      {/* ─────────────────────────────── NEW GRID */}
      <section id="new" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 md:px-8 pb-16 md:pb-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
            <h2 className="h2-display">New arrivals</h2>
            <span className="hidden md:flex items-center gap-2 label-xs text-mute">
              IN STOCK NOW <ArrowDown size={12} strokeWidth={1.5} />
            </span>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton" />
                <div className="mt-3 h-2.5 w-1/3 skeleton" />
                <div className="mt-2 h-2.5 w-2/5 skeleton" />
              </div>
            ))}
          </div>
        ) : fresh.length === 0 ? (
          <p className="py-16 text-center text-mono text-[10px] text-mute">
            NOTHING IN THIS BATCH YET. CHECK BACK SOON.
          </p>
        ) : (
          <ProductGrid products={fresh} />
        )}
      </section>

      {/* ─────────────────────────────── MANIFESTO */}
      <section className="border-t border-line bg-bone-2">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Single batch',
                d: 'Every artifact is produced once, in a finite quantity. No restocks, no reprints, no exceptions.',
              },
              {
                n: '02',
                t: 'Made in Lagos',
                d: 'Cut and finished in small runs by local workshops. Slight variation is part of the object.',
              },
              {
                n: '03',
                t: 'Worldwide',
                d: 'Dispatched globally with tracked couriers. Pay in Naira or Pounds at checkout.',
              },
            ].map((c, i) => (
              <Reveal key={c.n} delay={i * 110}>
                <div className="border-t border-ink pt-6">
                  <p className="label-xs text-mute mb-4">{c.n}</p>
                  <h3 className="h3-display uppercase mb-3">{c.t}</h3>
                  <p className="max-w-xs text-[13px] leading-[1.75] text-ink/60">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── WHATSAPP BAND */}
      <section className="border-t border-line bg-bone-2">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-20">
          <div className="border border-line rounded-sm p-8 md:p-12 text-center">
            <p className="label-xs text-mute mb-3">Need help choosing?</p>
            <h3 className="h3-display mb-5">Chat with us on WhatsApp</h3>
            <WhatsAppButton
              variant="pill"
              message="Hi JOURNEY, I'm browsing your store and need help choosing a piece."
              label="Chat on WhatsApp"
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
