import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function InfoCard({ title, description, icon: Icon, actionLabel, to }) {
  return (
    <div className="group rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-secondary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{description}</p>
      {to && actionLabel ? (
        <Link to={to} className="link mt-5">
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

export default InfoCard
