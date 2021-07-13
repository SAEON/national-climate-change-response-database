import UsersIcon from 'mdi-react/AccountMultipleIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import SearchSubmissionsIcon from 'mdi-react/DatabaseSearchIcon'
import DeploymentsIcon from 'mdi-react/ServerIcon'
import SubmitIcon from 'mdi-react/DatabaseAddIcon'
import SubmissionsIcon from 'mdi-react/DatabaseIcon'
import UserSubmissionIcon from 'mdi-react/AccountIcon'

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
    label: 'Your submissions',
    Icon: UserSubmissionIcon,
    to: '/users/:id/submissions',
    requiredPermission: 'create-project',
  },
  {
    label: 'Deployments',
    Icon: DeploymentsIcon,
    to: '/deployments',
    requiredPermission: 'view-/deployments',
  },
  { label: 'Access', Icon: UsersIcon, to: '/access', requiredPermission: 'view-/access' },
  { label: 'Users', Icon: UsersIcon, to: '/users', excludeFromNav: true },
]
