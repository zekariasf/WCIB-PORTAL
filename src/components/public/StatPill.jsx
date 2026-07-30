function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background-subtle px-4 py-3">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-lg font-semibold text-secondary">{value}</p>
    </div>
  )
}

export default StatPill
