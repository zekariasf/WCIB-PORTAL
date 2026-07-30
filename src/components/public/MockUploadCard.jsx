import { UploadCloud } from 'lucide-react'

function MockUploadCard({ title, description, accepted, maxSize, progress = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-3xl border border-dashed border-border bg-background-subtle p-5 text-left transition-all duration-200 hover:border-primary hover:bg-primary-muted"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-secondary">{title}</p>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-text-secondary">
              {accepted} • Max {maxSize}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-secondary">
          {progress}%
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </button>
  )
}

export default MockUploadCard
