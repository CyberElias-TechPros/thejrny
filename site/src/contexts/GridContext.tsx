import { createContext, useContext, useState, type ReactNode } from 'react'

/** Grid density toggle: cycles between 4 / 3 columns on md+ */
const GridContext = createContext<{
  cols: number
  cycle: () => void
}>({ cols: 4, cycle: () => {} })

const CYCLE = [4, 3]

export function GridProvider({ children }: { children: ReactNode }) {
  const [cols, setCols] = useState(() => {
    const saved = parseInt(localStorage.getItem('jrny-cols') ?? '4', 10)
    return CYCLE.includes(saved) ? saved : 4
  })
  const cycle = () =>
    setCols((c) => {
      const next = CYCLE[(CYCLE.indexOf(c) + 1) % CYCLE.length]
      localStorage.setItem('jrny-cols', String(next))
      return next
    })
  return <GridContext.Provider value={{ cols, cycle }}>{children}</GridContext.Provider>
}

export function useGrid() {
  return useContext(GridContext)
}
