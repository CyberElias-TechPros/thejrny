import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../lib/convex'
import { formatMoney } from '../lib/money'

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-mute',
  PAID: 'text-ink',
  PROCESSING: 'text-ink',
  SHIPPED: 'text-ink',
  DELIVERED: 'text-ink',
  CANCELLED: 'text-mute line-through',
}

type Order = {
  id: string
  customer_name?: string
  customer_email?: string
  region?: string
  currency?: string
  total?: number
  status?: string
  payment_method?: string
  courier?: string
  created_at?: string
  items?: { code?: string; size?: string; qty?: number; price?: number }[]
}

export default function AdminOrders() {
  const orders = useQuery(api.orders.list, {}) as unknown as Order[] | undefined
  const updateStatus = useMutation(api.orders.updateStatus as never)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (orders === undefined) {
    return (
      <div className="animate-fade">
        <h1 className="text-mono text-[12px] text-ink mb-8">ORDERS</h1>
        <p className="text-mono text-[10px] text-mute">LOADING…</p>
      </div>
    )
  }

  const setStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status } as never)
      toast.success(`ORDER ${id} → ${status}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">ORDERS ({orders.length})</h1>
      <p className="text-[10px] text-mute mb-6">
        Status changes notify the customer by email (send-status-email is still live).
      </p>

      {orders.length === 0 ? (
        <p className="text-mono text-[10px] text-mute">No orders yet — checkout to create one.</p>
      ) : (
        <div className="border border-line">
          {[...orders]
            .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
            .map((o) => (
              <div key={o.id} className="border-b border-line last:border-b-0">
                <div className="flex items-center gap-4 px-3 py-2.5">
                  <button
                    className="w-20 text-mono text-[10px] text-ink text-left shrink-0"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    {o.id}
                  </button>
                  <div className="flex-1 min-w-0 truncate text-[11px]">
                    {o.customer_name} <span className="text-mute">· {o.customer_email}</span>
                  </div>
                  <div className="text-mono text-[10px] text-mute hidden md:block w-24 text-right shrink-0">
                    {formatMoney(o.total ?? 0, (o.currency as 'NGN' | 'GBP') ?? 'NGN')}
                  </div>
                  <div className="hidden md:block text-mono text-[9px] text-mute w-16 text-center shrink-0">
                    {o.payment_method?.replace('_', ' ')}
                  </div>
                  <select
                    value={o.status ?? 'PENDING'}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className={`text-mono text-[9px] border border-line px-2 py-1 bg-bone outline-none ${
                      STATUS_COLOR[o.status ?? 'PENDING']
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {expanded === o.id && (
                  <div className="px-3 pb-4 text-[10px] text-mute space-y-1 animate-fade">
                    {(o.items ?? []).map((it, i) => (
                      <div key={i}>
                        · {it.code ?? it.size ?? 'item'} × {it.qty} — {formatMoney((it.price ?? 0) * (it.qty ?? 1), 'NGN')}
                      </div>
                    ))}
                    {o.courier ? <div>· COURIER: {o.courier}</div> : null}
                    {o.region ? <div>· REGION: {o.region}</div> : null}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
