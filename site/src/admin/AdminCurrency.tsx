import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../lib/convex'
import type { Product } from '../components/ProductCard'

/** NGN <-> GBP pricing editor (bulk + per-product) */
export default function AdminCurrency() {
  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const upsert = useMutation(api.products.upsert as never)
  const [busy, setBusy] = useState<string | null>(null)
  const [rate, setRate] = useState(2000)

  if (products === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const saveOne = async (p: Product, price_gbp: number) => {
    const id = p.id ?? p._id!
    setBusy(id)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { product_sizes: _ps, ...rest } = p as any
      delete rest._creationTime
      await upsert({ product: { ...rest, id, price_gbp } } as never)
      toast.success(`${p.code} → £${price_gbp}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(null)
    }
  }

  const bulkFromRate = async () => {
    setBusy('bulk')
    try {
      for (const p of products) {
        const gbp = Math.max(1, Math.round((p.price_ngn ?? 0) / rate))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { product_sizes: _ps, ...rest } = p as any
        delete rest._creationTime
        await upsert({ product: { ...rest, id: p.id ?? p._id, price_gbp: gbp } } as never)
      }
      toast.success(`ALL PRODUCTS PRICED AT ₦${rate}/£`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bulk pricing failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">CURRENCY</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6 border border-line p-4 max-w-2xl">
        <span className="text-mono text-[9px] text-mute">BULK RATE</span>
        <span className="text-[11px]">₦</span>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-24 border border-line px-2 py-1.5 text-[12px] focus:border-ink outline-none"
        />
        <span className="text-[11px]">= £1</span>
        <button
          onClick={bulkFromRate}
          disabled={busy === 'bulk'}
          className="bg-ink text-bone px-4 py-2 text-mono text-[10px] hover:opacity-85 disabled:opacity-50"
        >
          {busy === 'bulk' ? 'APPLYING…' : 'APPLY TO ALL'}
        </button>
      </div>

      <div className="border border-line max-w-3xl">
        {products.map((p) => (
          <div key={p.id ?? p._id} className="flex items-center gap-4 px-3 py-2 border-b border-line last:border-b-0">
            <div className="w-16 text-mono text-[10px] text-ink">{p.code}</div>
            <div className="flex-1 min-w-0 truncate text-[11px]">{p.name}</div>
            <div className="text-mono text-[10px] text-mute">₦{p.price_ngn.toLocaleString()}</div>
            <div className="text-mono text-[10px]">{p.price_gbp ? `£${p.price_gbp}` : <span className="text-mute">—</span>}</div>
            <input
              type="number"
              placeholder="£"
              defaultValue={p.price_gbp ?? ''}
              onBlur={(e) => {
                const v = Number(e.target.value)
                if (v && v !== p.price_gbp) saveOne(p, v)
              }}
              className="w-20 border border-line px-2 py-1 text-[11px] focus:border-ink outline-none"
            />
            {busy === (p.id ?? p._id) ? <span className="text-mono text-[9px] text-mute">…</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
