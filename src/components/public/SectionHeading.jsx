import { ArrowRight } from 'lucide-react'

function SectionHeading({ eyebrow, title, description, action, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-secondary sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-8 text-text-secondary">{description}</p>}
      {action && (
        <div className="mt-6 flex justify-start gap-3 sm:justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

export default SectionHeading
