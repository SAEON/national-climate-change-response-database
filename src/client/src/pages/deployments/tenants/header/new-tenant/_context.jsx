import { createContext, useState, memo, useMemo } from 'react'
import { nanoid } from 'nanoid'

export const context = createContext()

export default memo(({ children, staticTheme }) => {
  const defaultForm = useMemo(
    () => ({
      hostname: '',
      title: `New deployment ${nanoid(10)}`,
      shortTitle: '',
      description: '',
      shapefile: [],
      flag: [],
      logo: [],
      theme: staticTheme,
      valid: false,
      putError: undefined,
    }),
    [staticTheme]
  )

  const [form, setForm] = useState(defaultForm)

  return (
    <context.Provider
      value={{
        form,
        setForm: obj => setForm(form => ({ ...form, ...obj })),
        resetForm: () => setForm(defaultForm),
      }}
    >
      {children}
    </context.Provider>
  )
})
