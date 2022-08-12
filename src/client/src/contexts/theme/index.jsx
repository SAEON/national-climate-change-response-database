import { createContext, useContext, useState } from 'react'
import { context as clientContext } from '../client-context'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { StyledEngineProvider, createTheme } from '@mui/material/styles'

export const context = createContext()

const Provider = ({ staticTheme, children }) => {
  const [theme, setTheme] = useState(createTheme(staticTheme))

  return (
    <context.Provider
      value={{
        resetTheme: () => setTheme(createTheme(staticTheme)),
        staticTheme,
        theme,
        updateTheme: newTheme => setTheme(createTheme(newTheme)),
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div
            id="bg"
            style={{
              position: 'fixed',
              background: `radial-gradient(${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.tertiary.main})`,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </context.Provider>
  )
}

export default ({ children }) => {
  const { theme } = useContext(clientContext)
  return <Provider staticTheme={JSON.parse(theme)}>{children}</Provider>
}
