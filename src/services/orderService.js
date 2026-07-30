import { getOrders, saveOrder, updateOrder } from './storageService'

export function createOrder(payload) {
  const order = {
    id: payload.id,
    orderType: payload.orderType,
    clientName: payload.clientName,
    brokerageAccount: payload.brokerageAccount,
    symbol: payload.symbol,
    action: payload.action,
    quantity: payload.quantity,
    status: payload.status || 'Pending Review',
    submittedAt: payload.submittedAt,
    paymentReceipt: payload.paymentReceipt || null,
    remarks: payload.remarks || '',
    currentPrice: payload.currentPrice || null,
    assignedOfficer: payload.assignedOfficer || 'None',
    reviewNotes: payload.reviewNotes || '',
  }

  return saveOrder(order)
}

export function listOrders() {
  return getOrders()
}

export function updateOrderStatus(orderId, updates) {
  return updateOrder(orderId, updates)
}
