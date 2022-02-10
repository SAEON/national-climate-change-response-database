import { createPortal } from 'react-dom'
import Provider from './_context'
import Table from './table'
import Header from './header'
import Summary from './summary'
import { Div } from '../../../components/html-tags'

export default ({ active, headerRef }) => {
  if (!active) {
    return null
  }

  if (!headerRef) {
    return null
  }

  return (
    <Provider>
      {createPortal(<Header />, headerRef)}
      <Summary />
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Table />
    </Provider>
  )
}
