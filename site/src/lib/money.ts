export type Currency = 'NGN' | 'GBP'

const SYMBOL: Record<Currency, string> = { NGN: '₦', GBP: '£' }

/** Money formatting identical to the original: ₦7,000 / £4 */
export function formatMoney(amount: number, currency: Currency = 'NGN'): string {
  return `${SYMBOL[currency]}${Number(amount ?? 0).toLocaleString('en-GB')}`
}

/**GBP fallback when a product has no price_gbp: heuristic rate from the data. */
export function priceIn(
  product: { price_ngn?: number; price_gbp?: number },
  currency: Currency,
): number {
  if (currency === 'NGN') return product.price_ngn ?? 0
  if (product.price_gbp != null) return product.price_gbp
  return Math.round((product.price_ngn ?? 0) / 2000)
}

/** Order reference generator, same format as the original: TJ-4821 */
export function newOrderRef(): string {
  return `TJ-${Math.floor(1000 + Math.random() * 9000)}`
}

/** Resolve a bag line's unit price in the requested currency. */
export function linePrice(
  line: { price?: number; product?: { price_ngn?: number; price_gbp?: number } },
  currency: 'NGN' | 'GBP',
): number {
  if (line.product) return priceIn(line.product, currency)
  return line.price ?? 0
}

