import { BriefcaseBusiness, HandCoins, LineChart, ShieldCheck } from 'lucide-react'
import InfoCard from '../../../components/public/InfoCard'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'

const services = [
  {
    title: 'Brokerage services',
    description: 'Execute equity and fixed-income transactions with confidence through a premium client experience.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Treasury solutions',
    description: 'Access structured investment options and efficient portfolio funding capabilities.',
    icon: HandCoins,
  },
  {
    title: 'Market intelligence',
    description: 'Keep pace with fast-moving markets through timely analysis and decision support.',
    icon: LineChart,
  },
  {
    title: 'Compliance and custody',
    description: 'Enjoy well-governed onboarding, document handling, and secure servicing support.',
    icon: ShieldCheck,
  },
]

function Services() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Our services"
          title="Comprehensive capabilities for sophisticated investors."
          description="Every service is designed to support confident decisions with clarity, compliance, and efficiency."
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <InfoCard key={service.title} {...service} />
          ))}
        </div>
      </PageSection>
    </div>
  )
}

export default Services
