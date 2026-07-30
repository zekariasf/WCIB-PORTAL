import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Navbar, PageLoader } from '../../components/common'

function MainLayout() {
  return (
    <div className="main-layout flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-on-primary"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="main-layout__content flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
