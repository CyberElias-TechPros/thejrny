import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Currency } from '../lib/money'

const CurrencyContext = createContext<{
  currency: Currency
  setCurrency: (c: Currency) => void
}>({ currency: 'NGN', setCurrency: () => {} })

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('jrny-currency')
    return saved === 'GBP' ? 'GBP' : 'NGN'
  })
  const update = (c: Currency) => {
    setCurrency(c)
    localStorage.setItem('jrny-currency', c)
  }
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: update }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
