import { useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import Dialogue from './_dialogue'

export default () => {
  const isAuthenticated = useContext(authenticationContext)
  return <Dialogue isAuthenticated={isAuthenticated} />
}
