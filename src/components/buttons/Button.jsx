import { Link } from 'react-router-dom'
import { cn } from '../../utils/helpers'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-primary text-text-on-primary hover:bg-primary-hover shadow-[0_10px_25px_-12px_rgba(141,207,124,0.65)]',
  outline:
    'border border-border bg-background text-secondary hover:border-primary hover:text-primary hover:bg-primary-muted',
  ghost: 'bg-transparent text-secondary shadow-none hover:bg-primary-muted hover:text-primary',
}

function Button({ children, variant = 'primary', to, className = '', type = 'button', ...props }) {
  const classes = cn(baseStyles, variants[variant], className)

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
