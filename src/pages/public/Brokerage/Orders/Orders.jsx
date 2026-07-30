import { Copy, ReceiptText, ShieldAlert, UploadCloud, Wallet2 } from 'lucide-react'
import { useState } from 'react'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import { useAppContext } from '../../../../context/AppContext'
import { createOrder } from '../../../../services/orderService'
import { ROUTES } from '../../../../constants/routes'

const accountDetails = [
  { label: 'Primary Market Account', value: '100456730101' },
  { label: 'Secondary Market Account', value: '123009830102' },
]

const tickerCatalog = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 196.83 },
  { symbol: 'MSFT', company: 'Microsoft Corporation', price: 425.11 },
  { symbol: 'NVDA', company: 'NVIDIA Corporation', price: 121.19 },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 248.17 },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 182.23 },
  { symbol: 'META', company: 'Meta Platforms Inc.', price: 502.67 },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 174.57 },
  { symbol: 'JPM', company: 'JPMorgan Chase & Co.', price: 215.84 },
]

function Orders() {
  const { refreshData } = useAppContext()
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderForm, setOrderForm] = useState({
    market: 'secondary',
    brokerageAccount: '100456730101',
    csdNumber: '',
    fullName: 'John A. Mensah',
    email: 'john.mensah@client.com',
    company: 'Wegagen Capital',
    securitySymbol: 'AAPL',
    action: 'buy',
    quantity: '100',
    orderType: 'market',
    limitPrice: '',
    timeInForce: 'day',
    remarks: '',
  })
  const [selectedTicker, setSelectedTicker] = useState(tickerCatalog[0])
  const [receiptFileName, setReceiptFileName] = useState('')
  const [errors, setErrors] = useState({})

  const copyAccount = async (value) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setOrderForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))

    if (name === 'securitySymbol') {
      const match = tickerCatalog.find((item) => item.symbol.toLowerCase() === value.trim().toLowerCase())
      setSelectedTicker(match || null)
    }
  }

  const validateOrder = () => {
    const validationErrors = {}
    const requiredFields = ['brokerageAccount', 'csdNumber', 'fullName', 'email', 'company', 'securitySymbol', 'quantity']

    requiredFields.forEach((field) => {
      if (!orderForm[field] || !String(orderForm[field]).trim()) {
        validationErrors[field] = 'This field is required.'
      }
    })

    if (orderForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
      validationErrors.email = 'Please enter a valid email address.'
    }

    if (orderForm.quantity && Number(orderForm.quantity) <= 0) {
      validationErrors.quantity = 'Quantity must be greater than zero.'
    }

    if (orderForm.orderType === 'limit' && (!orderForm.limitPrice || Number(orderForm.limitPrice) <= 0)) {
      validationErrors.limitPrice = 'A limit price is required for limit orders.'
    }

    if (!receiptFileName) {
      validationErrors.receipt = 'Please upload a payment receipt.'
    }

    return validationErrors
  }

  const handleSubmit = () => {
    const validationErrors = validateOrder()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    createOrder({
      id: `ORD-${Date.now()}`,
      orderType: orderForm.market === 'treasury' ? 'Treasury Bills' : 'Secondary Market',
      clientName: orderForm.fullName,
      brokerageAccount: orderForm.brokerageAccount,
      symbol: orderForm.securitySymbol.toUpperCase(),
      action: orderForm.action.toUpperCase(),
      quantity: Number(orderForm.quantity),
      currentPrice: selectedTicker?.price || null,
      status: 'Pending Review',
      submittedAt: new Date().toISOString().slice(0, 10),
      paymentReceipt: receiptFileName,
      remarks: orderForm.remarks || 'Initial order request',
    })
    refreshData()
    setSubmitted(true)
  }

  return (
    <div className="bg-background">
      <PageSection className="rounded-[2rem] border border-border bg-white shadow-sm">
        <SectionHeading
          eyebrow="Place orders"
          title="Submit your brokerage order with clarity and confidence."
          description="Choose the market, review the funding instructions, and upload your payment receipt."
          align="center"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                  <Wallet2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary">Funding instructions</h3>
                  <p className="text-sm text-text-secondary">Use the brokerage account details below for payment.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {accountDetails.map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-sm font-semibold text-secondary">{label}</p>
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-background-subtle px-3 py-3">
                      <span className="font-mono text-sm text-secondary">{value}</span>
                      <button type="button" onClick={() => copyAccount(value)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">
                        <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-background-subtle p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary">Important notice</h3>
                  <p className="text-sm text-text-secondary">Include your brokerage account number in every payment reference.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Please include your brokerage account number, for example ETxxWCIBxxxxxxxx, in the payment reference to ensure faster reconciliation.
              </p>
              <p className="mt-3 text-sm font-semibold text-secondary">Brokerage email: brokerage@wegagen.com</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-8 shadow-sm">
            {!submitted ? (
              <>
                <div className="space-y-4">
                  <div className="form-field">
                    <label htmlFor="market">Choose Market</label>
                    <select id="market" name="market" value={orderForm.market} onChange={handleChange}>
                      <option value="secondary">Secondary Market</option>
                      <option value="treasury">Treasury Bills</option>
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-field">
                      <label htmlFor="brokerageAccount">Brokerage Account</label>
                      <input id="brokerageAccount" name="brokerageAccount" value={orderForm.brokerageAccount} onChange={handleChange} />
                      {errors.brokerageAccount ? <p className="mt-2 text-sm text-red-600">{errors.brokerageAccount}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="csdNumber">CSD Number</label>
                      <input id="csdNumber" name="csdNumber" value={orderForm.csdNumber} onChange={handleChange} placeholder="CSD number" />
                      {errors.csdNumber ? <p className="mt-2 text-sm text-red-600">{errors.csdNumber}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="fullName">Full Name</label>
                      <input id="fullName" name="fullName" value={orderForm.fullName} onChange={handleChange} placeholder="Full name" />
                      {errors.fullName ? <p className="mt-2 text-sm text-red-600">{errors.fullName}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" value={orderForm.email} onChange={handleChange} placeholder="Email" />
                      {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="company">Company</label>
                      <input id="company" name="company" value={orderForm.company} onChange={handleChange} placeholder="Company" />
                      {errors.company ? <p className="mt-2 text-sm text-red-600">{errors.company}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="securitySymbol">Security Symbol</label>
                      <input id="securitySymbol" name="securitySymbol" value={orderForm.securitySymbol} onChange={handleChange} placeholder="Symbol" list="ticker-options" />
                      <datalist id="ticker-options">
                        {tickerCatalog.map((item) => (
                          <option key={item.symbol} value={item.symbol} />
                        ))}
                      </datalist>
                      {errors.securitySymbol ? <p className="mt-2 text-sm text-red-600">{errors.securitySymbol}</p> : null}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-primary/20 bg-primary-muted/40 p-4 text-sm text-secondary">
                    {selectedTicker ? (
                      <p><span className="font-semibold">Live quote:</span> {selectedTicker.symbol} • {selectedTicker.company} • ${selectedTicker.price.toFixed(2)}</p>
                    ) : (
                      <p>Enter a supported ticker to pull in the latest live price.</p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-field">
                      <label htmlFor="action">Action</label>
                      <select id="action" name="action" value={orderForm.action} onChange={handleChange}>
                        <option value="buy">BUY</option>
                        <option value="sell">SELL</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="quantity">Quantity</label>
                      <input id="quantity" name="quantity" type="number" value={orderForm.quantity} onChange={handleChange} placeholder="Quantity" />
                      {errors.quantity ? <p className="mt-2 text-sm text-red-600">{errors.quantity}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="orderType">Order Type</label>
                      <select id="orderType" name="orderType" value={orderForm.orderType} onChange={handleChange}>
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="limitPrice">Limit Price</label>
                      <input id="limitPrice" name="limitPrice" value={orderForm.limitPrice} onChange={handleChange} placeholder="0.00" />
                      {errors.limitPrice ? <p className="mt-2 text-sm text-red-600">{errors.limitPrice}</p> : null}
                    </div>
                    <div className="form-field">
                      <label htmlFor="timeInForce">Time in Force</label>
                      <select id="timeInForce" name="timeInForce" value={orderForm.timeInForce} onChange={handleChange}>
                        <option value="day">Day</option>
                        <option value="ioc">IOC</option>
                        <option value="gtc">GTC</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="remarks">Remarks</label>
                      <input id="remarks" name="remarks" value={orderForm.remarks} onChange={handleChange} placeholder="Optional remarks" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-border bg-background-subtle p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary">Upload Payment Receipt</p>
                        <p className="mt-1 text-sm text-text-secondary">Upload your receipt to support the order request.</p>
                      </div>
                    </div>
                    <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-primary/50 bg-white p-4 text-center">
                      <UploadCloud className="h-6 w-6 text-primary" />
                      <span className="mt-2 text-sm font-semibold text-secondary">Choose receipt</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(event) => {
                        const uploadedFile = event.target.files?.[0]
                        if (uploadedFile) {
                          setReceiptFileName(uploadedFile.name)
                          setErrors((previous) => ({ ...previous, receipt: '' }))
                        }
                      }} />
                    </label>
                    {errors.receipt ? <p className="mt-2 text-sm text-red-600">{errors.receipt}</p> : null}
                    {receiptFileName ? <p className="mt-2 text-sm text-secondary">Selected file: {receiptFileName}</p> : null}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
                    Submit Order
                  </button>
                  <Button to={ROUTES.PUBLIC.BROKERAGE.NEWAY} variant="outline">Trade via Neway</Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <ReceiptText className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-secondary">Order submitted successfully</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">Your order request has been received and queued for review.</p>
                <div className="mt-6 rounded-2xl border border-border bg-background-subtle p-5 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Reference</p>
                  <p className="mt-2 text-xl font-semibold text-secondary">ORD-2026001234</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageSection>
    </div>
  )
}

export default Orders
