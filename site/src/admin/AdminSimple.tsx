import { type ReactNode } from 'react'

export default function AdminSimple({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">{title}</h1>
      <p className="text-[10px] text-mute max-w-md leading-[1.7]">
        This section existed in the original admin and isn't wired to a known server
        function. Data lives in Convex — as soon as its backend functions are exposed
        (or imported from a backup), drop a page in src/admin and add the route.
        {children}
      </p>
    </div>
  )
}
