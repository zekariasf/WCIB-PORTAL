import { CircleDashed, Clock3, FileCheck2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import { useAppContext } from '../../../../context/AppContext'
import { ROUTES } from '../../../../constants/routes'

const statusConfig = {
  Submitted: [
    { label: 'Submitted', status: 'Completed' },
    { label: 'Under Review', status: 'In Progress' },
    { label: 'Decision', status: 'Pending' },
  ],
  'Under Review': [
    { label: 'Submitted', status: 'Completed' },
    { label: 'Under Review', status: 'In Progress' },
    { label: 'Decision', status: 'Pending' },
  ],
  'Document Missing': [
    { label: 'Submitted', status: 'Completed' },
    { label: 'Under Review', status: 'Completed' },
    { label: 'Document Missing', status: 'In Progress' },
  ],
  Rejected: [
    { label: 'Submitted', status: 'Completed' },
    { label: 'Under Review', status: 'Completed' },
    { label: 'Rejected', status: 'Completed' },
  ],
  Approved: [
    { label: 'Submitted', status: 'Completed' },
    { label: 'Under Review', status: 'Completed' },
    { label: 'Approved', status: 'Completed' },
  ],
}

function Tracking() {
  const { applications } = useAppContext()
  const [query, setQuery] = useState('')

  const normalizePhone = (value) => String(value || '').replace(/\D/g, '')

  const matchedApplication = useMemo(() => {
    if (!query) return applications[0] || null

    const searchTerm = normalizePhone(query)

    return applications.find((application) => {
      const appNumber = application.applicationNumber?.toLowerCase() || ''
      const mobile = normalizePhone(application.personalInformation?.mobile)
      return appNumber.includes(query.toLowerCase()) || mobile.includes(searchTerm)
    }) || null
  }, [applications, query])

  const milestones = matchedApplication ? statusConfig[matchedApplication.status] || statusConfig.Submitted : statusConfig.Submitted

  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Application tracking"
          title="Monitor your account opening progress in real time."
          description="Stay informed at every milestone with transparent updates and a clear next step."
          align="center"
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Application details</p>
            <div className="form-field mt-6">
              <label htmlFor="trackingQuery">Search by Application Number or Mobile Number</label>
              <input id="trackingQuery" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="WCIB2026000123 or +251 911 000 123" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm text-text-secondary">Application Number</p>
                <p className="mt-1 text-xl font-semibold text-secondary">{matchedApplication?.applicationNumber || 'No application found'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm text-text-secondary">Mobile Number</p>
                <p className="mt-1 text-xl font-semibold text-secondary">{matchedApplication?.personalInformation?.mobile || '—'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm text-text-secondary">Current status</p>
                <p className="mt-1 text-xl font-semibold text-secondary">{matchedApplication?.status || 'No application found'}</p>
              </div>
              {matchedApplication?.rejectionReason ? (
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm text-text-secondary">Rejection reason</p>
                  <p className="mt-1 text-sm text-secondary">{matchedApplication.rejectionReason}</p>
                </div>
              ) : null}
              {matchedApplication?.missingDocuments?.length ? (
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm text-text-secondary">Missing documents</p>
                  <p className="mt-1 text-sm text-secondary">{matchedApplication.missingDocuments.join(', ')}</p>
                </div>
              ) : null}
            </div>
            <div className="mt-8">
              <Button to={ROUTES.PUBLIC.CONTACT} variant="primary">Contact Brokerage</Button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-8 shadow-sm">
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.label} className="flex items-start gap-4 rounded-2xl border border-border bg-background-subtle p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${milestone.status === 'Completed' ? 'bg-primary-muted text-primary' : milestone.status === 'In Progress' ? 'bg-accent text-secondary' : 'bg-white text-text-secondary'}`}>
                    {milestone.status === 'Completed' ? <FileCheck2 className="h-5 w-5" /> : milestone.status === 'In Progress' ? <Clock3 className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-secondary">{milestone.label}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${milestone.status === 'Completed' ? 'bg-primary-muted text-primary' : milestone.status === 'In Progress' ? 'bg-accent text-secondary' : 'bg-white text-text-secondary'}`}>
                        {milestone.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      {index === 0 ? 'Your application has been received and acknowledged.' : index === 1 ? 'Documents have passed an initial review.' : index === 2 ? 'The compliance team is reviewing the submission.' : 'Pending the next review milestone.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default Tracking
