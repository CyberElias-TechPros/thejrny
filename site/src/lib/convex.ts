import { anyApi } from 'convex/server'

/**
 * The lost backend source is not needed: the deployment is still live and
 * functions are addressable by path. anyApi builds a dynamic FunctionReference
 * tree that works with useQuery/useMutation just like a generated api object.
 * e.g. api.products.list, api.orders.create, api.users.isAdmin
 */
export const api: any = anyApi

export const CONVEX_URL =
  (import.meta.env.VITE_CONVEX_URL as string | undefined) ??
  'https://adorable-rooster-546.convex.cloud'

export const CONVEX_SITE = CONVEX_URL.replace('.convex.cloud', '.convex.site')

export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ??
  'pk_live_Y2xlcmsudGhlanJueS5jb20ubmck'

/** Checkout server proxies that still exist on the hosting (Paystack). */
export const PAYSTACK_INIT = '/api/paystack-init.php'
export const PAYSTACK_VERIFY = '/api/paystack-verify.php'
