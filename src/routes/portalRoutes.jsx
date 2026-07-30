import { Suspense } from 'react'
import { ROUTES } from '../constants/routes'
import { PageLoader } from '../components/common'
import PortalLayout from '../layouts/PortalLayout/PortalLayout'
import {
  ApplicationsPage,
  DashboardPage,
  LoginPage,
  PortalOrdersPage,
  ReportsPage,
  SettingsPage,
} from './lazyPages'

export const portalRoutes = [
  {
    path: ROUTES.PORTAL.LOGIN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    element: <PortalLayout />,
    children: [
      { path: ROUTES.PORTAL.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.PORTAL.APPLICATIONS, element: <ApplicationsPage /> },
      { path: ROUTES.PORTAL.ORDERS, element: <PortalOrdersPage /> },
      { path: ROUTES.PORTAL.REPORTS, element: <ReportsPage /> },
      { path: ROUTES.PORTAL.SETTINGS, element: <SettingsPage /> },
    ],
  },
]
