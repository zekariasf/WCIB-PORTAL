import { ArrowDownToLine, BadgeCheck, CircleHelp, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import { ROUTES } from '../../../../constants/routes'

const faqs = [
  {
    question: 'Who can use Neway?',
    answer: 'Existing clients can access their accounts immediately, while new clients can open an account first.',
  },
  {
    question: 'How long does onboarding take?',
    answer: 'Most applications are reviewed and acknowledged within one business day.',
  },
  {
    question: 'What documents are required?',
    answer: 'You will need identity documents, a signature sample, and the standard account forms.',
  },
]

function Neway() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf5_100%)] shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Trade via Neway</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
              A professional gateway to modern market access.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              Use Neway to access trading workflows with intuitive tools, trusted onboarding, and responsive support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT} variant="primary">
                Open Trading Account
              </Button>
              <Button to={ROUTES.PUBLIC.BROKERAGE.FAQ} variant="outline">
                Review FAQ
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-md">
            <div className="space-y-4">
              {[
                ['Existing clients', 'Log in and access your account instantly.'],
                ['New clients', 'Complete onboarding and activate your profile.'],
                ['Download documents', 'Access forms and indemnity documents quickly.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-border bg-background-subtle p-4">
                  <h3 className="font-semibold text-secondary">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Download resources"
          title="Everything you need to get started with Neway."
          description="Choose the right path for your client profile and access the documents you need."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary">Existing clients</h3>
                <p className="mt-1 text-sm text-text-secondary">Use your active profile to place orders and manage your account.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">
                <ArrowDownToLine className="h-4 w-4" /> Download indemnity form
              </a>
              <Button to={ROUTES.PUBLIC.BROKERAGE.ORDERS} variant="outline">Place order</Button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary">New clients</h3>
                <p className="mt-1 text-sm text-text-secondary">Open your account first and gain access to the full brokerage suite.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to={ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT} variant="primary">Open Trading Account</Button>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading eyebrow="Benefits" title="Why clients prefer Neway." description="A streamlined workflow supported by professional guidance and modern tools." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['Secure onboarding', 'Protected document collection and guided compliance steps.'],
            ['Fast access', 'Move from application to trading with minimal friction.'],
            ['Responsive support', 'Reach a dedicated team whenever you need help.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.5rem] border border-border bg-background-subtle p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-secondary">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection className="rounded-[2rem] border border-border bg-background-subtle shadow-sm">
        <SectionHeading eyebrow="FAQ" title="Common questions about Neway." description="Everything you need to know before you begin." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-[1.5rem] border border-border bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <CircleHelp className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-secondary">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{faq.answer}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}

export default Neway
