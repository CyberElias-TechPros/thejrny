import { useQuery } from 'convex/react'
import { api } from '../lib/convex'
import { formatMoney } from '../lib/money'

type Order = { id: string; total?: number; currency?: string; status?: string; created_at?: string }

export default function AdminAnalytics() {
  const orders = useQuery(api.orders.list, {}) as unknown as Order[] | undefined

  if (orders === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const paid = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status ?? ''))
  const revenue = paid.reduce((s, o) => s + (o.total ?? 0), 0)
  const byStatus = orders.reduce<Record<string, number>>((m, o) => {
    const k = o.status ?? 'PENDING'
    m[k] = (m[k] ?? 0) + 1
    return m
  }, {})

  // last 14 days
  const days: { day: string; count: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    days.push({ day: d.slice(5), count: 0 })
  }
  for (const o of orders) {
    const d = (o.created_at ?? '').slice(5, 10)
    const hit = days.find((x) => x.day === d)
    if (hit) hit.count++
  }
  const max = Math.max(1, ...days.map((d) => d.count))

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-6">ANALYTICS</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl">
        <Stat label="TOTAL ORDERS" value={orders.length} />
        <Stat label="PAID ORDERS" value={paid.length} />
        <Stat label="REVENUE (NGN)" value={formatMoney(revenue, 'NGN')} />
        <Stat
          label="AVG ORDER"
          value={formatMoney(paid.length ? Math.round(revenue / paid.length) : 0, 'NGN')}
        />
      </div>

      <p className="text-mono text-[9px] text-mute mb-2">ORDERS — LAST 14 DAYS</p>
      <div className="flex items-end gap-1 h-24 max-w-2xl border-b border-line pb-1">
        {days.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-ash"
              style={{ height: `${(d.count / max) * 80}px`, minHeight: d.count ? '3px' : '0' }}
            />
            <span className="text-[7px] text-mute">{d.day}</span>
          </div>
        ))}
      </div>

      <p className="text-mono text-[9px] text-mute mt-8 mb-2">BY STATUS</p>
      <div className="flex flex-wrap gap-2 max-w-2xl">
        {Object.entries(byStatus).map(([k, v]) => (
          <span key={k} className="text-mono text-[9px] border border-line px-2 py-1">
            {k}: {v}
          </span>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-line p-4">
      <p className="text-mono text-[9px] text-mute mb-1">{label}</p>
      <p className="text-mono text-[18px] text-ink">{value}</p>
    </div>
  )
}
