import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../lib/convex'
import type { Product } from '../components/ProductCard'

/** Manage the NEW feed ordering: which products are tagged NEW and in what order */
export default function AdminHomepage() {
  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const upsert = useMutation(api.products.upsert as never)

  if (products === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const fresh = [...products.filter((p) => p.is_new)].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
  const rest = [...products.filter((p) => !p.is_new)].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )

  const move = async (p: Product, dir: -1 | 1) => {
    const list = fresh
    const i = list.findIndex((x) => (x.id ?? x._id) === (p.id ?? p._id))
    const j = i + dir
    if (i < 0 || j < 0 || j >= list.length) return
    const a = list[i]
    const b = list[j]
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const strip = (x: any) => {
      const { product_sizes: _ps, _creationTime: _ct, ...rest } = x
        return rest
      }
      await upsert({ product: { ...strip(a), id: a.id ?? a._id, sort_order: b.sort_order ?? j } } as never)
      await upsert({ product: { ...strip(b), id: b.id ?? b._id, sort_order: a.sort_order ?? i } } as never)
      toast.success('FEED ORDER UPDATED')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Swap failed')
    }
  }

  const toggleNew = async (p: Product) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const strip = (x: any) => {
        const { product_sizes: _ps, _creationTime: _ct, ...rest } = x
        return rest
      }
      await upsert({ product: { ...strip(p), id: p.id ?? p._id, is_new: !p.is_new } } as never)
      toast.success(p.is_new ? `${p.code} REMOVED FROM NEW` : `${p.code} TAGGED NEW`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">HOMEPAGE FEED</h1>
      <p className="text-[10px] text-mute mb-6">
        Products tagged NEW appear in the storefront feed in the order shown below.
      </p>

      <p className="text-mono text-[9px] text-mute mb-2">IN FEED ({fresh.length})</p>
      <div className="border border-line max-w-2xl mb-8">
        {fresh.map((p, i) => (
          <div key={p.id ?? p._id} className="flex items-center gap-4 px-3 py-2 border-b border-line last:border-b-0">
            <div className="w-6 text-mono text-[10px] text-mute">{i + 1}</div>
            <div className="w-16 text-mono text-[10px] text-ink">{p.code}</div>
            <div className="flex-1 min-w-0 truncate text-[11px]">{p.name}</div>
            <button onClick={() => move(p, -1)} className="text-mono text-[10px] text-mute hover:text-ink">↑</button>
            <button onClick={() => move(p, 1)} className="text-mono text-[10px] text-mute hover:text-ink">↓</button>
            <button onClick={() => toggleNew(p)} className="text-mono text-[9px] text-mute hover:text-ink">REMOVE</button>
          </div>
        ))}
      </div>

      <p className="text-mono text-[9px] text-mute mb-2">NOT IN FEED ({rest.length})</p>
      <div className="border border-line max-w-2xl">
        {rest.map((p) => (
          <div key={p.id ?? p._id} className="flex items-center gap-4 px-3 py-2 border-b border-line last:border-b-0">
            <div className="w-16 text-mono text-[10px] text-ink">{p.code}</div>
            <div className="flex-1 min-w-0 truncate text-[11px]">{p.name}</div>
            <button onClick={() => toggleNew(p)} className="text-mono text-[9px] text-mute hover:text-ink">
              + TAG NEW
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
