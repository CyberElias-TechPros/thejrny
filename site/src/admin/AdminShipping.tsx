import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../lib/convex'
import { formatMoney } from '../lib/money'

type ShipMethod = {
  id?: string
  _id?: string
  name: string
  region: string
  eta: string
  price_ngn: number
  active: boolean
}

export default function AdminShipping() {
  const all = useQuery(api.shipping.list, {}) as unknown as ShipMethod[] | undefined
  const upsert = useMutation(api.shipping.upsert as never)
  const removeFn = useMutation(api.shipping.remove as never)

  const [editing, setEditing] = useState<Partial<ShipMethod> | null>(null)
  const [busy, setBusy] = useState(false)

  if (all === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    try {
      await upsert({
        shipping: {
          ...(editing.id ?? editing._id ? { id: editing.id ?? editing._id } : {}),
          name: editing.name ?? '',
          region: editing.region ?? 'NG',
          eta: editing.eta ?? '',
          price_ngn: Number(editing.price_ngn) || 0,
          active: editing.active ?? true,
        },
      } as never)
      toast.success('SHIPPING SAVED')
      setEditing(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="animate-fade">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-mono text-[12px] text-ink">SHIPPING ({all.length})</h1>
        <button
          onClick={() => setEditing({ name: '', region: 'NG', eta: '', price_ngn: 0, active: true })}
          className="bg-ink text-bone px-4 py-2 text-mono text-[10px] hover:opacity-85"
        >
          + NEW METHOD
        </button>
      </div>

      <div className="border border-line mb-6">
        {all.map((s) => (
          <div key={s.id ?? s._id} className="flex items-center gap-4 px-3 py-2.5 border-b border-line last:border-b-0">
            <div className="flex-1 min-w-0 text-[11px] truncate">{s.name}</div>
            <div className="text-mono text-[9px] text-mute w-10">{s.region}</div>
            <div className="text-[10px] text-mute w-24 truncate">{s.eta}</div>
            <div className="text-mono text-[10px] text-ink w-24">{formatMoney(s.price_ngn, 'NGN')}</div>
            <span className={`text-mono text-[8px] border px-1 ${s.active ? 'border-ink' : 'border-line text-mute'}`}>
              {s.active ? 'ACTIVE' : 'OFF'}
            </span>
            <button onClick={() => setEditing(s)} className="text-mono text-[9px] text-mute hover:text-ink">EDIT</button>
            <button
              onClick={async () => {
                if (!confirm(`Remove "${s.name}"?`)) return
                try {
                  await removeFn({ id: s.id ?? s._id } as never)
                  toast.success('REMOVED')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Remove failed')
                }
              }}
              className="text-mono text-[9px] text-mute hover:text-ink"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={save} className="border border-line p-5 max-w-md space-y-3 animate-float">
          <h2 className="text-mono text-[10px] text-ink">
            {editing.id ?? editing._id ? 'EDIT METHOD' : 'NEW METHOD'}
          </h2>
          {(['name', 'region', 'eta'] as const).map((k) => (
            <div key={k}>
              <p className="text-mono text-[9px] text-mute">{k.toUpperCase()}</p>
              <input
                required
                className="w-full border border-line bg-bone px-3 py-2 text-[12px] focus:border-ink outline-none"
                value={(editing[k] as string) ?? ''}
                onChange={(e) => setEditing({ ...editing, [k]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <p className="text-mono text-[9px] text-mute">PRICE NGN (0 = PICKUP)</p>
            <input
              type="number"
              className="w-full border border-line bg-bone px-3 py-2 text-[12px] focus:border-ink outline-none"
              value={editing.price_ngn ?? 0}
              onChange={(e) => setEditing({ ...editing, price_ngn: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-[11px] cursor-pointer">
            <input
              type="checkbox"
              checked={editing.active ?? false}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
            />
            <span className="text-mono text-[9px]">ACTIVE — shows at checkout</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button disabled={busy} className="bg-ink text-bone px-6 py-2.5 text-mono text-[10px] hover:opacity-85 disabled:opacity-50">
              {busy ? '…' : 'SAVE'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="text-mono text-[10px] text-mute hover:text-ink">
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
