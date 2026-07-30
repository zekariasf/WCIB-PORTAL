import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { APP_NAME } from '../../constants/app'
import { ROUTES } from '../../constants/routes'
import { FOOTER_LINK_GROUPS } from '../../constants/navigation'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary text-text-inverse">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to={ROUTES.PUBLIC.HOME} className="inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-text-on-primary">
                WC
              </span>
              <span className="text-lg font-bold">Wegagen Capital</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-accent-darker">
              A trusted investment bank delivering brokerage services, research, and
              capital market solutions.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-accent-darker">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary-light" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary-light" />
                <span>+251 11 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary-light" />
                <span>info@wegagen.com</span>
              </li>
            </ul>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-accent-darker transition-colors hover:text-text-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-secondary-light pt-8 sm:flex-row">
          <p className="text-sm text-accent-darker">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-accent-darker">
            Licensed and regulated financial institution.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
