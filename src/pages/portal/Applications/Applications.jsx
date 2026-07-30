import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { updateApplicationStatus } from '../../../services/applicationService'
import { ROUTES } from '../../../constants/routes'

const officerOptions = ['A. Bekele', 'M. Tadesse', 'S. Alemu', 'L. Worku']
const statusOptions = ['Submitted', 'Under Review', 'Document Missing', 'Rejected', 'Approved']
const rejectionReasons = [
  'Incomplete documentation',
  'Identity verification mismatch',
  'Missing signature',
  'Client requested correction',
  'Compliance issue',
]

function Applications() {
  const { applications, refreshData, setApplications } = useAppContext()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [reviewDraft, setReviewDraft] = useState({ assignedOfficer: 'A. Bekele', status: 'Submitted', reviewNotes: '', rejectionReason: '', missingDocuments: '' })

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.replace(/\D/g, '')

    return applications.filter((application) => {
      const phone = `${application.personalInformation?.mobile || ''}`.replace(/\D/g, '')
      const matchesSearch = `${application.applicationNumber} ${application.personalInformation?.fullName} ${phone}`.toLowerCase().includes(search.toLowerCase()) || (normalizedSearch && phone.includes(normalizedSearch))
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, search, statusFilter])

  useEffect(() => {
    if (selectedApplication) {
      setReviewDraft({
        assignedOfficer: selectedApplication.assignedOfficer || 'A. Bekele',
        status: selectedApplication.status || 'Submitted',
        reviewNotes: selectedApplication.comments || '',
        rejectionReason: selectedApplication.rejectionReason || '',
        missingDocuments: (selectedApplication.missingDocuments || []).join(', '),
      })
    }
  }, [selectedApplication])

  const updateStatus = (applicationNumber, status) => {
    const existing = applications.find((app) => app.applicationNumber === applicationNumber)
    const nextTimeline = Array.isArray(existing?.timeline) && existing.timeline.at(-1) === status
      ? existing.timeline
      : [...(existing?.timeline || []), status]

    const nextApplications = updateApplicationStatus(applicationNumber, {
      status,
      assignedOfficer: reviewDraft.assignedOfficer,
      comments: reviewDraft.reviewNotes,
      rejectionReason: status === 'Rejected' ? reviewDraft.rejectionReason : '',
      missingDocuments: status === 'Document Missing' ? reviewDraft.missingDocuments.split(',').map((item) => item.trim()).filter(Boolean) : [],
      timeline: nextTimeline,
    })

    setApplications(nextApplications)
    refreshData()
    setSelectedApplication(nextApplications.find((app) => app.applicationNumber === applicationNumber) || null)
  }

  const openDocument = (documentItem) => {
    if (!documentItem.fileDataUrl) return

    const previewWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!previewWindow) return

    if (documentItem.fileType?.startsWith('image/')) {
      previewWindow.document.write(`<img src="${documentItem.fileDataUrl}" alt="${documentItem.name}" style="max-width:100%;height:auto;" />`)
      previewWindow.document.title = documentItem.name
      return
    }

    if (documentItem.fileType === 'application/pdf') {
      previewWindow.location.href = documentItem.fileDataUrl
      return
    }

    previewWindow.document.write(`<pre>${documentItem.name}</pre>`)
    previewWindow.document.title = documentItem.name
  }

  const downloadDocument = (documentItem) => {
    const fileName = documentItem.name || `${documentItem.documentType || 'document'}.bin`

    if (documentItem.fileDataUrl) {
      const anchor = document.createElement('a')
      anchor.href = documentItem.fileDataUrl
      anchor.download = fileName
      anchor.click()
      return
    }

    const fallbackBlob = new Blob([
      `Document: ${documentItem.name || documentItem.documentType || 'Uploaded document'}\n`,
      `Type: ${documentItem.documentType || 'Unknown'}\n`,
      `Size: ${documentItem.size || 'Unknown'}\n`,
      `Uploaded: ${documentItem.uploadedAt || 'Unknown'}\n`,
    ], { type: 'text/plain;charset=utf-8' })

    const url = URL.createObjectURL(fallbackBlob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${fileName}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const saveReview = () => {
    if (!selectedApplication) return

    const nextApplications = updateApplicationStatus(selectedApplication.applicationNumber, {
      assignedOfficer: reviewDraft.assignedOfficer,
      comments: reviewDraft.reviewNotes,
      status: reviewDraft.status,
      rejectionReason: reviewDraft.status === 'Rejected' ? reviewDraft.rejectionReason : '',
      missingDocuments: reviewDraft.status === 'Document Missing' ? reviewDraft.missingDocuments.split(',').map((item) => item.trim()).filter(Boolean) : [],
      timeline: selectedApplication.timeline || ['Submitted'],
    })

    setApplications(nextApplications)
    refreshData()
    setSelectedApplication(nextApplications.find((app) => app.applicationNumber === selectedApplication.applicationNumber) || null)
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Applications</p>
          <h1 className="mt-2 text-3xl font-semibold text-secondary">Case management</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search application" className="rounded-xl border border-border bg-background-subtle px-3.5 py-2.5 text-sm" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-border bg-background-subtle px-3.5 py-2.5 text-sm">
            <option value="All">All</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-background-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Application</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.applicationNumber} className="border-t border-border hover:bg-background-subtle">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelectedApplication(application)} className="text-left font-semibold text-secondary">{application.applicationNumber}</button>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{application.personalInformation?.fullName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-secondary">{application.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedApplication ? (
          <div className="rounded-[1.5rem] border border-border bg-background-subtle p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Selected application</p>
            <h2 className="mt-3 text-2xl font-semibold text-secondary">{selectedApplication.applicationNumber}</h2>
            <p className="mt-2 text-sm text-text-secondary">{selectedApplication.personalInformation?.fullName}</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Current status</p>
                <select value={reviewDraft.status} onChange={(event) => setReviewDraft((previous) => ({ ...previous, status: event.target.value }))} className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm">
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Assignment</p>
                <select value={reviewDraft.assignedOfficer} onChange={(event) => setReviewDraft((previous) => ({ ...previous, assignedOfficer: event.target.value }))} className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm">
                  {officerOptions.map((officer) => <option key={officer} value={officer}>{officer}</option>)}
                </select>
              </div>
              {reviewDraft.status === 'Rejected' ? (
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold text-secondary">Rejection reason</p>
                  <select value={reviewDraft.rejectionReason} onChange={(event) => setReviewDraft((previous) => ({ ...previous, rejectionReason: event.target.value }))} className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm">
                    <option value="">Select reason</option>
                    {rejectionReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                  </select>
                </div>
              ) : null}
              {reviewDraft.status === 'Document Missing' ? (
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold text-secondary">Missing documents</p>
                  <textarea value={reviewDraft.missingDocuments} onChange={(event) => setReviewDraft((previous) => ({ ...previous, missingDocuments: event.target.value }))} rows="3" className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm" placeholder="List missing documents" />
                </div>
              ) : null}
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Review notes</p>
                <textarea value={reviewDraft.reviewNotes} onChange={(event) => setReviewDraft((previous) => ({ ...previous, reviewNotes: event.target.value }))} rows="4" className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm" placeholder="Add notes for the client or compliance team" />
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Documents</p>
                <div className="mt-3 space-y-3">
                  {selectedApplication.uploadedDocuments?.map((doc) => (
                    <div key={`${doc.documentType}-${doc.name}`} className="rounded-xl border border-border bg-background-subtle p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-secondary">{doc.name}</p>
                          <p className="mt-1 text-xs text-text-secondary">{doc.documentType} • {doc.size}</p>
                        </div>
                        <div className="flex gap-2">
                          {doc.fileDataUrl ? <button type="button" onClick={() => openDocument(doc)} className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-secondary">Open</button> : null}
                          <button type="button" onClick={() => downloadDocument(doc)} className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-secondary">Download</button>
                        </div>
                      </div>
                      {doc.fileDataUrl ? (
                        <div className="mt-3 rounded-xl border border-border bg-white p-2">
                          {doc.fileType?.startsWith('image/') ? (
                            <img src={doc.fileDataUrl} alt={doc.name} className="max-h-56 w-full rounded-lg object-contain" />
                          ) : doc.fileType === 'application/pdf' ? (
                            <iframe src={doc.fileDataUrl} title={doc.name} className="h-64 w-full rounded-lg border-0" />
                          ) : (
                            <p className="text-sm text-text-secondary">Preview is available for images and PDF files.</p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={saveReview} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Save review</button>
                <button type="button" onClick={() => navigate(ROUTES.PUBLIC.BROKERAGE.TRACKING)} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Open tracking</button>
                <button type="button" onClick={() => updateStatus(selectedApplication.applicationNumber, 'Approved')} className="rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-text-on-primary">Approve</button>
                <button type="button" onClick={() => updateStatus(selectedApplication.applicationNumber, 'Rejected')} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Reject</button>
                <button type="button" onClick={() => updateStatus(selectedApplication.applicationNumber, 'Document Missing')} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Mark missing</button>
                <button type="button" onClick={() => updateStatus(selectedApplication.applicationNumber, 'Under Review')} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Under review</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-border bg-background-subtle p-6 text-text-secondary">Select an application to view full details.</div>
        )}
      </div>
    </div>
  )
}

export default Applications
