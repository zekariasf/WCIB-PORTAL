import { lazy } from 'react'

// Public website pages
export const HomePage = lazy(() => import('../pages/public/Home/Home'))
export const AboutPage = lazy(() => import('../pages/public/About/About'))
export const ServicesPage = lazy(() => import('../pages/public/Services/Services'))
export const ResearchPage = lazy(() => import('../pages/public/Research/Research'))
export const ContactPage = lazy(() => import('../pages/public/Contact/Contact'))

// Brokerage pages
export const BrokerageOverviewPage = lazy(
  () => import('../pages/public/Brokerage/Overview/Overview'),
)
export const OpenAccountPage = lazy(
  () => import('../pages/public/Brokerage/OpenAccount/OpenAccount'),
)
export const BrokerageOrdersPage = lazy(
  () => import('../pages/public/Brokerage/Orders/Orders'),
)
export const NewayPage = lazy(() => import('../pages/public/Brokerage/Neway/Neway'))
export const TrackingPage = lazy(
  () => import('../pages/public/Brokerage/Tracking/Tracking'),
)
export const FAQPage = lazy(() => import('../pages/public/Brokerage/FAQ/FAQ'))

// Internal portal pages
export const LoginPage = lazy(() => import('../pages/portal/Login/Login'))
export const DashboardPage = lazy(() => import('../pages/portal/Dashboard/Dashboard'))
export const ApplicationsPage = lazy(
  () => import('../pages/portal/Applications/Applications'),
)
export const PortalOrdersPage = lazy(() => import('../pages/portal/Orders/Orders'))
export const ReportsPage = lazy(() => import('../pages/portal/Reports/Reports'))
export const SettingsPage = lazy(() => import('../pages/portal/Settings/Settings'))
