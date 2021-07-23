import UsersIcon from 'mdi-react/AccountMultipleIcon'
import UserIcon from 'mdi-react/AccountIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import SearchSubmissionsIcon from 'mdi-react/DatabaseSearchIcon'
import DeploymentsIcon from 'mdi-react/ServerIcon'
import SubmitIcon from 'mdi-react/DatabaseAddIcon'
import SubmissionsIcon from 'mdi-react/DatabaseIcon'
import UserSubmissionIcon from 'mdi-react/AccountIcon'
import LoginIcon from 'mdi-react/LoginIcon'

export default [
  {
    label: 'Home',
    Icon: HomeIcon,
    to: '/',
  },
  {
    breadcrumbsLabel: 'Submissions',
    BreadcrumbsIcon: SubmissionsIcon,
    label: 'Search Submissions',
    Icon: SearchSubmissionsIcon,
    to: '/submissions',
  },
  {
    label: 'Submit project',
    Icon: SubmitIcon,
    to: '/submissions/new',
  },
  {
    label: 'Your profile',
    Icon: UserIcon,
    to: '/user',
    requiredPermission: 'create-submission',
    excludeFromNav: true,
  },
  {
    label: 'Your submissions',
    Icon: UserSubmissionIcon,
    to: '/user/submissions',
    requiredPermission: 'create-submission',
  },
  {
    label: 'Deployments',
    Icon: DeploymentsIcon,
    to: '/deployments',
    requiredPermission: 'view-/deployments',
  },
  { label: 'Login', Icon: LoginIcon, to: '/login', excludeFromNav: true },
  { label: 'Access', Icon: UsersIcon, to: '/access', requiredPermission: 'view-/access' },
  { label: 'Users', Icon: UsersIcon, to: '/users', excludeFromNav: true },
]
