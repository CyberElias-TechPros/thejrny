import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App'
import { CONVEX_URL } from './lib/convex'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * The storefront runs on an unauthenticated Convex client: products,
 * categories and shipping are public functions. Admin/authenticated Convex
 * (orders, users:isAdmin) lives inside the /admin area (see RequireAdmin).
 */
const client = new ConvexReactClient(CONVEX_URL)
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'oklch(12% 0 0)',
              color: 'oklch(100% 0 0)',
              borderRadius: '0',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '10px',
            },
          }}
        />
      </QueryClientProvider>
    </ConvexProvider>
  </StrictMode>,
)
