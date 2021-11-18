import { createContext, useState, memo, useMemo } from 'react'
import { nanoid } from 'nanoid'

export const context = createContext()

export default memo(({ children, staticTheme }) => {
  const defaultForm = useMemo(
    () => ({
      hostname: '',
      title: `New deployment ${nanoid(10)}`,
      shapefiles: [],
      flag: [],
      logo: [],
      theme: staticTheme,
      valid: false,
    }),
    [staticTheme]
  )

  const [form, setForm] = useState(defaultForm)

  return (
    <context.Provider
      value={{
        form,
        setForm,
        resetForm: () => setForm(defaultForm),
      }}
    >
      {children}
    </context.Provider>
  )
})
