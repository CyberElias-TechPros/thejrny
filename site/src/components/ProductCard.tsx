import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'
import { formatMoney, priceIn } from '../lib/money'

export type Product = {
  id?: string
  _id?: string
  name: string
  code: string
  price_ngn: number
  price_gbp?: number
  image_url?: string
  description?: string
  material?: string
  is_new?: boolean
  sort_order?: number
  product_sizes?: { label: string; stock: number }[]
  tones?: string[]
}

export default function ProductCard({
  product,
  index = 0,
  reveal = true,
  large = false,
}: {
  product: Product
  index?: number
  /** stagger the entry animation */
  reveal?: boolean
  /** bigger editorial tile */
  large?: boolean
}) {
  const { currency } = useCurrency()
  const { add } = useCart()
  const id = product.id ?? product._id
  const sizes = product.product_sizes ?? []
  const totalStock = sizes.reduce((s, z) => s + (z.stock ?? 0), 0)
  const soldOut = totalStock <= 0
  const price = priceIn(product, currency)

  const quickAdd = (label: string) => {
    add({
      productId: id!,
      size: label,
      qty: 1,
      price,
      product: {
        id: id!,
        code: product.code,
        name: product.name,
        image_url: product.image_url,
        price_ngn: product.price_ngn,
        price_gbp: product.price_gbp,
      },
    })
    toast.success(`Added to bag — ${product.code} · ${label}`)
  }

  return (
    <Link
      to={`/products/${id}`}
      className={`group block ${reveal ? 'animate-rise' : ''}`}
      style={reveal ? { animationDelay: `${Math.min(index * 70, 560)}ms` } : undefined}
    >
      <div className={`card-surface ${large ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
        {product.image_url ? (
          <img
            alt={product.name}
            className="img-cover hover-zoom"
            loading="lazy"
            src={product.image_url}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-mono text-[9px] text-mute">{product.code}</span>
          </div>
        )}

        {/* status chips */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {soldOut ? (
            <span className="chip opacity-80">SOLD OUT</span>
          ) : product.is_new ? (
            <span className="chip">NEW</span>
          ) : totalStock <= 3 ? (
            <span className="chip" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
              LAST UNITS
            </span>
          ) : null}
        </div>

        {/* quick add shelf */}
        {!soldOut && (
          <div
            className="absolute inset-x-0 bottom-0 translate-y-[100%] bg-bone/96 backdrop-blur-sm border-t border-line transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0 max-md:translate-y-0"
          >
            <div className="px-4 py-3.5 hidden md:block">
              <p className="text-mono text-[8px] text-mute mb-2.5">QUICK ADD</p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.slice(0, 6).map((s) => (
                  <button
                    key={s.label}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (s.stock > 0) quickAdd(s.label)
                    }}
                    disabled={s.stock <= 0}
                    className={`border px-2.5 py-1.5 text-mono text-[8.5px] font-medium transition-colors ${
                      s.stock > 0
                        ? 'border-line text-ink hover:border-ink hover:bg-ink hover:text-bone'
                        : 'border-line text-mute line-through opacity-40'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                {sizes.length === 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      quickAdd('ONE SIZE')
                    }}
                    className="border border-line px-2.5 py-1.5 text-mono text-[8.5px] font-medium text-ink hover:border-ink hover:bg-ink hover:text-bone"
                  >
                    <Plus size={10} className="inline mr-1 -mt-0.5" /> ADD
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-mono text-[11px] text-ink leading-none">{product.code}</p>
          <p className="mt-2 font-display text-[17px] text-ink leading-tight group-hover:text-ink transition-colors">
            {product.name}
          </p>
        </div>
        <p className="text-mono text-[12px] text-ink shrink-0 leading-none mt-0.5">
          {formatMoney(price, currency)}
        </p>
      </div>
    </Link>
  )
}
