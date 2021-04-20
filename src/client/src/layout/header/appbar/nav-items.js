import UsersIcon from 'mdi-react/AccountMultipleIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import LoginIcon from 'mdi-react/LoginIcon'
import ProjectsIcon from 'mdi-react/ClipboardFileIcon'

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
  { label: 'Access', Icon: UsersIcon, to: '/access', authorization: ['admin'] },
  {
    label: 'Login',
    Icon: LoginIcon,
    excludeFromNav: true,
    to: '/login',
  },
]
