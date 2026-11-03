export type ProductSEO = {
  id?: string
  _id?: string
  name: string
  code: string
  description?: string
  image_url?: string
  price_ngn?: number
  price_gbp?: number
  is_new?: boolean
  categories?: string[]
}

const BASE = 'https://thejrny.com.ng'
const SITE_NAME = 'JOURNEY'
const DEFAULT_DESC =
  'Single-batch garments and accessories. Each artifact is produced once, in a finite quantity, and not restocked. Ships worldwide. Pay in Naira or Pounds.'

function setAttr(el: HTMLElement, attrs: Record<string, string>) {
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

function meta(name: string, content: string, prop = false) {
  let el = document.querySelector(`meta[${prop ? 'property' : 'name'}="${name}"]`) as HTMLElement
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(prop ? 'property' : 'name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function link(rel: string, href: string, extra: Record<string, string> = {}) {
  let el = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute('href', href)
    document.head.appendChild(el)
  }
  setAttr(el, extra)
}

function jsonld(data: unknown, id?: string) {
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  if (id) el.id = id
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}

function removeJsonld(id: string) {
  const el = document.getElementById(id)
  if (el) el.remove()
}

export function useSEO({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image,
  type = 'website',
}: {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'product'
}) {
  document.title = title

  meta('description', description)
  meta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
  meta('language', 'English')
  meta('og:site_name', SITE_NAME, true)
  meta('og:type', type, true)
  meta('og:url', `${BASE}${path}`, true)
  meta('og:title', title, true)
  meta('og:description', description, true)
  meta('og:locale', 'en_NG', true)
  if (image) meta('og:image', image, true)

  meta('twitter:card', 'summary_large_image')
  meta('twitter:site', '@thejrny')
  meta('twitter:creator', '@thejrny')
  meta('twitter:title', title)
  meta('twitter:description', description)
  if (image) meta('twitter:image', image)

  link('canonical', `${BASE}${path}`)
  link('alternate', `${BASE}${path}`, { hreflang: 'en' })
  link('alternate', `${BASE}${path}`, { hreflang: 'en-NG' })

  jsonld(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE}${path}#webpage`,
      'url': `${BASE}${path}`,
      'name': title,
      'description': description,
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `${BASE}#website`,
        'name': SITE_NAME,
        'url': BASE,
      },
      'inLanguage': 'en',
    },
    'seo-webpage',
  )

  jsonld(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE}/` },
      ],
    },
    'seo-breadcrumb',
  )
}

export function useProductSEO({
  product,
  path,
  currency = 'NGN',
}: {
  product: ProductSEO | null | undefined
  path: string
  currency?: 'NGN' | 'GBP'
}) {
  const p = product ?? { name: 'JOURNEY', code: 'TJ-000', price_ngn: 0 }
  const price =
    currency === 'GBP' ? (p.price_gbp ?? Math.round((p.price_ngn ?? 0) / 2000)) : p.price_ngn ?? 0
  const symbol = currency === 'GBP' ? '£' : '₦'
  const image = p.image_url ?? '/favicon-32.png'

  document.title = `${p.code} — ${p.name} | JOURNEY`
  const desc =
    p.description ??
    `Single-batch ${p.name} by JOURNEY. ${p.code}. Finite quantity — not restocked. ${symbol}${price.toLocaleString('en-GB')}. Ships worldwide.`

  useSEO({
    title: `${p.code} — ${p.name} | JOURNEY`,
    description: desc,
    path,
    image,
    type: 'product',
  })

  // Replace breadcrumb with product-aware one
  removeJsonld('seo-breadcrumb')
  jsonld(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Shop', 'item': `${BASE}/` },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': p.name,
          'item': `${BASE}${path}`,
        },
      ],
    },
    'seo-breadcrumb',
  )

  jsonld(
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${BASE}${path}#product`,
      'name': p.name,
      'description': desc,
      'image': image,
      'url': `${BASE}${path}`,
      'sku': p.code,
      'brand': { '@type': 'Brand', 'name': 'JOURNEY' },
      'category': 'Apparel',
      'isNew': p.is_new ?? true,
      'offers': {
        '@type': 'Offer',
        'url': `${BASE}${path}`,
        'priceCurrency': currency,
        'price': String(price),
        'availability': 'https://schema.org/InStock',
        'priceValidUntil': new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        'seller': {
          '@type': 'Organization',
          'name': 'JOURNEY',
          'url': BASE,
        },
      },
      'aggregateOffer': {
        '@type': 'AggregateOffer',
        'lowPrice': String(price),
        'highPrice': String(price),
        'priceCurrency': currency,
        'offerCount': 1,
      },
    },
    'seo-product',
  )
}

export function jsonldRemove(ids: string[]) {
  ids.forEach(removeJsonld)
}
