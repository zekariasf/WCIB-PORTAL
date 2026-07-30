import { ArrowRight, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/common'
import InfoCard from '../../../components/public/InfoCard'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'
import { ROUTES } from '../../../constants/routes'

const highlights = [
  {
    title: 'Institutional-grade execution',
    description: 'Access sophisticated market access with transparent pricing and dedicated support.',
    icon: TrendingUp,
    actionLabel: 'Explore brokerage',
    to: ROUTES.PUBLIC.BROKERAGE.OVERVIEW,
  },
  {
    title: 'Trusted compliance',
    description: 'Robust onboarding, document handling, and secure client servicing built in.',
    icon: ShieldCheck,
    actionLabel: 'Open account',
    to: ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT,
  },
  {
    title: 'Actionable research',
    description: 'Stay ahead with timely market insights and curated investment intelligence.',
    icon: BarChart3,
    actionLabel: 'Read research',
    to: ROUTES.PUBLIC.RESEARCH,
  },
]

function Home() {
  return (
    <div className="bg-background">
      <PageSection className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf5_100%)] shadow-sm">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-primary">Wegagen Capital</p>
            <h1 className="text-4xl font-semibold tracking-tight text-secondary sm:text-5xl lg:text-6xl">
              Your gateway to confident wealth management.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              Discover a premium brokerage experience shaped for modern investors, from private wealth solutions to institutional market access.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT} variant="primary">
                Open Trading Account
              </Button>
              <Button to={ROUTES.PUBLIC.BROKERAGE.OVERVIEW} variant="outline">
                Explore Brokerage
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-md">
            <div className="rounded-2xl bg-background-subtle p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Portfolio insight</p>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Client onboarding', value: '24h average' },
                  { label: 'Account activation', value: 'Same day' },
                  { label: 'Support coverage', value: 'Dedicated team' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="font-semibold text-secondary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Why clients choose us"
          title="A modern investment bank designed around clarity and confidence."
          description="Every interaction combines premium service, disciplined execution, and elegant digital experiences."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </PageSection>

      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Client experience</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-secondary sm:text-4xl">
              Built for investors who value reliability.
            </h2>
            <p className="mt-4 text-lg leading-8 text-text-secondary">
              From account opening to order execution, the experience is guided, responsive, and deeply professional.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Secure onboarding', 'Encrypted document collection and real-time status updates.'],
              ['Fast execution', 'Place orders with a guided, intuitive workflow.'],
              ['Market insight', 'Receive research and updates tailored to your goals.'],
              ['Dedicated support', 'A brokerage desk ready to assist at each step.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-border bg-background-subtle p-5">
                <h3 className="font-semibold text-secondary">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default Home
