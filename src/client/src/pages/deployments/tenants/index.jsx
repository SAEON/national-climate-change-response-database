import Provider from './_context'
import Table from './table'
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
      <Table />
    </Provider>
  )
}
