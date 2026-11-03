import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { ChevronDown } from 'lucide-react'
import { api } from '../lib/convex'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCart } from '../contexts/CartContext'
import { formatMoney } from '../lib/money'
import { toast } from 'sonner'
import ProductGrid from '../components/ProductGrid'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import { useProductSEO } from '../lib/seo'
import type { Product } from '../components/ProductCard'

type Size = { _id?: string; label: string; stock: number; price_ngn?: number }

export default function ProductPage() {
  const { id } = useParams()
  const { currency } = useCurrency()
  const { add } = useCart()

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const product = useQuery(api.products.get, { id }) as any
  const allProducts = useQuery(api.products.list, {}) as unknown as Product[] | undefined

  useProductSEO({
    product: product ?? undefined,
    path: product ? `/products/${product.id ?? product._id}` : '/products/unknown',
    currency,
  })

  const [size, setSize] = useState<string | null>(null)
  const [openPane, setOpenPane] = useState<string | null>(null)

  useEffect(() => {
    setSize(null)
    setOpenPane(null)
    window.scrollTo(0, 0)
  }, [id])

  const related = useMemo(() => {
    if (!allProducts || !product) return []
    const myCats: string[] = product.categories ?? []
    const scored = allProducts
      .filter((p) => (p.id ?? p._id) !== (product.id ?? product._id))
      .map((p) => ({
        p,
        score: ((p as any).categories ?? []).filter((c: string) => myCats.includes(c)).length,
      }))
      .sort((a, b) => b.score - a.score)
    return scored.slice(0, 4).map((s) => s.p)
  }, [allProducts, product])

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-[4/5] skeleton" />
          <div className="space-y-4">
            <div className="h-3 w-24 skeleton" />
            <div className="h-10 w-3/4 skeleton" />
            <div className="h-6 w-32 skeleton" />
            <div className="h-12 w-full skeleton" />
          </div>
        </div>
      </div>
    )
  }
  if (product === null) {
    return (
      <div className="py-28 text-center">
        <p className="h2-display mb-3">Artifact not found</p>
        <p className="text-mono text-[10px] text-mute mb-8">
          IT MAY HAVE BEEN ARCHIVED WITH ITS BATCH.
        </p>
        <Link to="/" className="btn-primary">SHOP NEW</Link>
      </div>
    )
  }

  const price =
    currency === 'GBP'
      ? product.price_gbp ?? Math.round((product.price_ngn ?? 0) / 2000)
      : product.price_ngn
  const sizes: Size[] = product.product_sizes ?? []
  const totalStock = sizes.reduce((s, sz) => s + (sz.stock ?? 0), 0)
  const soldOut = totalStock <= 0
  const selected = sizes.find((s) => s.label === size)
  const lastUnits = !soldOut && totalStock <= 3

  const addLine = () => {
    if (!size) return
    add({
      productId: product.id ?? product._id,
      size,
      qty: 1,
      price,
      product: {
        id: product.id ?? product._id,
        code: product.code,
        name: product.name,
        image_url: product.image_url,
        price_ngn: product.price_ngn,
        price_gbp: product.price_gbp,
      },
    })
    toast.success(`Added to bag — ${product.code} · ${size}`)
  }

  const panes = [
    {
      id: 'details',
      title: 'DETAILS & FIT',
      body:
        product.description ??
        `${product.name}. Cut in a single batch. Slight variation between units is part of the object. True to size — take your usual.`,
    },
    {
      id: 'shipping',
      title: 'SHIPPING & RETURNS',
      body:
        'Dispatched worldwide with tracked couriers within 2–3 working days of payment. Returns accepted within 7 days of delivery on unworn pieces — quote your order reference (TJ-XXXX) when contacting us.',
    },
    {
      id: 'material',
      title: 'MATERIAL',
      body: product.material ?? 'Heavyweight cotton-based construction, finished in-house. Care: cold wash, hang dry. Do not bleach.',
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12 animate-fade">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-mono text-[9px] text-mute">
        <Link to="/" className="hover:text-ink">HOME</Link>
        <span>/</span>
        <span className="text-ink">{String(product.code ?? '').toUpperCase()}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* ── image column */}
        <div className="relative">
          <div className="relative overflow-hidden bg-ash aspect-[4/5] md:sticky md:top-32 card-surface">
            {product.image_url ? (
              <img
                alt={product.name}
                className="img-cover hover-zoom"
                src={product.image_url}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-mono text-[10px] text-mute">
                  {String(product.code ?? '').toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--color-bone)_100%)] pointer-events-none" />
            {soldOut && (
              <span className="absolute left-4 top-4 bg-bone/95 px-2.5 py-1 text-mono text-[9px] text-ink border border-line">
                SOLD OUT
              </span>
            )}
            {!soldOut && totalStock <= 3 && (
              <span className="absolute left-4 top-4 bg-bone/95 px-2.5 py-1 text-mono text-[9px] text-gold border border-gold-dim">
                LAST UNITS — {totalStock} LEFT
              </span>
            )}
          </div>
          {!soldOut && totalStock > 0 && (
            <div className="mt-5 border-t border-line pt-4 text-center">
              <p className="text-mono text-[9px] text-mute uppercase tracking-widest">
                HOVER TO ZOOM · SINGLE-BATCH PIECE
              </p>
            </div>
          )}
        </div>

        {/* ── purchase column */}
        <div className="max-w-[440px]">
          <p className="label-xs text-mute mb-3">
            {soldOut ? 'ARCHIVED' : product.is_new ? 'NEW — IN STOCK' : 'IN STOCK'}
          </p>
          <h1 className="h2-display mb-2">{product.name}</h1>
          <p className="text-mono text-[12px] text-ink mb-6">{String(product.code ?? '').toUpperCase()}</p>
          <p className="text-mono text-[20px] text-ink mb-8">{formatMoney(price, currency)}</p>

          {/* size selector */}
          {!soldOut && sizes.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="label-xs text-mute">SELECT SIZE</span>
                {lastUnits && <span className="label-xs text-mute">RUNNING LOW</span>}
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-4">
                {sizes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => s.stock > 0 && setSize(s.label)}
                    disabled={s.stock <= 0}
                    className={`border border-line py-4 text-mono text-[12px] font-medium transition-colors ${
                      s.stock <= 0
                        ? 'cursor-not-allowed text-mute/40 line-through'
                        : size === s.label
                          ? 'border-bone bg-bone text-ink'
                          : 'text-ink hover:border-ink hover:bg-ash'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {sizes.every((s) => s.stock <= 0) && (
                <p className="mt-3 text-mono text-[10px] text-mute uppercase tracking-[0.18em]">
                  ALL SIZES SOLD THROUGH.
                </p>
              )}
            </div>
          )}

          {/* add to bag */}
          {soldOut ? (
            <button disabled className="btn-primary w-full !opacity-30">
              SOLD OUT
            </button>
          ) : sizes.length === 0 ? (
            <button
              onClick={() => {
                setSize('ONE SIZE')
                // add immediately for one-size artifacts
                add({
                  productId: product.id ?? product._id,
                  size: 'ONE SIZE',
                  qty: 1,
                  price,
                  product: {
                    id: product.id ?? product._id,
                    code: product.code,
                    name: product.name,
                    image_url: product.image_url,
                    price_ngn: product.price_ngn,
                    price_gbp: product.price_gbp,
                  },
                })
                toast.success(`Added to bag — ${product.code}`)
              }}
              className="btn-primary w-full"
            >
              ADD TO BAG — {formatMoney(price, currency)}
            </button>
          ) : (
            <button onClick={addLine} disabled={!size} className="btn-primary w-full">
              {!size ? 'SELECT A SIZE' : `ADD TO BAG — ${formatMoney(price, currency)}`}
            </button>
          )}

          {selected && selected.stock > 0 && selected.stock <= 4 && (
            <p className="mt-3 flex items-center gap-2 text-mono text-[10px] text-gold uppercase tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              ONLY {selected.stock} REMAINING IN {selected.label}
            </p>
          )}

          {/* micro assurances */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-line py-4">
            {[
              ['BATCH', 'SINGLE RUN'],
              ['DISPATCH', '2–3 DAYS'],
              ['RETURNS', '7 DAYS'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="label-xs text-mute mb-1">{k}</p>
                <p className="text-mono text-[10px] text-ink">{v}</p>
              </div>
            ))}
          </div>

          {/* whatsapp */}
          <div className="mt-8">
            <WhatsAppButton
              variant="inline"
              message={`Hi JOURNEY, I'd like to ask about ${product.name} (${String(product.code ?? '').toUpperCase()}) — ${formatMoney(price, currency)}. Is it still available?`}
              label="Ask about this piece"
            />
          </div>

          {/* ai try-on */}
          <div className="mt-6">
            <button
              className="btn-gold w-full"
              onClick={() => toast.success('AI Try-On coming soon — upload your photo to see the fit.')}
            >
              <span>AI VIRTUAL TRY-ON</span>
              <span className="ml-2">→</span>
            </button>
            <p className="mt-2 text-mono text-[10px] text-mute uppercase tracking-[0.18em]">
              See it on you before you buy
            </p>
          </div>

          {/* accordion */}
          <div className="mt-8">
            {panes.map((pane) => (
              <div key={pane.id} className="border-b border-line">
                <button
                  onClick={() => setOpenPane(openPane === pane.id ? null : pane.id)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-mono text-[10px] text-ink">{pane.title}</span>
                  <ChevronDown
                    size={15}
                    strokeWidth={1.5}
                    className={`text-mute transition-transform duration-300 ${openPane === pane.id ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
                  style={{
                    gridTemplateRows: openPane === pane.id ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-[13px] leading-[1.75] text-ink/60">{pane.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

          {/* ── related */}
          {related.length > 0 && (
            <section className="mt-20 md:mt-28">
              <Reveal>
                <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
                  <h2 className="h2-display text-[clamp(1.3rem,2.6vw,2rem)]">Complete the batch</h2>
                  <Link to="/" className="label-xs text-mute hover:text-ink">VIEW ALL →</Link>
                </div>
              </Reveal>
              <ProductGrid products={related} />
            </section>
          )}

          {/* mobile sticky buy bar */}
          {!soldOut && sizes.length > 0 && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bone/96 backdrop-blur-md border-t border-line px-6 pb-8 pt-4">
              <div className="max-w-[1440px] mx-auto">
                <button onClick={addLine} disabled={!size} className="btn-primary w-full">
                  {!size ? 'SELECT A SIZE' : `ADD TO BAG — ${formatMoney(price, currency)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )
}
