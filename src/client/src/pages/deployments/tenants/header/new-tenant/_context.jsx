import { createContext, useState } from 'react'

export const context = createContext()

export default ({ children }) => {
  const [form, setForm] = useState({
    domain: '',
  })

  return <context.Provider value={{ form, setForm }}>{children}</context.Provider>
}
