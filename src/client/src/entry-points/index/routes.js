import { lazy } from 'react'
import UsersIcon from 'mdi-react/AccountMultipleIcon'
import UserIcon from 'mdi-react/AccountIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import SearchSubmissionsIcon from 'mdi-react/DatabaseSearchIcon'
import DeploymentsIcon from 'mdi-react/ServerIcon'
import SubmitIcon from 'mdi-react/DatabaseAddIcon'
import SubmissionsIcon from 'mdi-react/DatabaseIcon'
import UserSubmissionIcon from 'mdi-react/AccountIcon'
import LoginIcon from 'mdi-react/LoginIcon'
import Transition from '../../components/page-transition'

const HomePage = lazy(() => import('../../pages/home'))
const AccessPage = lazy(() => import('../../pages/access'))
const SubmissionsPage = lazy(() => import('../../pages/submissions'))
const SubmissionPage = lazy(() => import('../../pages/submission'))
const EditSubmissionPage = lazy(() => import('../../pages/submission-edit'))
const CreateSubmission = lazy(() => import('../../pages/submission-create'))
const NewSubmissionPage = lazy(() => import('../../pages/submission-new'))
const DeploymentsPage = lazy(() => import('../../pages/deployments'))
const UserSubmissionsPage = lazy(() => import('../../pages/user-submissions'))
const UserPage = lazy(() => import('../../pages/user'))
const UsersPage = lazy(() => import('../../pages/users'))
const LoginPage = lazy(() => import('../../pages/login'))

export default [
  {
    label: 'Home',
    Icon: HomeIcon,
    exact: true,
    includeInFooter: true,
    to: '/',
    render: () => (
      <Transition>
        <HomePage />
      </Transition>
    ),
  },
  {
    breadcrumbsLabel: 'Submissions',
    BreadcrumbsIcon: SubmissionsIcon,
    label: 'Search Submissions',
    Icon: SearchSubmissionsIcon,
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
    label: 'Submit project',
    Icon: SubmitIcon,
    exact: true,
    to: '/submissions/new',
    render: () => (
      <Transition>
        <CreateSubmission />
      </Transition>
    ),
    includeInFooter: true,
  },

  {
    label: 'New submission',
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
    label: 'Deployments',
    Icon: DeploymentsIcon,
    to: '/deployments',
    exact: true,
    requiredPermission: '/deployments',
    render: () => (
      <Transition>
        <DeploymentsPage />
      </Transition>
    ),
  },
  {
    label: 'Login',
    Icon: LoginIcon,
    to: '/login',
    exact: true,
    excludeFromNav: true,
    includeInFooter: true,
    render: () => (
      <Transition>
        <LoginPage />
      </Transition>
    ),
  },
  {
    label: 'Access',
    Icon: UsersIcon,
    to: '/access',
    exact: true,
    requiredPermission: '/access',
    render: () => (
      <Transition>
        <AccessPage />
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