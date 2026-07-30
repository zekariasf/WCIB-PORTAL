import { Mail, MapPin, Phone } from 'lucide-react'
import PageSection from '../../../components/public/PageSection'
import SectionHeading from '../../../components/public/SectionHeading'

function Contact() {
  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Contact"
          title="Speak with a brokerage specialist."
          description="We are ready to help you with account opening, order placement, or general inquiries."
          align="center"
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
            <h3 className="text-2xl font-semibold text-secondary">Get in touch</h3>
            <div className="mt-6 space-y-4">
              {[
                { icon: Phone, label: 'Call us', value: '+251 11 000 0000' },
                { icon: Mail, label: 'Email', value: 'info@wegagen.com' },
                { icon: MapPin, label: 'Visit', value: 'Addis Ababa, Ethiopia' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary">{label}</p>
                    <p className="text-sm text-text-secondary">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
            <h3 className="text-2xl font-semibold text-secondary">Prefer a callback?</h3>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Share your details and our team will contact you shortly with the most relevant guidance.
            </p>
            <div className="mt-6 space-y-4">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input id="name" placeholder="Enter your name" />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Enter your email" />
              </div>
              <button type="button" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
                Request callback
              </button>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default Contact
