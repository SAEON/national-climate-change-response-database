import { createContext, useState } from 'react'
import { nanoid } from 'nanoid'

export const context = createContext()

export default ({ children }) => {
  const [form, setForm] = useState({
    hostname: '',
    title: `New deployment ${nanoid(10)}`,
    shapefiles: [],
    flag: [],
    logo: [],
    theme: {},
  })

  return <context.Provider value={{ form, setForm }}>{children}</context.Provider>
}
