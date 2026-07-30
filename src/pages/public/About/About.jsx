import { Building2, Compass, Handshake, ShieldCheck } from 'lucide-react'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'
import InfoCard from '../../../components/public/InfoCard'

const pillars = [
  {
    title: 'Client-first advisory',
    description: 'We combine deep market expertise with a disciplined, personalized approach to wealth creation.',
    icon: Handshake,
  },
  {
    title: 'Institutional discipline',
    description: 'Our processes, controls, and governance are built to support investors with confidence.',
    icon: ShieldCheck,
  },
  {
    title: 'Global perspective',
    description: 'We connect clients to opportunities across markets with transparent execution and insight.',
    icon: Compass,
  },
  {
    title: 'Long-term partnership',
    description: 'Our commitment extends beyond transactions, supporting growth through every market cycle.',
    icon: Building2,
  },
]

function About() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="About Wegagen Capital"
          title="A premium investment bank with a modern client experience."
          description="We guide investors through high-conviction markets with a combination of research, execution, and thoughtful service."
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pillars.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-8 rounded-[2rem] border border-border bg-background-subtle p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Our promise</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-secondary">
              Professional, trusted, and built for modern capital markets.
            </h2>
            <p className="mt-4 text-lg leading-8 text-text-secondary">
              We combine the rigor of an investment bank with the accessibility of a digital-first brokerage platform.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
            <div className="space-y-3">
              {[
                ['Capital markets expertise', 'Cross-market insight and execution support.'],
                ['Seamless onboarding', 'Structured guidance from application to activation.'],
                ['Responsive client care', 'Dedicated support for every milestone.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-border bg-background-subtle px-4 py-4">
                  <h3 className="font-semibold text-secondary">{title}</h3>
                  <p className="mt-1 text-sm leading-7 text-text-secondary">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default About
