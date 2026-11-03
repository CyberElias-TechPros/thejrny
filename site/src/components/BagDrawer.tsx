import { Link } from 'react-router-dom'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { formatMoney, linePrice } from '../lib/money'

const FREE_SHIP_TARGET = 50000

export default function BagDrawer() {
  const { lines, open, setOpen, remove, setQty } = useCart()
  const { currency } = useCurrency()
  const subtotal = lines.reduce((s, l) => s + linePrice(l, currency) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_TARGET) * 100))

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-void/60 backdrop-blur-[3px] transition-opacity duration-400 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col bg-bone border-l border-line transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* head */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h3 className="flex items-center gap-2.5 text-mono text-[11px] text-ink">
            <ShoppingBag size={16} strokeWidth={1.5} />
            BAG ({count})
          </h3>
          <button
            className="text-mute hover:text-ink transition-opacity"
            onClick={() => setOpen(false)}
            aria-label="Close bag"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ash">
              <ShoppingBag size={28} strokeWidth={1.25} className="text-mute" />
            </div>
            <p className="h3-display text-[20px] uppercase mb-2">Your bag is empty</p>
            <p className="text-[13px] text-ink/55 leading-[1.75] mb-8 max-w-xs mx-auto">
              Every piece is produced once. When it's gone, it's gone.
            </p>
            <Link to="/" onClick={() => setOpen(false)} className="btn-outline !px-10">
              SHOP NEW
            </Link>
          </div>
        ) : (
          <>
            {/* shipping incentive */}
            <div className="px-6 pt-5 pb-4 border-b border-line bg-bone-2">
              <p className="text-mono text-[9px] text-mute mb-2.5">
                {subtotal >= FREE_SHIP_TARGET
                  ? '✓ FREE SHIPPING UNLOCKED'
                  : `YOU'RE ${formatMoney(FREE_SHIP_TARGET - subtotal, currency)} FROM FREE SHIPPING`}
              </p>
              <div className="h-px bg-line relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 h-0.5 -translate-y-1/4 bg-gold transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto">
              {lines.map((l) => (
                <div
                  key={`${l.productId}-${l.size}`}
                  className="flex gap-4 border-b border-line px-6 py-5"
                >
                  <Link to={`/products/${l.productId}`} onClick={() => setOpen(false)} className="shrink-0">
                    <div className="h-[104px] w-[76px] overflow-hidden bg-ash card-surface">
                      {l.product?.image_url ? (
                        <img src={l.product.image_url} alt={l.product.name} className="img-cover" />
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={`/products/${l.productId}`}
                          onClick={() => setOpen(false)}
                          className="text-mono text-[10px] text-ink link-underline"
                        >
                          {l.product?.code ?? l.productId}
                        </Link>
                        <p className="text-mono text-[9px] text-mute mt-1.5">
                          SIZE {l.size} ·
                          {l.product?.name?.toUpperCase().slice(0, 18)}
                        </p>
                      </div>
                      <span className="text-mono text-[10px] text-ink">
                        {formatMoney(linePrice(l, currency) * l.qty, currency)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          className="grid h-8 w-8 place-items-center hover:bg-bone-2 disabled:opacity-30"
                          onClick={() => setQty(l.productId, l.size, l.qty - 1)}
                          disabled={l.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-mono text-[10px]">{l.qty}</span>
                        <button
                          className="grid h-8 w-8 place-items-center hover:bg-bone-2"
                          onClick={() => setQty(l.productId, l.size, l.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(l.productId, l.size)}
                        className="text-mono text-[9px] text-mute hover:text-ink underline underline-offset-4"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="border-t border-line px-6 py-5">
              <div className="flex justify-between text-mono text-[11px] text-ink mb-1.5">
                <span>SUBTOTAL</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-mono text-[9px] text-mute mb-6">
                <span>SHIPPING + TAXES</span>
                <span>CALCULATED AT CHECKOUT</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                CHECKOUT — {formatMoney(subtotal, currency)}
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full text-center text-mono text-[9px] text-mute hover:text-ink"
              >
                CONTINUE BROWSING
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
