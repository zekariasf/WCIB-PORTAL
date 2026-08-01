import { Copy, Info, ReceiptText, ShieldAlert, UploadCloud, Wallet2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import Button from '../../../../components/buttons/Button'
import PageSection from '../../../../components/public/PageSection'
import SectionHeading from '../../../../components/public/SectionHeading'
import { useAppContext } from '../../../../context/AppContext'
import { createOrder } from '../../../../services/orderService'
import { ROUTES } from '../../../../constants/routes'

const accountDetails = {
  secondary: [
    { label: 'Bank', value: 'Wegagen Bank S.C' },
    { label: 'Account Name', value: 'Wegagen Capital Secondary Market Account' },
    { label: 'Account Number', value: '100456730101' },
  ],
  treasury: [
    { label: 'Bank', value: 'Wegagen Bank S.C' },
    { label: 'Account Name', value: 'Wegagen Capital Primary Account' },
    { label: 'Account Number', value: '1000740234319' },
  ],
}

const marketSteps = {
  secondary: [
    'Deposit funds into the secondary market brokerage account.',
    'Upload your payment receipt below.',
    'Submit the order for review and confirmation.',
  ],
  treasury: [
    'Deposit funds into the primary market account to secure your bid.',
    'Upload your receipt once payment is complete.',
    'Submit your T-Bill order for review.',
  ],
}

const tickerCatalog = [
  { symbol: 'BOA', company: 'Bank of Abyssinia', price: 82.5 },
  { symbol: 'AWBB', company: 'Awash Bank', price: 74.3 },
  { symbol: 'DSHB', company: 'Dashen Bank', price: 65.1 },
  { symbol: 'NYAL', company: 'Nyala Insurance', price: 38.2 },
  { symbol: 'AIC', company: 'Africa Insurance Company', price: 52.4 },
  { symbol: 'BGI', company: 'BGI Ethiopia', price: 121.9 },
]

function Orders() {
  const { refreshData } = useAppContext()
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderReference, setOrderReference] = useState('')
  const [orderForm, setOrderForm] = useState({
    market: 'secondary',
    brokerageAccountBranch: '',
    brokerageAccountNumber: '',
    firstName: '',
    fathersName: '',
    grandfathersName: '',
    email: '',
    securitySymbol: '',
    quantity: '',
    action: 'buy',
    orderType: 'market',
    timeInForce: 'day',
    limitPrice: '',
    remarks: '',
  })

  const [errors, setErrors] = useState({})
  const [orderReview, setOrderReview] = useState(false)
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [bids, setBids] = useState([])
  const [auctionDate, setAuctionDate] = useState('')
  const [tenor, setTenor] = useState('28')
  const [receiptFileName, setReceiptFileName] = useState('')
  const [receiptFileDataUrl, setReceiptFileDataUrl] = useState('')

  const TBILL_FACE_VALUE = 5000
  const MIN_COMMISSION = 100
  const RATES = {
    secondary: { commission: 0.002, esx: 0.0005, ecma: 0.0002 },
    treasury: { commission: 0.0005, esx: 0.0001, ecma: 0.00005 },
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setOrderForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setOrderReview(false)

    if (name === 'securitySymbol') {
      const match = tickerCatalog.find((item) => item.symbol.toLowerCase() === value.trim().toLowerCase())
      setSelectedTicker(match || null)
    }
  }

  const copyAccount = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // ignore clipboard errors
    }
  }


  const getDefaultAuctionDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toISOString().slice(0, 10)
  }

  const selectMarket = (market) => {
    setOrderForm((previous) => ({
      ...previous,
      market,
      securitySymbol: market === 'treasury' ? 'TBILL' : '',
      orderType: market === 'treasury' ? 'market' : previous.orderType,
      timeInForce: market === 'treasury' ? previous.timeInForce : previous.timeInForce,
    }))
    setOrderReview(false)
    setErrors((previous) => ({ ...previous, market: '' }))
    setReceiptFileName('')
    setReceiptFileDataUrl('')

    if (market === 'treasury') {
      setAuctionDate(getDefaultAuctionDate())
      setTenor('28')
      setBids([{ quantity: '', annualizedYield: '' }])
      setSelectedTicker(null)
    } else {
      setAuctionDate('')
      setTenor('')
      setBids([])
      setSelectedTicker(null)
    }
  }

  const treasuryTotalQuantity = bids.reduce((sum, bid) => sum + (Number(bid.quantity) > 0 ? Number(bid.quantity) : 0), 0)

  const addBid = () => {
    setBids((previous) => [...previous, { quantity: '', annualizedYield: '' }])
  }

  const updateBid = (index, field, value) => {
    setBids((previous) => previous.map((bid, bidIndex) => bidIndex === index ? { ...bid, [field]: value } : bid))
  }

  const validateOrder = () => {
    const validationErrors = {}
    const requiredFields = ['brokerageAccountBranch', 'brokerageAccountNumber', 'firstName', 'fathersName', 'grandfathersName', 'email', 'securitySymbol']
    if (orderForm.market !== 'treasury') {
      requiredFields.push('quantity', 'timeInForce')
    }

    requiredFields.forEach((field) => {
      if (!orderForm[field] || !String(orderForm[field]).trim()) {
        validationErrors[field] = 'This field is required.'
      }
    })
    if (orderForm.brokerageAccountBranch && orderForm.brokerageAccountBranch.length !== 2) {
      validationErrors.brokerageAccountBranch = 'Enter 2 characters.'
    }
    if (orderForm.brokerageAccountNumber && orderForm.brokerageAccountNumber.length !== 8) {
      validationErrors.brokerageAccountNumber = 'Enter 8 characters.'
    }

    if (orderForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
      validationErrors.email = 'Please enter a valid email address.'
    }

    if (orderForm.market !== 'treasury' && orderForm.quantity && Number(orderForm.quantity) <= 0) {
      validationErrors.quantity = 'Quantity must be greater than zero.'
    }

    if (orderForm.orderType === 'limit' && (!orderForm.limitPrice || Number(orderForm.limitPrice) <= 0)) {
      validationErrors.limitPrice = 'A limit price is required for limit orders.'
    }


    if (orderForm.market === 'treasury') {
      if (!auctionDate) {
        validationErrors.auctionDate = 'Auction date is required.'
      }
      if (!tenor) {
        validationErrors.tenor = 'Please select a tenor.'
      }
      if (treasuryTotalQuantity <= 0) {
        validationErrors.quantity = 'Total bid quantity must be greater than zero.'
      }
      bids.forEach((bid, index) => {
        if (!bid.quantity || Number(bid.quantity) <= 0) {
          validationErrors[`bid_quantity_${index}`] = 'Please enter a bid quantity.'
        }
        if (!bid.annualizedYield || Number(bid.annualizedYield) <= 0) {
          validationErrors[`bid_yield_${index}`] = 'Please enter an annualized yield.'
        }
      })
    }

    return validationErrors
  }

  const feeBreakdown = useMemo(() => {
    // compute notional
    let notional = 0
    if (orderForm.market === 'treasury') {
      const totalQty = bids.reduce((sum, b) => sum + (Number(b.quantity) > 0 ? Number(b.quantity) : 0), 0)
      notional = totalQty * TBILL_FACE_VALUE
    } else {
      const qty = Number(orderForm.quantity) || 0
      const unitPrice = orderForm.orderType === 'limit' && orderForm.limitPrice ? Number(orderForm.limitPrice) : (selectedTicker?.price || 0)
      notional = qty * unitPrice
    }

    const market = orderForm.market === 'treasury' ? 'treasury' : 'secondary'
    const rates = RATES[market]
    const commissionRaw = notional * rates.commission
    const commission = Math.max(MIN_COMMISSION, commissionRaw)
    const esxFee = notional * rates.esx
    const ecmaFee = notional * rates.ecma
    const totalFees = commission + esxFee + ecmaFee

    const isBuy = orderForm.market === 'treasury' ? true : orderForm.action === 'buy'
    const totalPayable = isBuy ? notional + totalFees : Math.max(0, notional - totalFees)

    return {
      notional: Number(notional.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      esxFee: Number(esxFee.toFixed(2)),
      ecmaFee: Number(ecmaFee.toFixed(2)),
      totalFees: Number(totalFees.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2)),
      isBuy,
    }
  }, [orderForm.market, orderForm.quantity, orderForm.limitPrice, orderForm.orderType, orderForm.action, selectedTicker, bids, tenor])

  const handleSubmit = () => {
    const validationErrors = validateOrder()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    if (!orderReview) {
      setOrderReview(true)
      return
    }

    const orderId = `ORD-${Date.now()}`
    createOrder({
      id: orderId,
      method: 'branch',
      orderType: orderForm.market === 'treasury' ? 'Treasury Bills' : 'Secondary Market',
      clientName: `${orderForm.firstName} ${orderForm.fathersName} ${orderForm.grandfathersName}`,
      brokerageAccount: `ET${orderForm.brokerageAccountBranch}WEGC${orderForm.brokerageAccountNumber}`,
      symbol: orderForm.market === 'treasury' ? 'TBILL' : orderForm.securitySymbol.toUpperCase(),
      ...(orderForm.market !== 'treasury' ? { action: orderForm.action.toUpperCase(), timeInForce: orderForm.timeInForce } : {}),
      quantity: orderForm.market === 'treasury' ? treasuryTotalQuantity : Number(orderForm.quantity),
      tenor: orderForm.market === 'treasury' ? tenor : null,
      auctionDate: orderForm.market === 'treasury' ? auctionDate : null,
      bids: orderForm.market === 'treasury' ? bids : null,
      currentPrice: selectedTicker?.price || null,
      status: 'Pending Review',
      submittedAt: new Date().toISOString().slice(0, 10),
      paymentReceipt: receiptFileDataUrl ? {
        name: receiptFileName,
        fileDataUrl: receiptFileDataUrl,
      } : null,
      feeBreakdown: feeBreakdown,
      remarks: orderForm.remarks || 'Initial order request',
    })
    refreshData()
    setOrderReference(orderId)
    setSubmitted(true)
  }

  // Developer helper: create a test order programmatically (uses same save path)
  const createTestOrder = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      method: 'branch',
      orderType: orderForm.market === 'treasury' ? 'Treasury Bills' : 'Secondary Market',
      clientName: `${orderForm.firstName} ${orderForm.fathersName} ${orderForm.grandfathersName}`,
      brokerageAccount: `ET${orderForm.brokerageAccountBranch}WEGC${orderForm.brokerageAccountNumber}`,
      symbol: orderForm.market === 'treasury' ? 'TBILL' : orderForm.securitySymbol.toUpperCase(),
      ...(orderForm.market !== 'treasury' ? { action: orderForm.action.toUpperCase(), timeInForce: orderForm.timeInForce } : {}),
      quantity: orderForm.market === 'treasury' ? treasuryTotalQuantity : Number(orderForm.quantity),
      tenor: orderForm.market === 'treasury' ? tenor : null,
      auctionDate: orderForm.market === 'treasury' ? auctionDate : null,
      bids: orderForm.market === 'treasury' ? bids : null,
      currentPrice: selectedTicker?.price || null,
      status: 'Pending Review',
      submittedAt: new Date().toISOString().slice(0, 10),
      paymentReceipt: receiptFileDataUrl ? { name: receiptFileName, fileDataUrl: receiptFileDataUrl } : null,
      feeBreakdown,
      remarks: orderForm.remarks || 'Test order',
    }

    createOrder(order)
    refreshData()
    setSubmitted(true)
  }

  // Expose helper in window for dev/testing (removed in production)
  try {
    if (typeof window !== 'undefined') window.__createTestOrder = createTestOrder
  } catch (e) {}

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
                  <h3 className="text-xl font-semibold text-secondary">{orderForm.market === 'treasury' ? 'Deposit Funds' : 'Funding instructions'}</h3>
                  <p className="text-sm text-text-secondary">{orderForm.market === 'treasury' ? 'Fund your account before placing a T-Bill order.' : 'Use the brokerage account details below for payment.'}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {accountDetails[orderForm.market].map(({ label, value }) => (
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
              <div className="mt-6 rounded-2xl border border-border bg-background-subtle p-4">
                <p className="text-sm font-semibold text-secondary">Steps</p>
                <ol className="mt-3 space-y-3 text-sm text-text-secondary">
                  {marketSteps[orderForm.market].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
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

          <div className="space-y-6">
            {!submitted ? (
              <>
                <div className="rounded-[1.75rem] border border-border bg-background-subtle p-6">
                  <div className="space-y-4">
                    <div className="grid gap-2 rounded-full border border-border bg-background-subtle p-1 md:grid-cols-2">
                  <button type="button" onClick={() => selectMarket('secondary')} className={`rounded-full px-4 py-3 text-left ${orderForm.market === 'secondary' ? 'bg-slate-950 text-white shadow-sm' : 'bg-background-subtle text-text-secondary hover:bg-slate-50'}`}>
                    <p className="text-sm font-semibold">Securities & Shares</p>
                    <p className="mt-1 text-xs">Submit a secondary market order.</p>
                  </button>
                  <button type="button" onClick={() => selectMarket('treasury')} className={`rounded-full px-4 py-3 text-left ${orderForm.market === 'treasury' ? 'bg-slate-950 text-white shadow-sm' : 'bg-background-subtle text-text-secondary hover:bg-slate-50'}`}>
                    <p className="text-sm font-semibold">Treasury Bills (T-Bills)</p>
                    <p className="mt-1 text-xs">Submit a T-Bill bid.</p>
                  </button>
                </div>
                {orderForm.market === 'secondary' ? (
                  <div className="mt-6 rounded-2xl border border-border bg-white p-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="form-field">
                          <label htmlFor="firstName">First Name</label>
                          <input id="firstName" name="firstName" value={orderForm.firstName} onChange={handleChange} placeholder="First name" />
                          {errors.firstName ? <p className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
                        </div>
                        <div className="form-field">
                          <label htmlFor="fathersName">Father's Name</label>
                          <input id="fathersName" name="fathersName" value={orderForm.fathersName} onChange={handleChange} placeholder="Father's name" />
                          {errors.fathersName ? <p className="mt-2 text-sm text-red-600">{errors.fathersName}</p> : null}
                        </div>
                        <div className="form-field">
                          <label htmlFor="grandfathersName">Grandfather's Name</label>
                          <input id="grandfathersName" name="grandfathersName" value={orderForm.grandfathersName} onChange={handleChange} placeholder="Grandfather's name" />
                          {errors.grandfathersName ? <p className="mt-2 text-sm text-red-600">{errors.grandfathersName}</p> : null}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="brokerageAccountNumber" className="mb-2 block text-sm font-semibold text-secondary">Account Number</label>
                        <div className="grid gap-2 md:grid-cols-[auto_auto_auto_1fr] items-center">
                          <div className="flex items-center justify-center rounded-2xl border border-border bg-background-subtle px-3 py-3 text-sm font-semibold">ET</div>
                          <input id="brokerageAccountBranch" name="brokerageAccountBranch" value={orderForm.brokerageAccountBranch} onChange={handleChange} maxLength={2} className="w-16 rounded-2xl border border-border px-3 py-3 text-center" placeholder="70" />
                          <div className="flex items-center justify-center rounded-2xl border border-border bg-background-subtle px-3 py-3 text-sm font-semibold">WEGC</div>
                          <input id="brokerageAccountNumber" name="brokerageAccountNumber" value={orderForm.brokerageAccountNumber} onChange={handleChange} maxLength={8} className="rounded-2xl border border-border px-3 py-3" placeholder="00169931" />
                        </div>
                      </div>
                      {(errors.brokerageAccountBranch || errors.brokerageAccountNumber) && (
                        <div className="grid gap-4 md:grid-cols-2">
                          {errors.brokerageAccountBranch ? <p className="text-sm text-red-600">{errors.brokerageAccountBranch}</p> : <span />}
                          {errors.brokerageAccountNumber ? <p className="text-sm text-red-600">{errors.brokerageAccountNumber}</p> : <span />}
                        </div>
                      )}
                      <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" name="email" type="email" value={orderForm.email} onChange={handleChange} placeholder="you@example.com" />
                        {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
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
                  </div>
                ) : null}
                {orderForm.market === 'treasury' ? (
                  <div className="mt-6 rounded-2xl border border-border bg-white p-4">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="form-field">
                          <label htmlFor="firstName">First Name</label>
                          <input id="firstName" name="firstName" value={orderForm.firstName} onChange={handleChange} placeholder="First name" />
                          {errors.firstName ? <p className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
                        </div>
                        <div className="form-field">
                          <label htmlFor="fathersName">Father's Name</label>
                          <input id="fathersName" name="fathersName" value={orderForm.fathersName} onChange={handleChange} placeholder="Father's name" />
                          {errors.fathersName ? <p className="mt-2 text-sm text-red-600">{errors.fathersName}</p> : null}
                        </div>
                        <div className="form-field">
                          <label htmlFor="grandfathersName">Grandfather's Name</label>
                          <input id="grandfathersName" name="grandfathersName" value={orderForm.grandfathersName} onChange={handleChange} placeholder="Grandfather's name" />
                          {errors.grandfathersName ? <p className="mt-2 text-sm text-red-600">{errors.grandfathersName}</p> : null}
                        </div>
                      </div>

                      <label htmlFor="brokerageAccountNumber" className="mb-2 block text-sm font-semibold text-secondary">Account Number</label>
                      <div className="grid gap-2 md:grid-cols-[auto_auto_auto_1fr] items-center">
                        <div className="flex items-center justify-center rounded-2xl border border-border bg-background-subtle px-3 py-3 text-sm font-semibold">ET</div>
                        <input id="brokerageAccountBranch" name="brokerageAccountBranch" value={orderForm.brokerageAccountBranch} onChange={handleChange} maxLength={2} className="w-16 rounded-2xl border border-border px-3 py-3 text-center" placeholder="70" />
                        <div className="flex items-center justify-center rounded-2xl border border-border bg-background-subtle px-3 py-3 text-sm font-semibold">WEGC</div>
                        <input id="brokerageAccountNumber" name="brokerageAccountNumber" value={orderForm.brokerageAccountNumber} onChange={handleChange} maxLength={8} className="rounded-2xl border border-border px-3 py-3" placeholder="00169931" />
                      </div>

                      {(errors.brokerageAccountBranch || errors.brokerageAccountNumber) && (
                        <div className="grid gap-4 md:grid-cols-2">
                          {errors.brokerageAccountBranch ? <p className="text-sm text-red-600">{errors.brokerageAccountBranch}</p> : <span />}
                          {errors.brokerageAccountNumber ? <p className="text-sm text-red-600">{errors.brokerageAccountNumber}</p> : <span />}
                        </div>
                      )}

                      <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" name="email" type="email" value={orderForm.email} onChange={handleChange} placeholder="you@example.com" />
                        {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
                      </div>

                    </div>
                  </div>
                ) : null}
                    <div className="rounded-[1.25rem] border border-primary/20 bg-primary-muted/40 p-4 text-sm text-secondary">
                      {orderForm.market !== 'treasury' ? (
                        selectedTicker ? (
                          <p><span className="font-semibold">Live quote:</span> {selectedTicker.symbol} • {selectedTicker.company} • ${selectedTicker.price.toFixed(2)}</p>
                        ) : (
                          <p>Enter a supported ticker to pull in the latest live price.</p>
                        )
                      ) : (
                        <p className="text-sm">Treasury bills use auction pricing. Enter bids below.</p>
                      )}
                    </div>
                    {orderForm.market !== 'treasury' ? (
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
                          <label htmlFor="timeInForce">Time In Force</label>
                          <select id="timeInForce" name="timeInForce" value={orderForm.timeInForce} onChange={handleChange}>
                            <option value="day">Day</option>
                            <option value="gtc">Good Till Cancelled</option>
                            <option value="ioc">Immediate Or Cancel</option>
                          </select>
                          {errors.timeInForce ? <p className="mt-2 text-sm text-red-600">{errors.timeInForce}</p> : null}
                        </div>
                        <div className="form-field">
                          <label htmlFor="limitPrice">Limit Price</label>
                          <input id="limitPrice" name="limitPrice" value={orderForm.limitPrice} onChange={handleChange} placeholder="0.00" />
                          {errors.limitPrice ? <p className="mt-2 text-sm text-red-600">{errors.limitPrice}</p> : null}
                        </div>
                      </div>
                    ) : null}
                    {orderForm.market === 'treasury' ? (
                      <div className="rounded-2xl border border-border bg-white p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="form-field">
                            <label>Auction date</label>
                            <input type="text" value={auctionDate} disabled className="rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm" />
                            {errors.auctionDate ? <p className="mt-2 text-sm text-red-600">{errors.auctionDate}</p> : null}
                          </div>
                          <div className="form-field">
                            <label htmlFor="tenor">Tenor</label>
                            <select id="tenor" name="tenor" value={tenor} onChange={(event) => { setTenor(event.target.value); setErrors((previous) => ({ ...previous, tenor: '' })) }}>
                              <option value="28">28 days</option>
                              <option value="91">91 days</option>
                              <option value="182">182 days</option>
                              <option value="364">364 days</option>
                            </select>
                            {errors.tenor ? <p className="mt-2 text-sm text-red-600">{errors.tenor}</p> : null}
                          </div>
                        </div>
                        <div className="mt-6 space-y-4">
                          {bids.map((bid, index) => (
                            <div key={index} className="rounded-2xl border border-border bg-background-subtle p-4">
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-secondary">Bid {index + 1}</p>
                                <button type="button" onClick={() => setBids((previous) => previous.filter((_, bidIndex) => bidIndex !== index))} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove</button>
                              </div>
                              <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div className="form-field">
                                  <label htmlFor={`bidQuantity_${index}`}>Bid Quantity</label>
                                  <input id={`bidQuantity_${index}`} value={bid.quantity} onChange={(event) => updateBid(index, 'quantity', event.target.value)} placeholder="Quantity" />
                                  {errors[`bid_quantity_${index}`] ? <p className="mt-2 text-sm text-red-600">{errors[`bid_quantity_${index}`]}</p> : null}
                                </div>
                                <div className="form-field">
                                  <label htmlFor={`bidYield_${index}`}>Annualized Yield (%)</label>
                                  <input id={`bidYield_${index}`} value={bid.annualizedYield} onChange={(event) => updateBid(index, 'annualizedYield', event.target.value)} placeholder="Yield %" />
                                  {errors[`bid_yield_${index}`] ? <p className="mt-2 text-sm text-red-600">{errors[`bid_yield_${index}`]}</p> : null}
                                </div>
                              </div>
                            </div>
                          ))}

                          <button type="button" onClick={addBid} className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">+ Add Another Bid</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-border bg-background-subtle p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">Send Proof of Payment</p>
                      <p className="mt-1 text-sm text-text-secondary">Upload your payment receipt to complete the order request.</p>
                    </div>
                  </div>
                  <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-primary/50 bg-white p-4 text-center">
                    <UploadCloud className="h-6 w-6 text-primary" />
                    <span className="mt-2 text-sm font-semibold text-secondary">Choose receipt</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={async (event) => {
                      const uploadedFile = event.target.files?.[0]
                      if (!uploadedFile) return
                      const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader()
                        reader.onload = () => resolve(reader.result)
                        reader.onerror = () => reject(new Error('Unable to read file'))
                        reader.readAsDataURL(uploadedFile)
                      })
                      setReceiptFileName(uploadedFile.name)
                      setReceiptFileDataUrl(String(dataUrl))
                      setErrors((previous) => ({ ...previous, receipt: '' }))
                    }} />
                  </label>
                  {errors.receipt ? <p className="mt-2 text-sm text-red-600">{errors.receipt}</p> : null}
                  {receiptFileName ? <p className="mt-2 text-sm text-secondary">Selected file: {receiptFileName}</p> : null}
                  {receiptFileDataUrl ? <p className="mt-1 text-xs text-text-secondary">Receipt file ready for upload.</p> : null}
                </div>
                {orderReview ? (
                  <div className="rounded-2xl border border-border bg-white p-5">
                    <p className="text-sm font-semibold text-secondary">Review transaction</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-text-secondary">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Notional value</p>
                        <p className="mt-2 text-lg font-semibold text-secondary">ETB {feeBreakdown.notional.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Total fees</p>
                        <p className="mt-2 text-lg font-semibold text-secondary">ETB {feeBreakdown.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-secondary">ESX fee</p>
                        <p className="mt-2 text-sm text-text-secondary">ETB {feeBreakdown.esxFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-secondary">ECMA fee</p>
                        <p className="mt-2 text-sm text-text-secondary">ETB {feeBreakdown.ecmaFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-border bg-background-subtle p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-secondary">Total transaction price</p>
                      <p className="mt-2 text-xl font-semibold text-secondary">ETB {feeBreakdown.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <p className="mt-4 text-sm text-text-secondary">If anything needs to change, edit the form and click Review again.</p>
                  </div>
                ) : null}
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
                    {orderReview ? 'Confirm and place order' : 'Review transaction'}
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
                <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background-subtle p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Reference</p>
                    <p className="mt-2 text-xl font-semibold text-secondary">{orderReference}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background-subtle p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Total fees</p>
                    <p className="mt-2 text-xl font-semibold text-secondary">ETB {feeBreakdown.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
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
