import { ArrowRight, ClipboardList, FileCheck2, ReceiptText, UserRoundPlus } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'
import { useAppContext } from '../../../context/AppContext'

function Dashboard() {
  const { applications, orders } = useAppContext()

  const summary = useMemo(() => ({
    newApplications: applications.filter((app) => app.status === 'Submitted').length,
    pendingReview: applications.filter((app) => app.status === 'Pending Review').length,
    pendingOrders: orders.filter((order) => order.status === 'Pending Review').length,
    approvedToday: applications.filter((app) => app.status === 'Approved').length,
    rejected: applications.filter((app) => app.status === 'Rejected').length,
  }), [applications, orders])

  return (
    <div className="space-y-6">
      <PageSection className="rounded-[2rem] border border-border bg-white p-0 shadow-sm">
        <div className="border-b border-border p-6">
          <SectionHeading eyebrow="Operations dashboard" title="Monitor onboarding and trading activity in one place." description="All public submissions and portal actions are synchronized through Local Storage." />
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'New applications', value: summary.newApplications, icon: UserRoundPlus },
            { label: 'Pending review', value: summary.pendingReview, icon: ClipboardList },
            { label: 'Pending orders', value: summary.pendingOrders, icon: ReceiptText },
            { label: 'Approved today', value: summary.approvedToday, icon: FileCheck2 },
            { label: 'Rejected', value: summary.rejected, icon: FileCheck2 },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-2xl border border-border bg-background-subtle p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-text-secondary">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">{item.value}</p>
              </div>
            )
          })}
        </div>
      </PageSection>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageSection className="rounded-[2rem] border border-border bg-white p-0 shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-2xl font-semibold text-secondary">Recent applications</h2>
          </div>
          <div className="space-y-3 p-6">
            {applications.slice(0, 4).map((application) => (
              <div key={application.applicationNumber} className="flex items-center justify-between rounded-2xl border border-border bg-background-subtle px-4 py-4">
                <div>
                  <p className="font-semibold text-secondary">{application.applicationNumber}</p>
                  <p className="text-sm text-text-secondary">{application.personalInformation?.fullName}</p>
                </div>
                <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-secondary">{application.status}</span>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection className="rounded-[2rem] border border-border bg-white p-0 shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-2xl font-semibold text-secondary">Recent orders</h2>
          </div>
          <div className="space-y-3 p-6">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-border bg-background-subtle px-4 py-4">
                <div>
                  <p className="font-semibold text-secondary">{order.id}</p>
                  <p className="text-sm text-text-secondary">{order.clientName}</p>
                </div>
                <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-secondary">{order.status}</span>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  )
}

export default Dashboard
