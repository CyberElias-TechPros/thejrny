import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useClerk, useAuth, SignIn, ClerkProvider } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { useQuery } from 'convex/react'
import { toast } from 'sonner'
import { api, CONVEX_URL, CLERK_PUBLISHABLE_KEY } from '../lib/convex'

/** Authenticated Convex client — orders, users:isAdmin, admin mutations. */
const authedClient = new ConvexReactClient(CONVEX_URL)

/**
 * Gate: requires Clerk session whose user has the admin role in Convex.
 * Clerk is only loaded here (not on the storefront) because production keys
 * are domain-locked to thejrny.com.ng — test /admin on the real domain or a
 * tunnel/hosted preview of that domain.
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={authedClient} useAuth={useAuth}>
        <Gate>{children}</Gate>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

function Gate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const clerk = useClerk()
  // users:isAdmin reads the caller's identity from the signed-in Convex client.
  const isAdminResult = useQuery(
    api.users.isAdmin,
    isSignedIn ? {} : ('skip' as never),
  ) as unknown as boolean | undefined | null

  useEffect(() => {
    if (isSignedIn && isAdminResult === false) {
      toast.error('ADMIN ACCESS REQUIRED — this account does not have admin role.')
    }
  }, [isSignedIn, isAdminResult])

  if (!isLoaded) {
    return <div className="py-24 text-center text-mono text-[10px] text-mute animate-fade">LOADING…</div>
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen grid place-items-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-mono text-[10px] text-mute text-center mb-6">
            JOURNEY — ADMIN ACCESS
          </div>
          <SignIn
            redirectUrl="/admin"
            signUpForceRedirectUrl="/admin"
            fallbackRedirectUrl="/admin"
          />
        </div>
      </div>
    )
  }

  if (isAdminResult === undefined) {
    return <div className="py-24 text-center text-mono text-[10px] text-mute">CHECKING ROLE…</div>
  }

  if (isAdminResult === false) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="border border-line p-8 text-center max-w-sm">
          <p className="text-mono text-[10px] text-ink mb-2">ADMIN ACCESS REQUIRED</p>
          <p className="text-[12px] text-ink/70 mb-6">
            This account does not have admin role. Ask the store owner to grant it in the
            Convex dashboard.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => clerk.signOut()}
              className="text-mono text-[10px] text-ink underline underline-offset-4"
            >
              SIGN IN WITH ANOTHER ACCOUNT
            </button>
            <Link to="/" className="text-mono text-[10px] text-mute hover:text-ink">
              ← BACK TO STORE
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
