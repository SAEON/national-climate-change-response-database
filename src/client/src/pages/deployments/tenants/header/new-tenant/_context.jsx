import { createContext } from 'react'

export const context = createContext()

export default ({ children }) => {
  return <context.Provider value={{}}>{children}</context.Provider>
}
