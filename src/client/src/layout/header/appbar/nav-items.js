import UsersIcon from 'mdi-react/AccountMultipleIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import LoginIcon from 'mdi-react/LoginIcon'
import ProjectsIcon from 'mdi-react/DatabaseIcon'
import NewProjectsIcon from 'mdi-react/DatabasePlusIcon'
import TenantsIcon from 'mdi-react/ServerIcon'

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
    label: 'Tenants',
    Icon: TenantsIcon,
    to: '/tenants',
  },
  {
    label: 'New project',
    Icon: NewProjectsIcon,
    excludeFromNav: true,
    to: '/new',
  },
  { label: 'Access', Icon: UsersIcon, to: '/access', authorization: ['admin'] },
  {
    label: 'Login',
    Icon: LoginIcon,
    excludeFromNav: true,
    to: '/login',
  },
]
