import ProductCard, { type Product } from './ProductCard'
import { useGrid } from '../contexts/GridContext'

const GRID: Record<number, string> = {
  3: 'md:grid-cols-3 lg:grid-cols-3',
  4: 'md:grid-cols-4 lg:grid-cols-4',
  6: 'md:grid-cols-4 lg:grid-cols-4',
}

/** Staggered product grid with column density control (admin grid toggle). */
export default function ProductGrid({
  products,
}: {
  products: Product[]
}) {
  const { cols } = useGrid()
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:gap-y-14 transition-all duration-300 ${GRID[cols]}`}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id ?? p._id} product={p} index={i} />
      ))}
    </div>
  )
}
