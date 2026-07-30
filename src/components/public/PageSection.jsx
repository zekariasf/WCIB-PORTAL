function PageSection({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${className}`.trim()}>{children}</div>
}

export default PageSection
