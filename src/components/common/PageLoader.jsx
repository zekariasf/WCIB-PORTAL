function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-2 border-accent-dark border-t-primary"
        role="status"
        aria-label="Loading page"
      />
    </div>
  )
}

export default PageLoader
