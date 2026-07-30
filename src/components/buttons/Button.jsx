import { Link } from 'react-router-dom'
import { cn } from '../../utils/helpers'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-primary text-text-on-primary hover:bg-primary-hover',
  outline:
    'border border-border bg-background text-secondary hover:border-primary hover:text-primary',
  ghost: 'text-secondary hover:bg-accent hover:text-secondary',
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
