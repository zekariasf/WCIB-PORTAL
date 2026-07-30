import { ROUTES } from '../constants/routes'
import MainLayout from '../layouts/MainLayout/MainLayout'
import {
  AboutPage,
  ContactPage,
  HomePage,
  ResearchPage,
  ServicesPage,
} from './lazyPages'

export const publicRoutes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.PUBLIC.ABOUT, element: <AboutPage /> },
      { path: ROUTES.PUBLIC.SERVICES, element: <ServicesPage /> },
      { path: ROUTES.PUBLIC.RESEARCH, element: <ResearchPage /> },
      { path: ROUTES.PUBLIC.CONTACT, element: <ContactPage /> },
    ],
  },
]
