import { CheckCircle2, CircleCheckBig, FileText, ShieldCheck, Trash2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import { useAppContext } from '../../../../context/AppContext'
import { createApplication } from '../../../../services/applicationService'
import { ROUTES } from '../../../../constants/routes'

const steps = ['Personal Information', 'Upload Documents', 'Review']

const documentOptions = [
  { title: 'Passport Photo', description: 'Clear front-facing photo in JPG or PNG format.', accepted: 'JPG, PNG', maxSize: '2MB' },
  { title: 'Signature', description: 'A legible signature image on a plain background.', accepted: 'JPG, PNG', maxSize: '1MB' },
  { title: 'National ID', description: 'Front and back scans in a single PDF file.', accepted: 'PDF', maxSize: '5MB' },
  { title: 'Account Opening Form', description: 'Completed account form with client details.', accepted: 'PDF', maxSize: '5MB' },
  { title: 'Indemnity Form', description: 'Signed indemnity document for onboarding.', accepted: 'PDF', maxSize: '5MB' },
  { title: 'TIN Certificate', description: 'Tax identification certificate for verification.', accepted: 'PDF', maxSize: '5MB' },
]

const requiredDocumentTypes = documentOptions.filter((document) => document.title !== 'TIN Certificate').map((document) => document.title)

function OpenAccount() {
  const { refreshData } = useAppContext()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNumber] = useState(`WCIB2026000${Math.floor(1000 + Math.random() * 9000)}`)
  const [formData, setFormData] = useState({
    fullName: 'John A. Mensah',
    gender: 'Male',
    dateOfBirth: '1990-04-12',
    nationality: 'Ethiopian',
    occupation: 'Investment Analyst',
    email: 'john.mensah@client.com',
    mobile: '+251 911 000 123',
    tin: '123456789',
    residentialAddress: 'Bole, Addis Ababa',
  })
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [isCertified, setIsCertified] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const handleFileUpload = async (documentType, event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const nextFiles = await Promise.all(files.map(async (file) => {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Unable to read file'))
        reader.readAsDataURL(file)
      })

      return {
        documentType,
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        status: 'Uploaded',
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileDataUrl: dataUrl,
      }
    }))

    setUploadedDocuments((previous) => [
      ...previous.filter((item) => item.documentType !== documentType),
      ...nextFiles,
    ])
    setErrors((previous) => ({ ...previous, documents: '' }))
  }

  const removeDocument = (documentType) => {
    setUploadedDocuments((previous) => previous.filter((item) => item.documentType !== documentType))
  }

  const validatePersonalInformation = () => {
    const validationErrors = {}
    const requiredFields = ['fullName', 'gender', 'dateOfBirth', 'nationality', 'occupation', 'mobile', 'email', 'residentialAddress']

    requiredFields.forEach((field) => {
      const value = formData[field]
      if (!value || !String(value).trim()) {
        validationErrors[field] = 'This field is required.'
      }
    })

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email address.'
    }

    if (formData.mobile && !/^\+?[0-9\s-]{7,15}$/.test(formData.mobile)) {
      validationErrors.mobile = 'Please enter a valid mobile number.'
    }

    return validationErrors
  }

  const handleNext = () => {
    if (step === 1) {
      const validationErrors = validatePersonalInformation()
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors)
        return
      }
    }

    if (step === 2) {
      const missingDocuments = requiredDocumentTypes.filter((documentType) => !uploadedDocuments.some((item) => item.documentType === documentType))
      if (missingDocuments.length) {
        setErrors((previous) => ({ ...previous, documents: 'Please upload every required document before continuing.' }))
        return
      }
    }

    if (step < steps.length) {
      const nextStep = step + 1
      setStep(nextStep)
      setProgress(Math.round((nextStep / steps.length) * 100))
      setErrors({})
    }
  }

  const handleSubmit = () => {
    if (!isCertified) {
      setErrors((previous) => ({ ...previous, certified: 'Please confirm the accuracy of your information.' }))
      return
    }

    createApplication({
      applicationNumber,
      submissionDate: new Date().toISOString().slice(0, 10),
      personalInformation: formData,
      uploadedDocuments,
      status: 'Submitted',
      assignedOfficer: 'None',
      comments: '',
      timeline: ['Submitted'],
    })
    refreshData()
    setSubmitted(true)
    setProgress(100)
  }

  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Open trading account"
          title="Start your brokerage journey in three guided steps."
          description="The process is secure, transparent, and tailored for a premium client experience."
          align="center"
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {steps.map((item, index) => {
            const active = index + 1 === step
            const complete = index + 1 < step
            return (
              <div key={item} className={`rounded-full px-3 py-2 text-sm font-medium ${active ? 'bg-primary-muted text-primary' : complete ? 'bg-background-subtle text-secondary' : 'border border-border text-text-secondary'}`}>
                {complete ? <span className="mr-2 inline-flex">✓</span> : null}
                {item}
              </div>
            )
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Step {step}</p>
                <h2 className="text-2xl font-semibold text-secondary">{steps[step - 1]}</h2>
              </div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm text-text-secondary">{progress}% complete</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Recommended for</p>
                <p className="mt-2 text-sm leading-7 text-text-secondary">Individual investors, corporate clients, and private wealth portfolios.</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Support</p>
                <p className="mt-2 text-sm leading-7 text-text-secondary">Our brokerage desk will review your filing and respond promptly.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-8 shadow-sm">
            {!submitted ? (
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-primary/30 bg-primary-muted p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Already submitted?</p>
                      <p className="mt-2 text-sm leading-7 text-secondary">If you have already requested an account opening, check your current status here before starting a new request.</p>
                      <div className="mt-4">
                        <Button to={ROUTES.PUBLIC.BROKERAGE.TRACKING} variant="primary">
                          Check my status
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="form-field">
                        <label htmlFor="fullName">Full Name</label>
                        <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
                        {errors.fullName ? <p className="mt-2 text-sm text-red-600">{errors.fullName}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="gender">Gender</label>
                        <input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="Select gender" />
                        {errors.gender ? <p className="mt-2 text-sm text-red-600">{errors.gender}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                        {errors.dateOfBirth ? <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="nationality">Nationality</label>
                        <input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
                        {errors.nationality ? <p className="mt-2 text-sm text-red-600">{errors.nationality}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="occupation">Occupation</label>
                        <input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" />
                        {errors.occupation ? <p className="mt-2 text-sm text-red-600">{errors.occupation}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="mobile">Mobile</label>
                        <input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile number" />
                        {errors.mobile ? <p className="mt-2 text-sm text-red-600">{errors.mobile}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" />
                        {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
                      </div>
                      <div className="form-field">
                        <label htmlFor="tin">TIN Number</label>
                        <input id="tin" name="tin" value={formData.tin} onChange={handleChange} placeholder="TIN number" />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="residentialAddress">Residential Address</label>
                      <textarea id="residentialAddress" name="residentialAddress" rows="3" value={formData.residentialAddress} onChange={handleChange} placeholder="Residential address" />
                      {errors.residentialAddress ? <p className="mt-2 text-sm text-red-600">{errors.residentialAddress}</p> : null}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {documentOptions.map((document) => (
                        <div key={document.title} className="rounded-2xl border border-border bg-background-subtle p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-secondary">{document.title}</h3>
                              <p className="mt-1 text-sm leading-7 text-text-secondary">{document.description}</p>
                              <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-text-secondary">{document.accepted} • Max {document.maxSize}</p>
                            </div>
                          </div>

                          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-primary/50 bg-white p-4 text-center">
                            <UploadCloud className="h-6 w-6 text-primary" />
                            <span className="mt-2 text-sm font-semibold text-secondary">Upload {document.title}</span>
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" onChange={(event) => handleFileUpload(document.title, event)} />
                          </label>

                          {uploadedDocuments.some((item) => item.documentType === document.title) ? (
                            <div className="mt-3 space-y-2">
                              {uploadedDocuments.filter((item) => item.documentType === document.title).map((documentItem) => (
                                <div key={`${document.title}-${documentItem.name}`} className="flex items-center justify-between rounded-2xl border border-border bg-white px-3 py-3 text-sm text-text-secondary">
                                  <div>
                                    <p className="font-medium text-secondary">{documentItem.name}</p>
                                    <p className="text-xs text-text-secondary">{documentItem.size} • {documentItem.status}</p>
                                  </div>
                                  <button type="button" onClick={() => removeDocument(document.title)} className="rounded-lg border border-border p-2 text-secondary hover:border-primary hover:text-primary">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {errors.documents ? <p className="text-sm text-red-600">{errors.documents}</p> : null}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-border bg-background-subtle p-5">
                      <h3 className="font-semibold text-secondary">Application summary</h3>
                      <div className="mt-4 space-y-2 text-sm text-text-secondary">
                        <p><span className="font-semibold text-secondary">Name:</span> {formData.fullName}</p>
                        <p><span className="font-semibold text-secondary">Email:</span> {formData.email}</p>
                        <p><span className="font-semibold text-secondary">TIN:</span> {formData.tin}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background-subtle p-5">
                      <h3 className="font-semibold text-secondary">Uploaded files</h3>
                      <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                        {uploadedDocuments.length ? uploadedDocuments.map((document) => (
                          <li key={document.name} className="flex items-center gap-2">
                            <CircleCheckBig className="h-4 w-4 text-primary" />
                            {document.name}
                          </li>
                        )) : (
                          <li className="text-text-secondary">No documents uploaded yet.</li>
                        )}
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 rounded-2xl border border-border bg-background-subtle p-4 text-sm text-text-secondary">
                      <input type="checkbox" checked={isCertified} onChange={() => { setIsCertified((previous) => !previous); setErrors((previous) => ({ ...previous, certified: '' })) }} className="mt-1 h-4 w-4 rounded border-border text-primary" />
                      <span>I certify that the information provided is complete and accurate.</span>
                    </label>
                    {errors.certified ? <p className="text-sm text-red-600">{errors.certified}</p> : null}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {step > 1 && (
                    <button type="button" onClick={() => { const previousStep = step - 1; setStep(previousStep); setProgress(Math.max(33, Math.round((previousStep / steps.length) * 100))) }} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">
                      Back
                    </button>
                  )}
                  {step < steps.length ? (
                    <button type="button" onClick={handleNext} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
                      Continue
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
                      Submit Application
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-secondary">Application submitted successfully</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">Your application reference is ready. A representative will be in touch shortly.</p>
                <div className="mt-6 rounded-2xl border border-border bg-background-subtle p-5 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Reference number</p>
                  <p className="mt-2 text-2xl font-semibold tracking-wide text-secondary">{applicationNumber}</p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button to={ROUTES.PUBLIC.BROKERAGE.TRACKING} variant="primary">
                    View Tracking
                  </Button>
                  <Button to={ROUTES.PUBLIC.BROKERAGE.NEWAY} variant="outline">
                    Trade via Neway
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default OpenAccount
