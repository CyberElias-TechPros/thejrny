import { useQuery } from 'convex/react'
import { api } from '../lib/convex'
import { formatMoney } from '../lib/money'

// Customers are derived from orders (the backend has no direct customers fn exposed)
type Order = {
  id: string
  customer_name?: string
  customer_email?: string
  total?: number
  currency?: string
  created_at?: string
  status?: string
}

export default function AdminCustomers() {
  const orders = useQuery(api.orders.list, {}) as unknown as Order[] | undefined

  if (orders === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const byEmail = new Map<string, { name: string; email: string; orders: Order[]; total: number }>()
  for (const o of orders) {
    if (!o.customer_email) continue
    const rec = byEmail.get(o.customer_email) ?? {
      name: o.customer_name ?? '',
      email: o.customer_email,
      orders: [],
      total: 0,
    }
    rec.name = rec.name || (o.customer_name ?? '')
    rec.orders.push(o)
    rec.total += o.total ?? 0
    byEmail.set(o.customer_email, rec)
  }
  const customers = [...byEmail.values()].sort((a, b) => b.total - a.total)

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">CUSTOMERS ({customers.length})</h1>
      <p className="text-[10px] text-mute mb-6">Derived from orders — repeat buyers on top.</p>
      {customers.length === 0 ? (
        <p className="text-mono text-[10px] text-mute">No customers yet.</p>
      ) : (
        <div className="border border-line">
          {customers.map((c) => (
            <div key={c.email} className="flex items-center gap-4 px-3 py-2.5 border-b border-line last:border-b-0">
              <div className="w-8 text-mono text-[10px] text-mute">{c.orders.length}×</div>
              <div className="flex-1 min-w-0 text-[11px] truncate">
                {c.name || '—'} <span className="text-mute">· {c.email}</span>
              </div>
              <div className="text-mono text-[10px] text-ink shrink-0">
                {formatMoney(c.total, 'NGN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
