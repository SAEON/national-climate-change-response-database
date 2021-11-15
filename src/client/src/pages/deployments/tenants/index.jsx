import { createPortal } from 'react-dom'
import Provider from './_context'
import Table from './table'
import Header from './header'

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
      <Table />
    </Provider>
  )
}
