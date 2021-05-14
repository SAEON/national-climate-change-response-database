import UsersIcon from 'mdi-react/AccountMultipleIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import ProjectsIcon from 'mdi-react/DatabaseIcon'
import DeploymentsIcon from 'mdi-react/ServerIcon'

export default [
  {
    label: 'Home',
    Icon: HomeIcon,
    to: '/',
  },
  {
    label: 'Projects',
    Icon: ProjectsIcon,
    to: '/projects',
  },
  {
    label: 'Deployments',
    Icon: DeploymentsIcon,
    to: '/deployments',
  },
  { label: 'Access', Icon: UsersIcon, to: '/access', authorization: ['admin'] },
]
