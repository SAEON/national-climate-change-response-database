import { createPortal } from 'react-dom'
import Provider from './_context'
import Uploads from './_uploads'
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
      <Uploads />
    </Provider>
  )
}
