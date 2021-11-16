import { createContext } from 'react'
import WithFetch from './with-fetch'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'

export const context = createContext()

export default ({ children }) => {
  return (
    <WithFetch uri={`${NCCRD_API_HTTP_ADDRESS}/client-context`}>
      {({ error, loading, data }) => {
        if (loading) {
          return <p style={{ marginLeft: 16 }}>Loading...</p>
        }

        if (error) {
          const msg = 'Unable to retrieve client info. Is the server accessible?'
          console.error(msg, error)
          throw new Error(msg)
        }

        return (
          <context.Provider
            value={{
              ...data,
            }}
          >
            {children}
          </context.Provider>
        )
      }}
    </WithFetch>
  )
}
