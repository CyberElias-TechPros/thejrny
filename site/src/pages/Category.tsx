import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../lib/convex'
import ProductGrid from '../components/ProductGrid'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import type { Product } from '../components/ProductCard'

type Sort = 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'NEWEST', label: 'Newest' },
  { value: 'PRICE_ASC', label: 'Price ↑' },
  { value: 'PRICE_DESC', label: 'Price ↓' },
]

/** Category page: slug like /mens → category row by slug name match */
export default function Category({ slug }: { slug: string }) {
  const name = slug.replace(/-/g, ' ')
  const [sort, setSort] = useState<Sort>('NEWEST')

  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const categories = useQuery(api.categories.list, {}) as unknown as
    | { id?: string; _id?: string; name: string }[]
    | undefined

  const cat = categories?.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug || c.name.toLowerCase() === name,
  )
  const catId = cat ? (cat.id ?? cat._id) : null

  const items = useMemo(() => {
    const base = catId
      ? (products ?? []).filter((p) => (p as any).categories?.includes(catId))
      : []
    const sorted = [...base]
    if (sort === 'NEWEST') {
      sorted.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
    } else if (sort === 'PRICE_ASC') {
      sorted.sort((a, b) => price_ngn(a) - price_ngn(b))
    } else if (sort === 'PRICE_DESC') {
      sorted.sort((a, b) => price_ngn(b) - price_ngn(a))
    }
    return sorted
  }, [products, catId, sort])

  useEffect(() => {
    if (cat) {
      document.title = `${cat.name.toUpperCase()} — JOURNEY`
    }
  }, [cat])

  if (products === undefined || categories === undefined) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <div className="mb-10 h-16 w-64 skeleton" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] skeleton" />
              <div className="mt-3 h-2.5 w-1/3 skeleton" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const title = cat?.name?.toUpperCase() ?? slug.toUpperCase()

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      {/* page header */}
      <Reveal>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h1 className="h2-display">{title}</h1>
          <span className="label-xs text-mute">
            {items.length} {items.length === 1 ? 'ARTIFACT' : 'ARTIFACTS'}
          </span>
        </div>
        <div className="mt-4 mb-10 flex items-center justify-between border-b border-line pb-5">
          <nav className="flex items-center gap-2 text-mono text-[9px] text-mute">
            <Link to="/" className="hover:text-ink">HOME</Link>
            <span>/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="label-xs text-mute hidden sm:inline">SORT</span>
            <div className="flex border border-line">
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-1.5 text-mono text-[9px] transition-colors ${
                    sort === s.value
                      ? 'bg-bone text-ink'
                      : 'text-mute hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-mono text-[10px] text-mute mb-6">NOTHING IN THIS BATCH.</p>
          <Link to="/" className="btn-ghost">VIEW EVERYTHING</Link>
          <WhatsAppButton
            variant="inline"
            message={`Hi JOURNEY, do you have anything coming in the ${title} category?`}
            label="Ask about this category"
            className="mt-4 inline-block"
          />
        </div>
      ) : (
        <>
          <ProductGrid products={items} />
          <div className="mt-14 border-t border-line pt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="label-xs text-mute">Still looking?</p>
            <WhatsAppButton
              variant="inline"
              message={`Hi JOURNEY, I'm browsing the ${title} category and need help choosing a piece.`}
              label="Chat on WhatsApp"
            />
          </div>
        </>
      )}
    </div>
  )
}

function price_ngn(p: Product) {
  return p.price_ngn ?? 0
}
