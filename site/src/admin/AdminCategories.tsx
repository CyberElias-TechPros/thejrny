import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../lib/convex'

type Category = {
  id?: string
  _id?: string
  name: string
  sort_order: number
  product_count?: number
}

export default function AdminCategories() {
  const categories = useQuery(api.categories.list, {}) as unknown as Category[] | undefined
  const upsert = useMutation(api.categories.upsert as never)
  const removeFn = useMutation(api.categories.remove as never)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  if (categories === undefined) return <p className="text-mono text-[10px] text-mute">LOADING…</p>

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await upsert(
        { category: { name: name.trim(), sort_order: categories.length + 1 } } as never,
      )
      toast.success(`CATEGORY "${name.toUpperCase()}" ADDED`)
      setName('')
      window.location.reload() // simplest way to refresh sort_order snapshot
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Add failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">CATEGORIES ({categories.length})</h1>
      <p className="text-[10px] text-mute mb-6">
        Tags drive nav ordering. Products tagged NEW appear in the storefront feed.
      </p>

      <div className="border border-line max-w-xl mb-6">
        {categories.map((c) => (
          <div key={c.id ?? c._id} className="flex items-center gap-4 px-3 py-2.5 border-b border-line last:border-b-0">
            <div className="w-8 text-mono text-[10px] text-mute">{c.sort_order}</div>
            <div className="flex-1 text-[11px]">{c.name}</div>
            <div className="text-mono text-[9px] text-mute">{c.product_count ?? 0} products</div>
            {c.name === 'NEW' ? (
              <span className="text-mono text-[8px] border border-line px-1">FEED</span>
            ) : (
              <button
                onClick={async () => {
                  if (!confirm(`Remove category "${c.name}"?`)) return
                  try {
                    await removeFn({ id: c.id ?? c._id } as never)
                    toast.success('REMOVED')
                    window.location.reload()
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Remove failed')
                  }
                }}
                className="text-mono text-[9px] text-mute hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={add} className="flex gap-2 max-w-xl">
        <input
          placeholder="CATEGORY NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-line px-3 py-2 text-[12px] focus:border-ink outline-none"
        />
        <button disabled={busy} className="bg-ink text-bone px-4 py-2 text-mono text-[10px] hover:opacity-85 disabled:opacity-50">
          + ADD
        </button>
      </form>
    </div>
  )
}
