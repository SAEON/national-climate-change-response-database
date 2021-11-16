import { createContext, useContext, useState } from 'react'
import { context as clientContext } from '../client-context'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles'

export const context = createContext()

const Provider = ({ initialTheme, children }) => {
  const [theme, setTheme] = useState(createTheme(initialTheme))

  return (
    <context.Provider value={{ theme, setTheme: theme => setTheme(createTheme(theme)) }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </context.Provider>
  )
}

export default ({ children }) => {
  const { theme } = useContext(clientContext)

  return <Provider initialTheme={JSON.parse(theme)}>{children}</Provider>
}
