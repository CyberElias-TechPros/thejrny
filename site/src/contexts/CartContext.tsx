import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type SizeOption = { label: string; stock: number }
export type ProductLite = {
  id: string
  code: string
  name: string
  image_url?: string
  price_ngn: number
  price_gbp?: number
  tones?: string[]
}

export type BagLine = {
  productId: string
  size: string
  qty: number
  price: number // unit price in the currency chosen at add-time is NOT stored; store NGN unit and format live
  product?: ProductLite
}

const CartContext = createContext<{
  lines: BagLine[]
  count: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (line: BagLine) => void
  remove: (productId: string, size: string) => void
  setQty: (productId: string, size: string, qty: number) => void
  clear: () => void
}>(null!)

const STORAGE_KEY = 'jrny-bag'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const add = (line: BagLine) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => l.productId === line.productId && l.size === line.size,
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + line.qty }
        return next
      }
      return [...prev, line]
    })
    setOpen(true)
  }

  const remove = (productId: string, size: string) =>
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)))

  const setQty = (productId: string, size: string, qty: number) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.size === size))
        : prev.map((l) => (l.productId === productId && l.size === size ? { ...l, qty } : l)),
    )

  const clear = () => setLines([])

  const count = lines.reduce((s, l) => s + l.qty, 0)

  return (
    <CartContext.Provider
      value={{ lines, count, open, setOpen, add, remove, setQty, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
