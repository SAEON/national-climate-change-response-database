import { createContext } from 'react'
import useFetch from 'use-http'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'

export const context = createContext()

export default ({ children }) => {
  const { error, loading, data } = useFetch(
    `${NCCRD_API_HTTP_ADDRESS}/client-context`,
    {
      method: 'GET',
      mode: 'cors',
    },
    []
  )

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
}
