import { Link, NavLink, Outlet } from 'react-router-dom'

const NAV: { label: string; items: { to: string; label: string; end?: boolean }[] }[] = [
  {
    label: 'OVERVIEW',
    items: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    label: 'CATALOG',
    items: [
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/inventory', label: 'Inventory' },
      { to: '/admin/categories', label: 'Categories' },
      { to: '/admin/homepage', label: 'Homepage' },
    ],
  },
  {
    label: 'COMMERCE',
    items: [
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/customers', label: 'Customers' },
      { to: '/admin/shipping', label: 'Shipping' },
      { to: '/admin/currency', label: 'Currency' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [{ to: '/admin/analytics', label: 'Analytics' }],
  },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-bone">
      <aside className="w-[220px] shrink-0 border-r border-line px-4 py-6 sticky top-0 h-screen overflow-y-auto hidden md:block">
        <div className="text-mono text-[10px] text-ink mb-1">JOURNEY · ADMIN</div>
        <div className="text-[9px] text-mute mb-8">single-batch control room</div>
        {NAV.map((group) => (
          <div key={group.label} className="mb-6">
            <div className="text-mono text-[9px] text-mute mb-2">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block py-1.5 text-[11px] transition-colors ${
                    isActive ? 'text-ink font-medium' : 'text-mute hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
        <Link to="/" className="block mt-10 text-mono text-[9px] text-mute hover:text-ink">
          ← STOREFRONT
        </Link>
      </aside>

      <div className="flex-1 min-w-0 px-6 py-6 md:px-10 md:py-9">
        {/* compact nav for small screens */}
        <div className="md:hidden flex gap-4 text-mono text-[10px] text-mute mb-6 overflow-x-auto">
          {NAV.flatMap((g) => g.items).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'text-ink' : '')}
            >
              {item.label.toUpperCase()}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  )
}
