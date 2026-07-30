const STORAGE_KEYS = {
  applications: 'wegagen_applications',
  orders: 'wegagen_orders',
  settings: 'wegagen_settings',
}

const defaultSettings = {
  workflowStages: [
    'Submitted',
    'Document Verification',
    'Compliance Review',
    'Account Creation',
    'Trading Activation',
  ],
  depositAccounts: [
    { name: 'Primary Market Account', accountNumber: '100456730101' },
    { name: 'Secondary Market Account', accountNumber: '123009830102' },
  ],
  emailTemplates: {
    confirmation: 'Thank you for submitting your application. We will be in touch shortly.',
  },
  systemSettings: {
    defaultOfficer: 'A. Bekele',
    estimatedCompletionDays: 2,
  },
}

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback

  const storage = getStorage()
  const raw = storage?.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return

  const storage = getStorage()
  try {
    storage?.setItem(key, JSON.stringify(value))
  } catch {
    try {
      window.sessionStorage?.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage write errors so the app can continue in demo mode.
    }
  }

  window.dispatchEvent(new Event('wegagen:data-updated'))
}

function serializeDocuments(documents) {
  if (!Array.isArray(documents)) return documents
  if (typeof window === 'undefined') return documents

  return documents.map((documentItem, index) => {
    if (!documentItem?.fileDataUrl) return documentItem

    const storageKey = `wegagen_document_${Date.now()}_${Math.random().toString(36).slice(2)}_${index}`
    window.sessionStorage.setItem(storageKey, documentItem.fileDataUrl)

    const { fileDataUrl, ...rest } = documentItem
    return { ...rest, storageKey }
  })
}

function hydrateDocuments(documents) {
  if (!Array.isArray(documents)) return documents
  if (typeof window === 'undefined') return documents

  return documents.map((documentItem) => {
    if (!documentItem?.storageKey) return documentItem

    const fileDataUrl = window.sessionStorage.getItem(documentItem.storageKey)
    if (!fileDataUrl) return documentItem

    return { ...documentItem, fileDataUrl }
  })
}

function normalizeApplication(application) {
  if (!application) return application

  return {
    ...application,
    uploadedDocuments: hydrateDocuments(application.uploadedDocuments),
  }
}

export function initializeStorage() {
  if (typeof window === 'undefined') return

  const applications = readStorage(STORAGE_KEYS.applications, [])
  const orders = readStorage(STORAGE_KEYS.orders, [])
  const settings = readStorage(STORAGE_KEYS.settings, defaultSettings)

  if (!applications.length) {
    writeStorage(STORAGE_KEYS.applications, [])
  }

  if (!orders.length) {
    writeStorage(STORAGE_KEYS.orders, [])
  }

  if (!settings.workflowStages) {
    writeStorage(STORAGE_KEYS.settings, defaultSettings)
  }
}

export function getApplications() {
  return readStorage(STORAGE_KEYS.applications, []).map(normalizeApplication)
}

export function getOrders() {
  return readStorage(STORAGE_KEYS.orders, [])
}

export function getSettings() {
  return readStorage(STORAGE_KEYS.settings, defaultSettings)
}

export function saveApplication(application) {
  const applications = getApplications()
  const next = [...applications, normalizeApplication({ ...application, uploadedDocuments: serializeDocuments(application.uploadedDocuments) })]
  writeStorage(STORAGE_KEYS.applications, next)
  return next
}

export function updateApplication(applicationNumber, updates) {
  const applications = getApplications()
  const next = applications.map((app) => {
    if (app.applicationNumber !== applicationNumber) return app

    const updatedApplication = {
      ...app,
      ...updates,
      uploadedDocuments: updates.uploadedDocuments ? serializeDocuments(updates.uploadedDocuments) : app.uploadedDocuments,
    }

    return normalizeApplication(updatedApplication)
  })

  writeStorage(STORAGE_KEYS.applications, next)
  return next
}

export function saveOrder(order) {
  const orders = getOrders()
  const next = [...orders, order]
  writeStorage(STORAGE_KEYS.orders, next)
  return next
}

export function updateOrder(orderId, updates) {
  const orders = getOrders()
  const next = orders.map((order) => (order.id === orderId ? { ...order, ...updates } : order))
  writeStorage(STORAGE_KEYS.orders, next)
  return next
}

export function saveSettings(settings) {
  const next = { ...getSettings(), ...settings }
  writeStorage(STORAGE_KEYS.settings, next)
  return next
}

export function seedSampleData() {
  const applications = getApplications()
  const orders = getOrders()
  if (applications.length || orders.length) return { applications, orders }

  const sampleApplication = {
    applicationNumber: 'WCIB2026000123',
    submissionDate: '2026-07-30',
    personalInformation: {
      fullName: 'Abel Bekele',
      email: 'abel@sample.com',
      mobile: '+251 911 000 123',
      nationality: 'Ethiopian',
      occupation: 'Portfolio Manager',
      tin: '123456789',
      residentialAddress: 'Bole, Addis Ababa',
    },
    uploadedDocuments: [
      { name: 'Passport Photo.png', status: 'Approved' },
      { name: 'National ID Front.pdf', status: 'Approved' },
      { name: 'Signature.png', status: 'Approved' },
    ],
    status: 'Pending Review',
    assignedOfficer: 'A. Bekele',
    comments: 'Initial review submitted.',
    timeline: ['Submitted', 'Document Verification', 'Compliance Review'],
  }

  const sampleOrder = {
    id: 'ORD-2026001001',
    orderType: 'Secondary Market',
    clientName: 'Abel Bekele',
    brokerageAccount: '100456730101',
    symbol: 'WCIB',
    action: 'BUY',
    quantity: 100,
    status: 'Pending Review',
    submittedAt: '2026-07-30',
  }

  saveApplication(sampleApplication)
  saveOrder(sampleOrder)
  return { applications: [sampleApplication], orders: [sampleOrder] }
}
