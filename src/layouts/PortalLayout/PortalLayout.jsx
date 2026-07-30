import { Suspense, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, LayoutGrid, ListChecks, LogOut, ReceiptText, ShieldCheck } from 'lucide-react'
import { PageLoader } from '../../components/common'
import { ROUTES } from '../../constants/routes'
import { useAppContext } from '../../context/AppContext'

const navItems = [
  { label: 'Dashboard', to: ROUTES.PORTAL.DASHBOARD, icon: LayoutGrid },
  { label: 'Applications', to: ROUTES.PORTAL.APPLICATIONS, icon: ListChecks },
  { label: 'Orders', to: ROUTES.PORTAL.ORDERS, icon: ReceiptText },
]

function PortalLayout() {
  const navigate = useNavigate()
  const { auth, logout } = useAppContext()

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate(ROUTES.PORTAL.LOGIN)
    }
  }, [auth.isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.PORTAL.LOGIN)
  }

  return (
    <div className="portal-layout flex min-h-screen bg-background-subtle">
      <aside className="portal-layout__sidebar hidden w-72 shrink-0 border-r border-border bg-secondary px-5 py-6 text-text-inverse lg:block">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">Portal</p>
          <h2 className="mt-2 text-lg font-semibold">Wegagen Capital</h2>
          <p className="mt-2 text-sm text-accent-darker">Operations workspace</p>
        </div>
        <nav className="mt-8 space-y-2" aria-label="Portal navigation">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${isActive ? 'bg-primary-muted text-primary' : 'text-accent-darker hover:bg-white/10 hover:text-text-inverse'}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-muted text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Compliance ready</p>
              <p className="text-sm text-accent-darker">All updates are stored locally.</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="portal-layout__content flex-1 bg-background-subtle p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between rounded-[1.5rem] border border-border bg-white px-4 py-4 shadow-sm sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Brokerage operations</p>
            <h1 className="text-2xl font-semibold text-secondary">Operational control centre</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background-subtle text-secondary">
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background-subtle px-3 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default PortalLayout
