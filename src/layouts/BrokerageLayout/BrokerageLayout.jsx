import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Navbar, PageLoader } from '../../components/common'

function BrokerageLayout() {
  return (
    <div className="brokerage-layout flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="brokerage-layout__content flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default BrokerageLayout
