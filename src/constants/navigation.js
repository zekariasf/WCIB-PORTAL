import { ROUTES } from './routes'

export const PUBLIC_NAV_LINKS = [
  { label: 'Home', to: ROUTES.PUBLIC.HOME, end: true },
  { label: 'About', to: ROUTES.PUBLIC.ABOUT },
  { label: 'Services', to: ROUTES.PUBLIC.SERVICES },
  {
    label: 'Brokerage',
    to: ROUTES.PUBLIC.BROKERAGE.OVERVIEW,
    matchPrefix: '/brokerage',
  },
  { label: 'Research', to: ROUTES.PUBLIC.RESEARCH },
  { label: 'Contact', to: ROUTES.PUBLIC.CONTACT },
]

export const FOOTER_LINK_GROUPS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.PUBLIC.ABOUT },
      { label: 'Services', to: ROUTES.PUBLIC.SERVICES },
      { label: 'Research', to: ROUTES.PUBLIC.RESEARCH },
      { label: 'Contact', to: ROUTES.PUBLIC.CONTACT },
    ],
  },
  {
    title: 'Brokerage',
    links: [
      { label: 'Overview', to: ROUTES.PUBLIC.BROKERAGE.OVERVIEW },
      { label: 'Open Account', to: ROUTES.PUBLIC.BROKERAGE.OPEN_ACCOUNT },
      { label: 'Track Application', to: ROUTES.PUBLIC.BROKERAGE.TRACKING },
      { label: 'FAQ', to: ROUTES.PUBLIC.BROKERAGE.FAQ },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Disclosures', to: '#' },
    ],
  },
]
