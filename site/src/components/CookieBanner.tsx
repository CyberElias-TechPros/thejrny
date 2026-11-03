import { useState } from 'react'

const KEY = 'jrny-cookie-choice'

export default function CookieBanner() {
  const [choice, setChoice] = useState(() => localStorage.getItem(KEY))
  if (choice) return null
  const decide = (v: string) => {
    localStorage.setItem(KEY, v)
    setChoice(v)
  }
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 animate-fade">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-sm bg-ink px-5 py-3.5 text-bone shadow-[0_10px_40px_rgba(0,0,0,0.25)] max-w-[640px]">
        <p className="text-mono text-[9px] leading-[1.7] tracking-[0.1em] uppercase flex-1 min-w-[220px]">
          We use cookies to improve your experience. Opt out anytime.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => decide('continue')}
            className="border border-bone/60 px-4 py-1.5 text-mono text-[9px] uppercase tracking-[0.14em] transition-colors hover:bg-bone hover:text-ink"
          >
            Continue
          </button>
          <button
            onClick={() => decide('opt-out')}
            className="px-2 py-1.5 text-mono text-[9px] uppercase tracking-[0.14em] text-bone/60 transition-colors hover:text-bone"
          >
            Opt out
          </button>
        </div>
      </div>
    </div>
  )
}
