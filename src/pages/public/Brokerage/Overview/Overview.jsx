import { ArrowRight, FileCheck2, Landmark, ReceiptText, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import StatPill from '../../../../components/public/StatPill'
import { ROUTES } from '../../../../constants/routes'

const actions = [
  {
    title: 'Open Trading Account',
    description: 'Begin a seamless onboarding journey with guided document collection.',
    to: ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT,
    icon: ShieldCheck,
  },
  {
    title: 'Place Orders',
    description: 'Submit secondary market and treasury bill orders in a few simple steps.',
    to: ROUTES.PUBLIC.BROKERAGE.ORDERS,
    icon: TrendingUp,
  },
  {
    title: 'Trade via Neway',
    description: 'Use Neway for a fast, modern gateway to market execution.',
    to: ROUTES.PUBLIC.BROKERAGE.NEWAY,
    icon: Landmark,
  },
  {
    title: 'Track Application',
    description: 'Follow the progress of your account opening and activation milestones.',
    to: ROUTES.PUBLIC.BROKERAGE.TRACKING,
    icon: FileCheck2,
  },
]

const timeline = [
  'Open Account',
  'Upload Documents',
  'Verification',
  'Fund Account',
  'Start Trading',
]

function Overview() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf5_100%)] shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Brokerage overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
              The premium brokerage experience for modern investors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              Open an account, place orders, and track every milestone through a polished digital journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT} variant="primary">
                Open Trading Account
              </Button>
              <Button to={ROUTES.PUBLIC.BROKERAGE.ORDERS} variant="outline">
                Place Orders
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background-subtle px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-secondary">Service highlights</p>
                <p className="text-sm text-text-secondary">Secure onboarding • Guided execution • Live tracking</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <StatPill label="Average onboarding" value="24 hours" />
              <StatPill label="Support desk" value="Dedicated" />
              <StatPill label="Account types" value="2+" />
              <StatPill label="Markets" value="Primary / Secondary" />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Quick actions"
          title="Everything you need to begin investing with confidence."
          description="Move from account opening to execution through a seamless, beautifully guided experience."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} to={action.to} className="group rounded-[1.75rem] border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-secondary">{action.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{action.description}</p>
                <span className="link mt-5">
                  Open now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </PageSection>

      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Journey timeline</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-secondary sm:text-4xl">
            A guided path from application to live trading.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {timeline.map((step, index) => (
            <div key={step} className="rounded-[1.5rem] border border-border bg-background-subtle p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-text-on-primary">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-secondary">{step}</h3>
              <p className="mt-2 text-sm leading-7 text-text-secondary">
                {index === 0 ? 'Begin your account setup.' : index === timeline.length - 1 ? 'Start trading with full activation.' : 'Progress smoothly through each milestone.'}
              </p>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}

export default Overview
