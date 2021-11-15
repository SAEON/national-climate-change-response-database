import Provider from './_context'
import Uploads from './_uploads'
import Header from './header'
import useTheme from '@mui/material/styles/useTheme'

export default ({ active }) => {
  const theme = useTheme()

  if (!active) {
    return null
  }

  return (
    <Provider>
      <Header />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Uploads />
    </Provider>
  )
}
