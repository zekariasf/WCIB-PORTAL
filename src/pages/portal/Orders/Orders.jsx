import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { updateOrderStatus } from '../../../services/orderService'

const officerOptions = ['A. Bekele', 'M. Tadesse', 'S. Alemu', 'L. Worku']

function Orders() {
  const { orders, refreshData, setOrders } = useAppContext()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reviewDraft, setReviewDraft] = useState({ assignedOfficer: 'A. Bekele', reviewNotes: '' })

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.clientName}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  }), [orders, search, statusFilter])

  useEffect(() => {
    if (selectedOrder) {
      setReviewDraft({
        assignedOfficer: selectedOrder.assignedOfficer || 'A. Bekele',
        reviewNotes: selectedOrder.reviewNotes || '',
      })
    }
  }, [selectedOrder])

  const updateStatus = (orderId, status) => {
    const nextOrders = updateOrderStatus(orderId, {
      status,
      assignedOfficer: reviewDraft.assignedOfficer,
      reviewNotes: reviewDraft.reviewNotes,
    })

    setOrders(nextOrders)
    refreshData()
    setSelectedOrder(nextOrders.find((order) => order.id === orderId) || null)
  }

  const saveReview = () => {
    if (!selectedOrder) return

    const nextOrders = updateOrderStatus(selectedOrder.id, {
      assignedOfficer: reviewDraft.assignedOfficer,
      reviewNotes: reviewDraft.reviewNotes,
      status: selectedOrder.status,
    })

    setOrders(nextOrders)
    refreshData()
    setSelectedOrder(nextOrders.find((order) => order.id === selectedOrder.id) || null)
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-secondary">Trade operations</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order" className="rounded-xl border border-border bg-background-subtle px-3.5 py-2.5 text-sm" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-border bg-background-subtle px-3.5 py-2.5 text-sm">
            <option value="All">All</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Executed">Executed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-background-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Order</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-background-subtle">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelectedOrder(order)} className="text-left font-semibold text-secondary">{order.id}</button>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{order.clientName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-secondary">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder ? (
          <div className="rounded-[1.5rem] border border-border bg-background-subtle p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Selected order</p>
            <h2 className="mt-3 text-2xl font-semibold text-secondary">{selectedOrder.id}</h2>
            <p className="mt-2 text-sm text-text-secondary">{selectedOrder.clientName}</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Current status</p>
                <p className="mt-1 text-sm text-text-secondary">{selectedOrder.status}</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Assignment</p>
                <select value={reviewDraft.assignedOfficer} onChange={(event) => setReviewDraft((previous) => ({ ...previous, assignedOfficer: event.target.value }))} className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm">
                  {officerOptions.map((officer) => <option key={officer} value={officer}>{officer}</option>)}
                </select>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Review notes</p>
                <textarea value={reviewDraft.reviewNotes} onChange={(event) => setReviewDraft((previous) => ({ ...previous, reviewNotes: event.target.value }))} rows="4" className="mt-2 w-full rounded-xl border border-border bg-background-subtle px-3 py-2 text-sm" placeholder="Capture execution remarks or client updates" />
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-secondary">Order details</p>
                <p className="mt-1 text-sm text-text-secondary">{selectedOrder.action} {selectedOrder.quantity} of {selectedOrder.symbol} • ${selectedOrder.currentPrice?.toFixed(2) || 'n/a'}</p>
                {selectedOrder.feeBreakdown ? (
                  <div className="mt-3 rounded-xl border border-border bg-background-subtle p-3 text-sm">
                    <p className="font-semibold text-secondary">Fee breakdown</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-text-secondary">
                      <div>Notional</div>
                      <div className="text-right">ETB {selectedOrder.feeBreakdown.notional.toLocaleString()}</div>
                      <div>Commission</div>
                      <div className="text-right">ETB {selectedOrder.feeBreakdown.commission.toLocaleString()}</div>
                      <div>Exchange fee</div>
                      <div className="text-right">ETB {selectedOrder.feeBreakdown.esxFee.toLocaleString()}</div>
                      <div>ECMA fee</div>
                      <div className="text-right">ETB {selectedOrder.feeBreakdown.ecmaFee.toLocaleString()}</div>
                      <div className="font-semibold">Total fees</div>
                      <div className="text-right font-semibold">ETB {selectedOrder.feeBreakdown.totalFees.toLocaleString()}</div>
                      <div className="font-semibold">{selectedOrder.feeBreakdown.isBuy ? 'Total payable' : 'Net proceeds'}</div>
                      <div className="text-right font-semibold">ETB {selectedOrder.feeBreakdown.totalPayable.toLocaleString()}</div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={saveReview} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Save review</button>
                <button type="button" onClick={() => updateStatus(selectedOrder.id, 'Approved')} className="rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-text-on-primary">Approve</button>
                <button type="button" onClick={() => updateStatus(selectedOrder.id, 'Rejected')} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Reject</button>
                <button type="button" onClick={() => updateStatus(selectedOrder.id, 'Executed')} className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-secondary">Execute</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-border bg-background-subtle p-6 text-text-secondary">Select an order to review trade details.</div>
        )}
      </div>
    </div>
  )
}

export default Orders
