import { getApplications, saveApplication, updateApplication } from './storageService'

export function createApplication(payload) {
  const application = {
    applicationNumber: payload.applicationNumber,
    submissionDate: payload.submissionDate,
    personalInformation: payload.personalInformation,
    uploadedDocuments: payload.uploadedDocuments,
    status: payload.status || 'Submitted',
    assignedOfficer: payload.assignedOfficer || 'None',
    comments: payload.comments || '',
    rejectionReason: payload.rejectionReason || '',
    missingDocuments: payload.missingDocuments || [],
    timeline: payload.timeline || ['Submitted'],
  }

  return saveApplication(application)
}

export function listApplications() {
  return getApplications()
}

export function updateApplicationStatus(applicationNumber, updates) {
  const existing = getApplications().find((application) => application.applicationNumber === applicationNumber)
  const nextStatus = updates.status || existing?.status || 'Submitted'
  const nextTimeline = updates.timeline || (existing?.timeline ? (existing.timeline.at(-1) === nextStatus ? existing.timeline : [...existing.timeline, nextStatus]) : [nextStatus])

  return updateApplication(applicationNumber, {
    ...updates,
    status: nextStatus,
    timeline: nextTimeline,
    comments: updates.comments ?? existing?.comments ?? '',
    rejectionReason: updates.rejectionReason ?? existing?.rejectionReason ?? '',
    missingDocuments: updates.missingDocuments ?? existing?.missingDocuments ?? [],
  })
}
