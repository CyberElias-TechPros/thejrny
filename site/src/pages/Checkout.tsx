import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { CheckCircle2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/convex'
import { useCart } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { formatMoney, newOrderRef, linePrice, priceIn } from '../lib/money'
import WhatsAppButton from '../components/WhatsAppButton'

type Shipping = {
  id?: string
  _id?: string
  name: string
  region: string
  eta: string
  price_ngn: number
}

async function verifyPayment(reference: string) {
  const r = await fetch(`/api/paystack-verify.php?reference=${encodeURIComponent(reference)}`)
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Payment verification failed')
  return j as { success: boolean; order_id?: string }
}

async function initPayment(args: {
  email: string
  amountNGN: number
  orderId: string
  metadata: Record<string, unknown>
}) {
  const r = await fetch('/api/paystack-init.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: args.email,
      amount_kobo: Math.round(args.amountNGN * 100),
      order_id: args.orderId,
      currency: 'NGN',
      metadata: args.metadata,
    }),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Payment initialization failed')
  return j as { authorization_url?: string; reference?: string; data?: { authorization_url: string; reference: string } }
}

export default function Checkout() {
  const { lines, clear } = useCart()
  const { currency } = useCurrency()
  const [search, setSearch] = useSearchParams()

  const [verifying, setVerifying] = useState(false)
  const [confirmed, setConfirmed] = useState<{ id: string; paid: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  const createOrder = useMutation(api.orders.create)
  const shipping = (useQuery(api.shipping.listActive, {}) ?? []) as Shipping[]

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    region: 'NG',
    courier: '',
    notes: '',
    paymentMethod: 'PAYSTACK',
  })
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  //  ?ref=XXXX  →  verify a redirect back from Paystack
  useEffect(() => {
    const ref = search.get('ref')
    if (!ref) return
    setSearch({}, { replace: true })
    setVerifying(true)
    verifyPayment(ref)
      .then((res) => {
        if (res.success) {
          clear()
          setConfirmed({ id: res.order_id ?? ref, paid: true })
          toast.success('Payment confirmed!')
        } else {
          toast.error('Payment could not be verified. Contact support.')
        }
      })
      .catch(() => toast.error('Payment verification failed.'))
      .finally(() => setVerifying(false))
  }, [])

  const courier = shipping.find((s) => (s.id ?? s._id) === form.courier) ?? shipping[0]
  const subtotal = lines.reduce((s, l) => s + linePrice(l, currency) * l.qty, 0)
  // Shipping fees are defined in NGN; in GBP terms show the NGN fee converted only for display
  const shippingNGN = form.region === 'UK' ? 0 : (courier?.price_ngn ?? 0)
  const shippingCost = currency === 'NGN' ? shippingNGN : Math.round(shippingNGN / 2000 * 100) / 100
  const total = subtotal + shippingCost
  // Paystack always settles in Naira
  const totalNGN = form.region === 'UK' ? total * 2000 : lines.reduce((s, l) => s + priceIn(l.product ?? { price_ngn: l.price }, 'NGN') * l.qty, 0) + shippingNGN

  // Pick the first courier once the list loads
  useEffect(() => {
    if (shipping.length > 0 && !form.courier) {
      set('courier', shipping[0].id ?? shipping[0]._id ?? '')
    }
  }, [shipping.length])

  if (verifying) {
    return (
      <main className="mx-auto max-w-[640px] px-6 py-32 text-center animate-fade">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-ash">
          <span className="text-mono text-[10px] text-mute">···</span>
        </div>
        <p className="text-mono text-[11px] text-ink">VERIFYING YOUR PAYMENT — DON'T CLOSE THIS PAGE</p>
      </main>
    )
  }

  if (confirmed) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-24 md:py-32 text-center animate-fade">
        <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-full border border-line">
          <CheckCircle2 size={26} strokeWidth={1.25} className="text-live" />
        </div>
        <p className="label-xs text-mute mb-3">
          {confirmed.paid ? 'PAYMENT CONFIRMED' : 'ORDER RECEIVED'}
        </p>
        <h1 className="h2-display mb-6">{confirmed.id}</h1>
        <p className="mx-auto max-w-sm text-[13px] text-ink/60 leading-[1.75] mb-10">
          A confirmation email is on its way. Keep this reference — quote it in any
          message to us.
        </p>
        <Link to="/" className="btn-primary">CONTINUE</Link>
      </main>
    )
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-24 md:py-32 text-center">
        <p className="h2-display mb-3">Your bag is empty</p>
        <p className="text-mono text-[10px] text-mute mb-9">
          ADD AN ARTIFACT BEFORE CHECKING OUT.
        </p>
        <Link to="/" className="btn-primary">SHOP NEW</Link>
        <WhatsAppButton
          variant="inline"
          message="Hi JOURNEY, I'd like help placing an order."
          label="Chat on WhatsApp"
          className="mt-6 inline-block"
        />
      </main>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lines.length === 0) return
    setBusy(true)
    const orderRef = newOrderRef()
    try {
      await createOrder({
        order: {
          id: orderRef,
          customer_name: form.name,
          customer_email: form.email,
          region: form.region,
          currency,
          total,
          status: 'PENDING',
          payment_method: form.paymentMethod,
          courier: form.courier || undefined,
          shipping_address: form.address || undefined,
          notes: form.notes || undefined,
        },
        items: lines.map((l) => ({
          product_id: l.productId,
          code: l.product?.code,
          size: l.size,
          qty: l.qty,
          price: l.price,
        })),
      })

      if (form.paymentMethod === 'PAYSTACK' && form.region === 'NG') {
        const res = await initPayment({
          email: form.email,
          amountNGN: totalNGN,
          orderId: orderRef,
          metadata: { customer_name: form.name, phone: form.phone },
        })
        const url =
          res.authorization_url ?? res.data?.authorization_url
        const reference = res.reference ?? res.data?.reference
        if (reference) localStorage.setItem(`jrny-ref-${orderRef}`, reference)
        if (url) {
          window.location.href = url
          return
        }
        toast.error('Could not start payment. Use BANK TRANSFER or contact support.')
      }

      if (form.paymentMethod === 'PAYSTACK' && form.region === 'UK') {
        toast.info('UK orders are invoiced in GBP. We will email payment details.')
      } else if (form.paymentMethod === 'BANK_TRANSFER') {
        toast.success('Order received. Transfer details sent to your email.')
      }

      clear()
      setConfirmed({ id: orderRef, paid: false })
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Order failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 md:px-8 py-10 md:py-14 animate-fade">
      <header className="mb-10 flex items-end justify-between border-b border-ink pb-6">
        <h1 className="h2-display">Checkout</h1>
        <p className="flex items-center gap-2 label-xs text-mute">
          <Lock size={11} strokeWidth={1.5} /> SECURE ORDER
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[1fr_400px] lg:gap-16">
        {/* ───────── form */}
        <form className="space-y-12" onSubmit={submit}>
          {/* STEP 1 — contact */}
          <section>
            <p className="label-xs text-mute mb-6 flex items-center gap-3">
              <Step n="01" /> CONTACT
            </p>
            <div className="space-y-5">
              <div className="field-line-wrap">
                <input
                  required
                  placeholder="FULL NAME"
                  className="field-line"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <input
                required
                type="email"
                placeholder="EMAIL ADDRESS"
                className="field-line"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              <input
                placeholder="PHONE (OPTIONAL)"
                className="field-line"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </section>

          {/* STEP 2 — delivery */}
          <section>
            <p className="label-xs text-mute mb-6 flex items-center gap-3">
              <Step n="02" /> DELIVERY
            </p>
            <div className="space-y-5">
              <textarea
                required
                rows={3}
                placeholder="FULL SHIPPING ADDRESS"
                className="field-line resize-none"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
              />
              <div className="flex gap-2">
                {[
                  { v: 'NG', l: 'NIGERIA' },
                  { v: 'UK', l: 'UNITED KINGDOM' },
                ].map((r) => (
                  <button
                    key={r.v}
                    type="button"
                    onClick={() => set('region', r.v)}
                    className={`border px-5 py-2.5 text-mono text-[10px] transition-colors ${
                      form.region === r.v
                        ? 'border-bone bg-bone text-ink'
                        : 'border-line text-ink hover:border-ink'
                    }`}
                  >
                    {r.l}
                  </button>
                ))}
              </div>
              {form.region === 'NG' ? (
                <div className="space-y-2 pt-1">
                  {shipping.map((s) => {
                    const id = s.id ?? s._id ?? ''
                    const active = form.courier === id
                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition-colors ${
                          active ? 'border-ink bg-bone-2' : 'border-line hover:border-ink/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="courier"
                          className="sr-only"
                          checked={active}
                          onChange={() => set('courier', id)}
                        />
                        <div>
                          <p className="text-mono text-[11px] text-ink">{s.name}</p>
                          <p className="mt-1 text-mono text-[9px] text-mute">
                            {s.region} · {s.eta}
                          </p>
                        </div>
                        <p className="text-mono text-[11px] text-ink">
                          {s.price_ngn ? formatMoney(s.price_ngn, currency) : '—'}
                        </p>
                      </label>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </section>

          {/* STEP 3 — payment */}
          <section>
            <p className="label-xs text-mute mb-6 flex items-center gap-3">
              <Step n="03" /> PAYMENT
            </p>
            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${
                  form.paymentMethod === 'PAYSTACK' ? 'border-ink bg-bone-2' : 'border-line hover:border-ink/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === 'PAYSTACK'}
                  onChange={() => set('paymentMethod', 'PAYSTACK')}
                  className="sr-only"
                />
                <RadioDot active={form.paymentMethod === 'PAYSTACK'} />
                <div>
                  <p className="text-mono text-[11px] text-ink">CARD / USSD / BANK — PAYSTACK</p>
                  <p className="mt-1 text-mono text-[9px] text-mute">
                    INSTANT CONFIRMATION · SECURED BY PAYSTACK
                  </p>
                </div>
                <span className="ml-auto hidden gap-1 sm:flex">
                  {['VISA', 'MC', 'USSD'].map((m) => (
                    <span key={m} className="border border-line px-1.5 py-0.5 text-mono text-[8px] text-mute">
                      {m}
                    </span>
                  ))}
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${
                  form.paymentMethod === 'BANK_TRANSFER' ? 'border-ink bg-bone-2' : 'border-line hover:border-ink/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => set('paymentMethod', 'BANK_TRANSFER')}
                  className="sr-only"
                />
                <RadioDot active={form.paymentMethod === 'BANK_TRANSFER'} />
                <div>
                  <p className="text-mono text-[11px] text-ink">BANK TRANSFER</p>
                  <p className="mt-1 text-mono text-[9px] text-mute">
                    MANUAL TRANSFER — SHIPS AFTER CONFIRMATION
                  </p>
                </div>
              </label>
            </div>
            <textarea
              rows={2}
              placeholder="ORDER NOTES (OPTIONAL)"
              className="field-line mt-6 resize-none"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </section>

          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full"
          >
            {form.paymentMethod === 'PAYSTACK'
              ? `PAY · ${formatMoney(total, 'NGN')}`
              : `PLACE ORDER · ${formatMoney(total, currency)}`}
          </button>
          <p className="-mt-6 text-center text-mono text-[8px] text-mute">
            BY PLACING THIS ORDER YOU AGREE TO OUR SHIP & RETURNS POLICY
          </p>
        </form>

        {/* ───────── summary */}
        <aside className="h-fit border border-line bg-bone-2 p-6 md:sticky md:top-32">
          <p className="label-xs text-mute mb-5">ORDER SUMMARY</p>
          <div className="space-y-4 border-b border-line pb-5">
            {lines.map((l) => (
              <div key={`${l.productId}-${l.size}`} className="flex items-start gap-3.5">
                <div className="h-[76px] w-[58px] shrink-0 overflow-hidden bg-ash">
                  {l.product?.image_url && (
                    <img
                      alt={l.product.name}
                      className="h-full w-full object-cover"
                      src={l.product.image_url}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-mono text-[10px] text-ink">{l.product?.code}</p>
                  <p className="mt-1 text-mono text-[9px] text-mute">
                    SIZE {l.size} · QTY {l.qty}
                  </p>
                </div>
                <p className="shrink-0 text-mono text-[10px] text-ink">
                  {formatMoney(linePrice(l, currency) * l.qty, currency)}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 py-5">
            <Row k="SUBTOTAL" v={formatMoney(subtotal, currency)} />
            <Row k="SHIPPING" v={formatMoney(shippingCost, currency)} />
          </div>
          <div className="flex items-baseline justify-between border-t border-ink pt-4">
            <span className="text-mono text-[11px] text-ink">TOTAL</span>
            <span className="text-mono text-[15px] text-ink">{formatMoney(total, currency)}</span>
          </div>
          {form.paymentMethod === 'PAYSTACK' && form.region === 'NG' && (
            <p className="mt-3 text-mono text-[8px] leading-[1.8] text-mute">
              SETTLES AS {formatMoney(totalNGN, 'NGN')} VIA PAYSTACK
            </p>
          )}
          <div className="mt-6">
            <WhatsAppButton
              variant="inline"
              message="Hi JOURNEY, I need help with my order at checkout."
              label="Chat about this order"
            />
          </div>
        </aside>
      </div>
    </main>
  )
}

function Step({ n }: { n: string }) {
  return <span className="text-ink">{n}</span>
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-mono text-[10px]">
      <span className="text-mute">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  )
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
        active ? 'border-ink' : 'border-mute/40'
      }`}
    >
      {active && <span className="h-2 w-2 rounded-full bg-ink" />}
    </span>
  )
}
