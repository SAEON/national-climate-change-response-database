import { createContext } from 'react'
import WithFetch from './with-fetch'
import Loading from '../../components/loading'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'

export const context = createContext()

export default ({ children }) => {
  return (
    <WithFetch uri={`${NCCRD_API_HTTP_ADDRESS}/client-info`}>
      {({ error, loading, data }) => {
        if (loading) {
          return <Loading />
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
