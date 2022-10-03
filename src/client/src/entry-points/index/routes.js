import { lazy } from 'react'
import Transition_ from '../../components/page-transition'
import { DEFAULT_TENANT_ADDRESS, GQL_HOSTNAME } from '../../config'
import { styled } from '@mui/material/styles'

import UsersIcon_ from 'mdi-react/AccountMultipleIcon'
import UserIcon_ from 'mdi-react/AccountIcon'
import HomeIcon_ from 'mdi-react/HomeIcon'
import SearchSubmissionsIcon_ from 'mdi-react/DatabaseSearchIcon'
import DeploymentsIcon_ from 'mdi-react/ServerIcon'
import SubmitIcon_ from 'mdi-react/DatabaseAddIcon'
import SubmissionsIcon_ from 'mdi-react/DatabaseIcon'
import UserSubmissionIcon_ from 'mdi-react/AccountIcon'
import LoginIcon_ from 'mdi-react/LoginIcon'
import TermsIcon_ from 'mdi-react/ContractIcon'
import PrivacyIcon_ from 'mdi-react/LockCheckIcon'
import SettingsIcon_ from 'mdi-react/SettingsIcon'
import AboutIcon_ from 'mdi-react/InfoVariantIcon'
import ReportsIcon_ from 'mdi-react/ChartBarStackedIcon'
import GithubIcon_ from 'mdi-react/GithubIcon'
import LicenseIcon_ from 'mdi-react/LicenseIcon'
import ApiIcon_ from 'mdi-react/ApiIcon'

const HomePage = lazy(() => import('../../pages/home'))
const ReportsPage = lazy(() => import('../../pages/reports'))
const AboutPage = lazy(() => import('../../pages/about'))
const AccessPage = lazy(() => import('../../pages/access'))
const SubmissionsPage = lazy(() => import('../../pages/submissions'))
const SubmissionPage = lazy(() => import('../../pages/submission'))
const EditSubmissionPage = lazy(() => import('../../pages/submission-edit'))
const CreateSubmission = lazy(() => import('../../pages/submission-create'))
const NewSubmissionPage = lazy(() => import('../../pages/submission-new'))
const DeploymentPage = lazy(() => import('../../pages/deployment'))
const UserSubmissionsPage = lazy(() => import('../../pages/user-submissions'))
const UserPage = lazy(() => import('../../pages/user'))
const UsersPage = lazy(() => import('../../pages/users'))
const LoginPage = lazy(() => import('../../pages/login'))
const TermsOfUsePage = lazy(() => import('../../pages/terms-of-use'))
const PaiaPopiaPage = lazy(() => import('../../pages/paia-popia'))
const LicensePage = lazy(() => import('../../pages/license'))

const UsersIcon = styled(UsersIcon_)({})
const UserIcon = styled(UserIcon_)({})
const HomeIcon = styled(HomeIcon_)({})
const SearchSubmissionsIcon = styled(SearchSubmissionsIcon_)({})
const DeploymentsIcon = styled(DeploymentsIcon_)({})
const SubmitIcon = styled(SubmitIcon_)({})
const SubmissionsIcon = styled(SubmissionsIcon_)({})
const UserSubmissionIcon = styled(UserSubmissionIcon_)({})
const LoginIcon = styled(LoginIcon_)({})
const Transition = styled(Transition_)({})
const TermsIcon = styled(TermsIcon_)({})
const PrivacyIcon = styled(PrivacyIcon_)({})
const SettingsIcon = styled(SettingsIcon_)({})
const AboutIcon = styled(AboutIcon_)({})
const ReportsIcon = styled(ReportsIcon_)({})
const GithubIcon = styled(GithubIcon_)({})
const LicenseIcon = styled(LicenseIcon_)({})
const ApiIcon = styled(ApiIcon_)({})

export default [
  {
    group: 'legal',
    label: 'Terms of Use',
    Icon: TermsIcon,
    Component: () => (
      <Transition>
        <TermsOfUsePage />
      </Transition>
    ),
    to: '/terms-of-use',
    excludeFromNav: true,
    includeInFooter: true,
  },
  {
    group: 'legal',
    label: 'PAIA & POPIA',
    Icon: PrivacyIcon,
    Component: () => (
      <Transition>
        <PaiaPopiaPage />
      </Transition>
    ),
    to: '/paia-popia',
    excludeFromNav: true,
    includeInFooter: true,
  },
  {
    label: 'Home',
    Icon: HomeIcon,
    includeInFooter: true,
    to: '/',
    Component: () => (
      <Transition>
        <HomePage />
      </Transition>
    ),
  },
  {
    label: 'About',
    Icon: AboutIcon,
    includeOnHomePage: false,
    cta: 'More',
    description:
      'The database is intended as a resource to collect and track interventions on climate change (adaptation and mitigation) on past, current and future climate change response efforts (policies, plans, strategies, projects and research) within South Africa.',
    Component: () => (
      <Transition>
        <AboutPage />
      </Transition>
    ),
    to: '/about',
    includeInFooter: true,
  },
  {
    label: 'Data reports',
    Icon: ReportsIcon,
    includeOnHomePage: true,
    cta: 'View',
    description:
      "Explore an overview of the South Africa's climate change response. Information is collated to summarize project progress as large-scale trends and statistics. View and download charts and maps showing project progress, locations, funding sources, operation sectors and more.",
    Component: () => (
      <Transition>
        <ReportsPage />
      </Transition>
    ),
    to: '/reports',
    includeInFooter: true,
  },
  {
    label: 'Contribute',
    Icon: SubmitIcon,
    includeOnHomePage: true,
    to: '/submissions/new',
    cta: 'Start',
    description:
      'Upload and periodically update project details. Although the submission of information to the database is voluntary, data providers are encouraged to upload and update the information into the database to benefit a wide range of use cases in the country.',
    Component: () => (
      <Transition>
        <CreateSubmission />
      </Transition>
    ),
    includeInFooter: true,
  },

  {
    label: 'Contribute',
    excludeFromNav: true,
    to: '/submissions/new/:id',
    Component: () => (
      <Transition>
        <NewSubmissionPage />
      </Transition>
    ),
  },
  {
    breadcrumbsLabel: 'Submissions',
    BreadcrumbsIcon: SubmissionsIcon,
    label: 'Search data',
    Icon: SearchSubmissionsIcon,
    description:
      'Search our database for funding and other details of climate change related projects, including specific information regarding mitigation and adaptation strategies. Get up-to-date activity data on the South African climate change response, and project advancement.',
    includeOnHomePage: true,
    cta: 'Explore',
    to: '/submissions',
    Component: () => (
      <Transition>
        <SubmissionsPage />
      </Transition>
    ),
    includeInFooter: true,
  },
  {
    label: 'Edit submission',
    excludeFromNav: true,
    to: '/submissions/:id/edit',
    Component: () => (
      <Transition>
        <EditSubmissionPage />
      </Transition>
    ),
  },
  {
    label: 'Submission',
    excludeFromNav: true,
    to: '/submissions/:id',
    Component: () => (
      <Transition>
        <SubmissionPage />
      </Transition>
    ),
  },
  {
    label: 'Your submissions',
    Icon: UserSubmissionIcon,
    to: '/user/submissions',
    requiredPermission: 'create-submission',
    Component: () => (
      <Transition>
        <UserSubmissionsPage />
      </Transition>
    ),
  },
  {
    label: 'Your profile',
    Icon: UserIcon,
    to: '/user',
    requiredPermission: 'create-submission',
    excludeFromNav: true,
    Component: () => (
      <Transition>
        <UserPage />
      </Transition>
    ),
  },
  {
    label: 'Deployment',
    Icon: DeploymentsIcon,
    to: '/deployment',
    requiredPermission: '/deployment',
    tenants: ['default'],
    Component: () => (
      <Transition>
        <DeploymentPage />
      </Transition>
    ),
  },
  {
    label: 'Access',
    Icon: UsersIcon,
    to: '/access',
    requiredPermission: '/access',
    tenants: ['default'],
    Component: () => (
      <Transition>
        <AccessPage />
      </Transition>
    ),
  },
  {
    label: 'Main site',
    Icon: SettingsIcon,
    href: `${DEFAULT_TENANT_ADDRESS}`,
    to: '/no-route', // Hack - the to property is still required
    requiredPermission: '/deployment',
    includeInFooter: true,
    tenants: ['!default'],
  },
  {
    label: 'Login',
    Icon: LoginIcon,
    to: '/login',
    excludeFromNav: isAuthenticated => !isAuthenticated,
    includeInFooter: true,
    Component: () => (
      <Transition>
        <LoginPage />
      </Transition>
    ),
  },
  {
    label: 'Users',
    Icon: UsersIcon,
    to: '/users',
    excludeFromNav: true,
    Component: () => (
      <Transition>
        <UsersPage />
      </Transition>
    ),
  },
  {
    label: 'GraphQL Playground',
    Icon: ApiIcon,
    href: GQL_HOSTNAME,
    excludeFromNav: true,
    includeInFooter: true,
    to: '/no-route', // Hack - the to property is still required
  },
  {
    group: 'source code',
    label: 'Source code',
    Icon: GithubIcon,
    href: 'https://github.com/SAEON/national-climate-change-systems',
    excludeFromNav: true,
    includeInFooter: true,
    to: '/no-route', // Hack - the to property is still required
  },
  {
    group: 'source code',
    label: 'License (MIT)',
    Icon: LicenseIcon,
    excludeFromNav: true,
    includeInFooter: true,
    to: '/license',
    Component: () => (
      <Transition>
        <LicensePage />
      </Transition>
    ),
  },
]
