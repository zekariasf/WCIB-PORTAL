import { ROUTES } from '../constants/routes'
import BrokerageLayout from '../layouts/BrokerageLayout/BrokerageLayout'
import {
  BrokerageOrdersPage,
  BrokerageOverviewPage,
  FAQPage,
  NewayPage,
  OpenAccountPage,
  TrackingPage,
} from './lazyPages'

export const brokerageRoutes = [
  {
    element: <BrokerageLayout />,
    children: [
      { path: ROUTES.PUBLIC.BROKERAGE.OVERVIEW, element: <BrokerageOverviewPage /> },
      { path: ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT, element: <OpenAccountPage /> },
      { path: ROUTES.PUBLIC.BROKERAGE.ORDERS, element: <BrokerageOrdersPage /> },
      { path: ROUTES.PUBLIC.BROKERAGE.NEWAY, element: <NewayPage /> },
      { path: ROUTES.PUBLIC.BROKERAGE.TRACKING, element: <TrackingPage /> },
      { path: ROUTES.PUBLIC.BROKERAGE.FAQ, element: <FAQPage /> },
    ],
  },
]
