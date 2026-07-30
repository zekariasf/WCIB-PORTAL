import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'
import { ROUTES } from '../../../constants/routes'

const reports = [
  {
    title: 'Market outlook',
    description: 'A clear view of macro themes shaping the current trading environment.',
  },
  {
    title: 'Equity strategy',
    description: 'Portfolio positioning ideas and risk-aware opportunities for active investors.',
  },
  {
    title: 'Fixed income watch',
    description: 'Review of Treasury and credit dynamics with focused commentary.',
  },
]

function Research() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Research"
          title="Timely insights for disciplined investing."
          description="Access concise, professional analysis that supports high-confidence decisions."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report.title} className="rounded-3xl border border-border bg-background-subtle p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-secondary">{report.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{report.description}</p>
              <Link to={ROUTES.PUBLIC.CONTACT} className="link mt-5">
                Request access <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}

export default Research
