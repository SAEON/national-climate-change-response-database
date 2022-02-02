import { lazy } from 'react'
import UsersIcon_ from 'mdi-react/AccountMultipleIcon'
import UserIcon_ from 'mdi-react/AccountIcon'
import HomeIcon_ from 'mdi-react/HomeIcon'
import SearchSubmissionsIcon_ from 'mdi-react/DatabaseSearchIcon'
import DeploymentsIcon_ from 'mdi-react/ServerIcon'
import SubmitIcon_ from 'mdi-react/DatabaseAddIcon'
import SubmissionsIcon_ from 'mdi-react/DatabaseIcon'
import UserSubmissionIcon_ from 'mdi-react/AccountIcon'
import LoginIcon_ from 'mdi-react/LoginIcon'
import Transition_ from '../../components/page-transition'
import TermsIcon_ from 'mdi-react/ContractIcon'
import PrivacyIcon_ from 'mdi-react/LockCheckIcon'
import SettingsIcon_ from 'mdi-react/SettingsIcon'
import AboutIcon_ from 'mdi-react/InfoVariantIcon'
import ReportsIcon_ from 'mdi-react/ChartBarStackedIcon'
import { DEFAULT_TENANT_ADDRESS } from '../../config'
import { styled } from '@mui/material/styles'

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

const routes = [
  {
    group: 'legal',
    label: 'Terms of Use',
    Icon: TermsIcon,
    exact: true,
    render: () => (
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
    exact: true,
    render: () => (
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
    exact: true,
    includeInFooter: true,
    to: '/',
    render: () => (
      <Transition>
        <HomePage routes={routes} />
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
    exact: true,
    render: () => (
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
    exact: true,
    cta: 'View',
    description:
      "Explore an overview of the South Africa's climate change response. Information is collated to summarize project progress as large-scale trends and statistics. View and download charts and maps showing project progress, locations, funding sources, operation sectors and more.",
    render: () => (
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
    exact: true,
    includeOnHomePage: true,
    to: '/submissions/new',
    cta: 'Start',
    description:
      'Upload and periodically update project details. Although the submission of information to the database is voluntary, data providers are encouraged to upload and update the information into the database to benefit a wide range of use cases in the country.',
    render: () => (
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
    exact: true,
    render: props => (
      <Transition>
        <NewSubmissionPage id={props.match.params.id} {...props} />
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
    exact: true,
    to: '/submissions',
    render: () => (
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
    exact: true,
    render: props => (
      <Transition>
        <EditSubmissionPage id={props.match.params.id} {...props} />
      </Transition>
    ),
  },
  {
    label: 'Submission',
    excludeFromNav: true,
    to: '/submissions/:id',
    exact: true,
    render: props => (
      <Transition>
        <SubmissionPage id={props.match.params.id} {...props} />
      </Transition>
    ),
  },
  {
    label: 'Your submissions',
    Icon: UserSubmissionIcon,
    to: '/user/submissions',
    exact: true,
    requiredPermission: 'create-submission',
    render: () => (
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
    render: () => (
      <Transition>
        <UserPage />
      </Transition>
    ),
  },
  {
    label: 'Deployment',
    Icon: DeploymentsIcon,
    to: '/deployment',
    exact: true,
    requiredPermission: '/deployment',
    tenants: ['default'],
    render: () => (
      <Transition>
        <DeploymentPage />
      </Transition>
    ),
  },
  {
    label: 'Access',
    Icon: UsersIcon,
    to: '/access',
    exact: true,
    requiredPermission: '/access',
    tenants: ['default'],
    render: () => (
      <Transition>
        <AccessPage />
      </Transition>
    ),
  },
  {
    label: 'Main site',
    Icon: SettingsIcon,
    href: `${DEFAULT_TENANT_ADDRESS}`,
    exact: true,
    to: '/no-route', // Hack - the to property is still required
    requiredPermission: '/deployment',
    includeInFooter: true,
    tenants: ['!default'],
  },
  {
    label: 'Login',
    Icon: LoginIcon,
    to: '/login',
    exact: true,
    excludeFromNav: isAuthenticated => !isAuthenticated,
    includeInFooter: true,
    render: () => (
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
    render: () => (
      <Transition>
        <UsersPage />
      </Transition>
    ),
  },
]

export default routes
