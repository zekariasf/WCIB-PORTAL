import { createBrowserRouter } from 'react-router-dom'
import { brokerageRoutes } from './brokerageRoutes'
import { portalRoutes } from './portalRoutes'
import { publicRoutes } from './publicRoutes'

export const router = createBrowserRouter([
  ...publicRoutes,
  ...brokerageRoutes,
  ...portalRoutes,
])

export { publicRoutes } from './publicRoutes'
export { brokerageRoutes } from './brokerageRoutes'
export { portalRoutes } from './portalRoutes'
