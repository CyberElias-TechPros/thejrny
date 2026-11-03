import { createBrowserRouter, RouterProvider, Outlet, Link, Navigate } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { GridProvider } from './contexts/GridContext'
import Header from './components/Header'
import Footer from './components/Footer'
import BagDrawer from './components/BagDrawer'
import CookieBanner from './components/CookieBanner'
import WhatsAppFab from './components/WhatsAppFab'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductPage from './pages/Product'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLayout from './admin/AdminLayout'
import RequireAdmin from './admin/RequireAdmin'
import AdminHome from './admin/AdminHome'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminCustomers from './admin/AdminCustomers'
import AdminShipping from './admin/AdminShipping'
import AdminCurrency from './admin/AdminCurrency'
import AdminCategories from './admin/AdminCategories'
import AdminHomepage from './admin/AdminHomepage'
import AdminAnalytics from './admin/AdminAnalytics'
import AdminSettings from './admin/AdminSettings'
import AdminSimple from './admin/AdminSimple'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import WhatsAppButton from './components/WhatsAppButton'

const CATEGORY_SLUGS = ['mens', 'womens', 'accessories', 'jersey', 'shorts']

function Storefront() {
  return (
    <>
      <Header />
      <main className="px-3 pb-20 md:px-4">
        <Outlet />
      </main>
      <BagDrawer />
      <CookieBanner />
      <WhatsAppFab />
      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-mono text-[10px] text-mute mb-4">404 — NOTHING HERE.</p>
      <Link to="/" className="text-mono text-[10px] text-ink underline underline-offset-4">
        SHOP NEW
      </Link>
      <WhatsAppButton
        variant="inline"
        message="Hi JOURNEY, I reached a page that doesn't exist. Can you help me?"
        label="Chat on WhatsApp"
        className="mt-6 inline-block"
      />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: (
      <CartProvider>
        <CurrencyProvider>
          <GridProvider>
            <Storefront />
          </GridProvider>
        </CurrencyProvider>
      </CartProvider>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/products/:id', element: <ProductPage /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/refund-policy', element: <RefundPolicy /> },
      { path: '/shipping-policy', element: <ShippingPolicy /> },
      ...CATEGORY_SLUGS.map((slug) => ({
        path: `/${slug}`,
        element: <Category slug={slug} />,
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    children: [
      { path: '/admin', element: <AdminHome /> },
      { path: '/admin/products', element: <AdminProducts /> },
      { path: '/admin/inventory', element: <AdminSimple title="INVENTORY" /> },
      { path: '/admin/orders', element: <AdminOrders /> },
      { path: '/admin/customers', element: <AdminCustomers /> },
      { path: '/admin/shipping', element: <AdminShipping /> },
      { path: '/admin/currency', element: <AdminCurrency /> },
      { path: '/admin/categories', element: <AdminCategories /> },
      { path: '/admin/homepage', element: <AdminHomepage /> },
      { path: '/admin/analytics', element: <AdminAnalytics /> },
      { path: '/admin/settings', element: <AdminSettings /> },
      { path: '/admin/*', element: <Navigate to="/admin" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
