import { useState, useEffect, createContext } from 'react'
import { NCCRD_API_HTTP_ADDRESS } from '../config'

export const context = createContext()

export default ({ children }) => {
  const [user, setUser] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)

  const authenticate = () => {
    if (user) {
      return true
    } else {
      window.location.href = `/login?redirect=${window.location.href}`
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
        const user = await response.json()
        setUser(user)
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
        user,
        authenticating,
        authenticate,
      }}
    >
      {children}
    </context.Provider>
  )
}
