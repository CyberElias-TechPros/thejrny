import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { api } from '../lib/convex'
import type { Product } from '../components/ProductCard'

type Size = { label: string; stock: number; sku?: string }
type Tone = { color_name?: string; color_hex: string }

const EMPTY = {
  id: undefined as string | undefined,
  name: '',
  code: '',
  price_ngn: 0,
  price_gbp: 0,
  image_url: '',
  description: '',
  material: '',
  is_new: true,
  sort_order: 999,
  categories: [] as string[],
  sizes: [{ label: 'ONE SIZE', stock: 0 }] as Size[],
  tones: [] as Tone[],
}

/* ============================== editor modal ============================== */
function ProductEditor({
  initial,
  categories,
  onClose,
}: {
  initial: typeof EMPTY
  categories: { id?: string; _id?: string; name: string }[]
  onClose: () => void
}) {
  const upsert = useMutation(api.products.upsert as never)
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await upsert({
        product: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          code: form.code,
          price_ngn: Number(form.price_ngn) || 0,
          price_gbp: Number(form.price_gbp) || 0,
          image_url: form.image_url || undefined,
          description: form.description || undefined,
          material: form.material || undefined,
          is_new: form.is_new,
          sort_order: Number(form.sort_order) || 0,
          categories: form.categories,
          tones: form.tones.map((t) => ({ color_hex: t.color_hex, ...(t.color_name ? { color_name: t.color_name } : {}) })),
        },
        sizes: form.sizes.map((s) => ({ label: s.label, stock: Number(s.stock) || 0, sku: `${form.code}-${s.label}` })),
      } as never)
      toast.success(form.id ? 'PRODUCT UPDATED' : 'PRODUCT CREATED')
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upsert failed')
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border border-line bg-bone px-3 py-2 text-[12px] text-ink focus:border-ink outline-none'
  const label = 'text-mono text-[9px] text-mute'

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 flex items-start justify-center overflow-y-auto p-4">
      <form
        onSubmit={submit}
        className="bg-bone border border-line w-full max-w-2xl p-6 space-y-5 animate-float"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-mono text-[11px] text-ink">
            {form.id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
          </h2>
          <button type="button" onClick={onClose} className="text-mute hover:text-ink text-[12px]">
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className={label}>CODE</p>
            <input required className={input} value={form.code} onChange={(e) => set('code', e.target.value)} />
          </div>
          <div>
            <p className={label}>NAME</p>
            <input required className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <p className={label}>PRICE NGN</p>
            <input type="number" className={input} value={form.price_ngn} onChange={(e) => set('price_ngn', Number(e.target.value))} />
          </div>
          <div>
            <p className={label}>PRICE GBP</p>
            <input type="number" className={input} value={form.price_gbp} onChange={(e) => set('price_gbp', Number(e.target.value))} />
          </div>
        </div>

        <div>
          <p className={label}>IMAGE URL</p>
          <input className={input} value={form.image_url} onChange={(e) => set('image_url', e.target.value)} />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className={label}>DESCRIPTION</p>
            <textarea rows={2} className={input} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <p className={label}>MATERIAL</p>
            <input className={input} value={form.material} onChange={(e) => set('material', e.target.value)} />
          </div>
        </div>

        <div>
          <p className={label}>CATEGORIES</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const id = c.id ?? c._id ?? ''
              const active = form.categories.includes(id)
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() =>
                    set(
                      'categories',
                      active ? form.categories.filter((x) => x !== id) : [...form.categories, id],
                    )
                  }
                  className={`text-mono text-[9px] px-2 py-1 border transition ${
                    active ? 'border-ink text-ink' : 'border-line text-mute hover:border-ink'
                  }`}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className={label}>SIZES (label / stock)</p>
            <button
              type="button"
              className="text-mono text-[9px] text-mute hover:text-ink"
              onClick={() => set('sizes', [...form.sizes, { label: '', stock: 0 }])}
            >
              + ADD SIZE
            </button>
          </div>
          <div className="space-y-2">
            {form.sizes.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={input}
                  value={s.label}
                  onChange={(e) => {
                    const sizes = [...form.sizes]
                    sizes[i] = { ...s, label: e.target.value }
                    set('sizes', sizes)
                  }}
                />
                <input
                  type="number"
                  className={input}
                  value={s.stock}
                  onChange={(e) => {
                    const sizes = [...form.sizes]
                    sizes[i] = { ...s, stock: Number(e.target.value) }
                    set('sizes', sizes)
                  }}
                />
                <button
                  type="button"
                  className="text-mute hover:text-ink px-1"
                  onClick={() => set('sizes', form.sizes.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className={label}>TONES (hex colours)</p>
            <button
              type="button"
              className="text-mono text-[9px] text-mute hover:text-ink"
              onClick={() => set('tones', [...form.tones, { color_hex: '#0a0a0a' }])}
            >
              + ADD TONE
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tones.map((t, i) => (
              <div key={i} className="flex items-center gap-1 border border-line px-2 py-1">
                <input
                  type="color"
                  value={t.color_hex}
                  onChange={(e) => {
                    const tones = [...form.tones]
                    tones[i] = { ...t, color_hex: e.target.value }
                    set('tones', tones)
                  }}
                  className="h-6 w-8"
                />
                <span className="text-mono text-[9px]">{t.color_hex}</span>
                <button
                  type="button"
                  className="text-mute hover:text-ink"
                  onClick={() => set('tones', form.tones.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <label className="flex items-center gap-2 text-[11px] cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => set('is_new', e.target.checked)}
            />
            <span className="text-mono text-[9px]">TAGGED NEW</span>
          </label>
          <div className="flex items-center gap-2">
            <span className={label}>SORT</span>
            <input
              type="number"
              className="w-20 border border-line px-2 py-1 text-[11px]"
              value={form.sort_order}
              onChange={(e) => set('sort_order', Number(e.target.value))}
            />
          </div>
          <button
            disabled={busy}
            className="bg-ink text-bone px-6 py-2.5 text-mono text-[10px] hover:opacity-85 disabled:opacity-50"
          >
            {busy ? '…' : 'SAVE'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ================================ page ==================================== */
export default function AdminProducts() {
  const products = useQuery(api.products.list, {}) as unknown as Product[] | undefined
  const categories = useQuery(api.categories.list, {}) as unknown as
    | { id?: string; _id?: string; name: string }[]
    | undefined
  const remove = useMutation(api.products.remove as never)

  const [editor, setEditor] = useState<typeof EMPTY | null>(null)
  const [query, setQuery] = useState('')

  if (products === undefined || categories === undefined) {
    return <p className="text-mono text-[10px] text-mute">LOADING…</p>
  }

  const catName = (p: Product) => {
    const ids = (p as unknown as { categories?: string[] }).categories ?? []
    return ids
      .map((id) => categories.find((c) => (c.id ?? c._id) === id)?.name)
      .filter(Boolean)
      .join(' · ')
  }

  const filtered = products.filter((p) =>
    `${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase()),
  )

  const downloadTemplate = () => {
    const rows = filtered.map((p) => ({
      code: p.code,
      name: p.name,
      price_ngn: p.price_ngn,
      price_gbp: p.price_gbp ?? '',
      image_url: p.image_url ?? '',
      categories: catName(p),
    }))
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ code: '', name: '', price_ngn: '', price_gbp: '', image_url: '', categories: '' }])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'products')
    XLSX.writeFile(wb, 'journey-products-export.xlsx')
    toast.success('XLSX exported')
  }

  const removeProduct = async (id: string) => {
    if (!confirm('Remove this product? This cannot be undone.')) return
    try {
      await remove({ id } as never)
      toast.success('PRODUCT REMOVED')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Remove failed')
    }
  }

  const editProduct = (p: Product) => {
    const sizes = (p.product_sizes ?? []).map((s: { label: string; stock: number }) => ({ label: s.label, stock: s.stock }))
    const tones = (p as unknown as { tones?: string[] }).tones ?? []
    setEditor({
      ...EMPTY,
      id: p.id ?? p._id,
      code: p.code,
      name: p.name,
      price_ngn: p.price_ngn,
      price_gbp: p.price_gbp ?? 0,
      image_url: p.image_url ?? '',
      is_new: !!p.is_new,
      sort_order: p.sort_order ?? 999,
      categories: [...((p as unknown as { categories?: string[] }).categories ?? [])],
      sizes: sizes.length ? sizes : [{ label: 'ONE SIZE', stock: 0 }],
      tones: tones.map((t) => ({ color_hex: t })),
    })
  }

  return (
    <div className="animate-fade">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-mono text-[12px] text-ink">PRODUCTS ({products.length})</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="SEARCH CODE / NAME"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-line px-3 py-2 text-[11px] w-48 focus:border-ink outline-none"
          />
          <button
            onClick={downloadTemplate}
            className="border border-line px-3 py-2 text-mono text-[9px] text-mute hover:text-ink hover:border-ink transition"
          >
            EXPORT XLSX
          </button>
          <button
            onClick={() => setEditor(EMPTY)}
            className="bg-ink text-bone px-4 py-2 text-mono text-[10px] hover:opacity-85"
          >
            + NEW PRODUCT
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-mono text-[10px] text-mute">No products. Click + NEW PRODUCT.</p>
      ) : (
        <div className="border border-line">
          {[...filtered]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((p) => {
              const stock = (p.product_sizes ?? []).reduce((s, z) => s + (z.stock ?? 0), 0)
              return (
                <div key={p.id ?? p._id} className="flex items-center gap-4 border-b border-line px-3 py-2 last:border-b-0">
                  <div className="h-[42px] w-[34px] bg-ash overflow-hidden shrink-0">
                    {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="w-20 text-mono text-[10px] text-ink shrink-0">{p.code}</div>
                  <div className="flex-1 min-w-0 truncate text-[11px]">{p.name}</div>
                  <div className="hidden md:block text-[10px] text-mute w-32 truncate">{catName(p)}</div>
                  <div className="text-mono text-[10px] text-mute shrink-0">₦{p.price_ngn.toLocaleString()}</div>
                  <div className="text-mono text-[10px] w-16 text-right shrink-0">
                    {stock > 0 ? `${stock} st` : <span className="text-line" style={{ color: 'oklch(45% 0 0)' }}>S/O</span>}
                  </div>
                  {p.is_new ? <span className="text-mono text-[8px] border border-line px-1">NEW</span> : <span className="w-[38px]" />}
                  <button
                    onClick={() => editProduct(p)}
                    className="text-mono text-[9px] text-mute hover:text-ink shrink-0"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => removeProduct(p.id ?? p._id!)}
                    className="text-mono text-[9px] text-mute hover:text-ink shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
        </div>
      )}

      {editor && (
        <ProductEditor
          initial={editor}
          categories={categories}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  )
}
