import UsersIcon from 'mdi-react/AccountMultipleIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import SubmissionsIcon from 'mdi-react/DatabaseIcon'
import DeploymentsIcon from 'mdi-react/ServerIcon'

export default [
  {
    label: 'Home',
    Icon: HomeIcon,
    to: '/',
  },
  {
    label: 'Submissions',
    Icon: SubmissionsIcon,
    to: '/submissions',
  },
  {
    label: 'Deployments',
    Icon: DeploymentsIcon,
    to: '/deployments',
  },
  { label: 'Access', Icon: UsersIcon, to: '/access', authorization: ['admin'] },
  { label: 'Users', Icon: UsersIcon, to: '/users', authorization: ['admin'], excludeFromNav: true },
]
