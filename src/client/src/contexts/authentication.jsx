import { useState, useEffect, useContext, createContext } from 'react'
import { NCCRD_API_HTTP_ADDRESS } from '../config'
import { context as clientInfoContext } from './client-info'

export const context = createContext()

export default ({ children }) => {
  const { origin: NCCRD_CLIENT_ADDRESS } = useContext(clientInfoContext)
  const [userInfo, setUserInfo] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)

  const authenticate = () => {
    if (userInfo) {
      return true
    } else {
      window.location.href = `${NCCRD_CLIENT_ADDRESS}/login?redirect=${window.location.href}`
    }
  }

  useEffect(() => {
    const abortController = new AbortController()

    ;(async () => {
      setAuthenticating(true)
      try {
        const response = await fetch(`${NCCRD_API_HTTP_ADDRESS}/authenticate`, {
          credentials: 'include',
          mode: 'cors',
          signal: abortController.signal,
        })
        const userInfo = await response.json()
        setUserInfo(userInfo)
        setAuthenticating(false)
      } catch (error) {
        throw new Error('Error authenticating user ::' + error.message)
      }
    })()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <context.Provider
      value={{
        userInfo,
        authenticating,
        authenticate,
      }}
    >
      {children}
    </context.Provider>
  )
}
