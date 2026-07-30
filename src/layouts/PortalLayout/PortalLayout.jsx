import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageLoader } from '../../components/common'

function PortalLayout() {
  return (
    <div className="portal-layout flex min-h-screen bg-background-subtle">
      <aside className="portal-layout__sidebar w-64 shrink-0 border-r border-border bg-secondary">
        {/* Sidebar placeholder */}
      </aside>
      <main className="portal-layout__content flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default PortalLayout
