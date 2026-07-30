import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../common'
import { ROUTES } from '../../constants/routes'
import { PUBLIC_NAV_LINKS } from '../../constants/navigation'
import { cn } from '../../utils/helpers'

function NavItem({ link, onNavigate }) {
  const location = useLocation()
  const isActive = link.matchPrefix
    ? location.pathname.startsWith(link.matchPrefix)
    : undefined

  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive: navActive }) =>
        cn(
          'rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200',
          (link.matchPrefix ? isActive : navActive)
            ? 'bg-primary-muted text-primary shadow-sm'
            : 'text-secondary hover:bg-primary-muted hover:text-primary',
        )
      }
    >
      {link.label}
    </NavLink>
  )
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.PUBLIC.HOME}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-text-on-primary shadow-[0_10px_20px_-12px_rgba(141,207,124,0.8)]">
            WC
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-secondary group-hover:text-primary">
              Wegagen Capital
            </span>
            <span className="hidden text-xs font-medium text-text-secondary sm:block">
              Investment Bank
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {PUBLIC_NAV_LINKS.map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            to={ROUTES.PORTAL.LOGIN}
            variant="outline"
            className="hidden sm:inline-flex"
          >
            Portal
          </Button>
          <Button
            to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT}
            variant="primary"
            className="hidden sm:inline-flex"
          >
            Open Account
          </Button>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl text-secondary hover:bg-primary-muted hover:text-primary lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-secondary/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        id="mobile-nav"
        className={cn(
          'border-t border-border bg-white/95 lg:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {PUBLIC_NAV_LINKS.map((link) => (
            <NavItem key={link.to} link={link} onNavigate={() => setMobileOpen(false)} />
          ))}
          <Button
            to={ROUTES.PORTAL.LOGIN}
            variant="outline"
            className="mt-3 w-full sm:hidden"
            onClick={() => setMobileOpen(false)}
          >
            Portal
          </Button>
          <Button
            to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT}
            variant="primary"
            className="mt-3 w-full sm:hidden"
            onClick={() => setMobileOpen(false)}
          >
            Open Account
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
