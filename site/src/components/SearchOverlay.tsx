import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../lib/convex'
import { formatMoney, priceIn } from '../lib/money'
import { useCurrency } from '../contexts/CurrencyContext'
import type { Product } from './ProductCard'

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const { currency } = useCurrency()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 220)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    if (!products) return undefined
    if (query.trim() === '') return products.slice(0, 6) // suggested
    const q = query.trim().toLowerCase()
    return products.filter((p) =>
      `${p.code} ${p.name}`.toLowerCase().includes(q),
    )
  }, [products, query])

  if (!open) return null

  const go = (id: string | undefined) => {
    if (id) navigate(`/products/${id}`)
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[70] bg-void/50 backdrop-blur-sm transition-opacity duration-300 ${
        query ? '' : ''
      } animate-fade`}
      onClick={onClose}
    >
      <div
        className="bg-bone border-b border-line max-h-[78vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto max-w-[1000px] px-6 py-8">
          <div className="flex items-center gap-4 border-b border-line pb-4">
            <Search size={22} strokeWidth={1.5} className="text-mute shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose()
                if (e.key === 'Enter' && results?.length) {
                  go(results[0].id ?? results[0]._id)
                }
              }}
              placeholder={query === '' ? 'SEARCH THE ARCHIVE — CODES OR NAMES' : ''}
              className="h1-display flex-1 bg-transparent outline-none placeholder:text-ash text-ink uppercase font-medium min-w-0 text-[clamp(1.4rem,3.5vw,2.4rem)]"
              style={{ letterSpacing: '-0.03em' }}
            />
            <button onClick={onClose} aria-label="Close search" className="hover:opacity-60">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="py-6">
            <p className="text-mono text-[9px] text-mute mb-5">
              {query.trim() === ''
                ? 'SUGGESTED'
                : `${results?.length ?? 0} RESULT${results?.length === 1 ? '' : 'S'} FOR "${query.toUpperCase()}"`
              }
            </p>
            {results === undefined ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] skeleton" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="text-mono text-[10px] text-mute">NOTHING FOUND. TRY A CODE (E.G. TJ-04).</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {results.slice(0, 12).map((p) => (
                  <button
                    key={p.id ?? p._id}
                    onClick={() => go(p.id ?? p._id)}
                    className="group text-left"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-ash">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="img-cover hover-zoom" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-mono text-[10px] text-ink">{p.code}</p>
                    <p className="text-mono text-[9px] text-mute">
                      {formatMoney(priceIn(p, currency), currency)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {results && results.length > 0 && query.trim() === '' && (
            <button
              onClick={() => go(results[0].id ?? results[0]._id)}
              className="flex items-center gap-2 text-mono text-[10px] text-ink hover:opacity-60 transition-opacity"
            >
              OPEN FIRST SUGGESTION <ArrowRight size={13} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
