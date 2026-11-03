import { useUser, useClerk } from '@clerk/clerk-react'
import { CONVEX_URL, CLERK_PUBLISHABLE_KEY, CONVEX_SITE } from '../lib/convex'

export default function AdminSettings() {
  const { user } = useUser()
  const clerk = useClerk()

  return (
    <div className="animate-fade">
      <h1 className="text-mono text-[12px] text-ink mb-3">SETTINGS</h1>
      <p className="text-[10px] text-mute mb-8">
        Live service connections that this build talks to. Nothing secret is stored here —
        publishable keys and URLs are public by design.
      </p>

      <div className="max-w-2xl space-y-3">
        <Row label="CONVEX DATABASE" value={CONVEX_URL} />
        <Row label="CONVEX EMAIL ACTIONS" value={CONVEX_SITE} />
        <Row label="CLERK INSTANCE" value={CLERK_PUBLISHABLE_KEY.replace(/\$/, '') + ' → clerk.thejrny.com.ng'} />
        <Row label="PAYSTACK PROXY" value="/api/paystack-init.php · /api/paystack-verify.php (host PHP)" />

        <div className="border border-line p-4">
          <p className="text-mono text-[9px] text-mute mb-2">SIGNED IN AS</p>
          <p className="text-[12px]">
            {user?.primaryEmailAddress?.emailAddress ?? '—'}
          </p>
          <button
            onClick={() => clerk.signOut().then(() => (window.location.href = '/'))}
            className="mt-3 text-mono text-[10px] text-mute hover:text-ink underline underline-offset-4"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-4">
      <p className="text-mono text-[9px] text-mute mb-1">{label}</p>
      <p className="text-[11px] break-all">{value}</p>
    </div>
  )
}
