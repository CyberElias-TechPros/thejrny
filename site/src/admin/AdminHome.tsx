import { useQuery } from 'convex/react'
import { Link } from 'react-router-dom'
import { api } from '../lib/convex'
import type { Product } from '../components/ProductCard'

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-line p-5">
      <p className="text-mono text-[9px] text-mute mb-2">{label}</p>
      <p className="text-mono text-[22px] text-ink">{value}</p>
    </div>
  )
}

export default function AdminHome() {
  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const categories = useQuery(api.categories.list, {}) as unknown as
    | { name: string; product_count?: number }[]
    | undefined

  const loading = products === undefined || categories === undefined
  const stock = (products ?? []).reduce(
    (s, p) => s + (p.product_sizes ?? []).reduce((t, z) => t + (z.stock ?? 0), 0),
    0,
  )

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-8">DASHBOARD</h1>
      {loading ? (
        <p className="text-mono text-[10px] text-mute">LOADING…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <Stat label="PRODUCTS" value={products!.length} />
            <Stat label="UNITS IN STOCK" value={stock} />
            <Stat label="CATEGORIES" value={categories!.length} />
            <Stat label="NEW TAGGED" value={products!.filter((p) => p.is_new).length} />
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-mono text-[10px] text-mute mb-3">RECENT PRODUCTS</p>
              <div className="space-y-1">
                {[...(products ?? [])]
                  .sort((a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0))
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p.id ?? p._id} className="border-b border-line py-2 text-[11px]">
                      <span className="text-mono text-[10px] text-ink mr-3">{p.code}</span>
                      <span className="text-mute">{p.name}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-mono text-[10px] text-mute mb-3">JUMP TO</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['/admin/products', 'MANAGE PRODUCTS'],
                  ['/admin/orders', 'ORDERS'],
                  ['/admin/shipping', 'SHIPPING'],
                  ['/admin/currency', 'CURRENCY'],
                ].map(([to, label]) => (
                  <Link
                    key={to}
                    to={to}
                    className="border border-line px-3 py-3 text-mono text-[9px] text-mute hover:text-ink hover:border-ink transition"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
