export default function Ticker({ items }: { items: string[] }) {
  const line = items.join('–––') + '–––'
  return (
    <div className="bg-ink text-bone overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap py-2 text-mono text-[9px]">
        <span className="pr-8">{line}</span>
        <span className="pr-8" aria-hidden>
          {line}
        </span>
      </div>
    </div>
  )
}
