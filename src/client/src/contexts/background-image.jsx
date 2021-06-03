import { createContext } from 'react'
import useTheme from '@material-ui/core/styles/useTheme'

export const BgImageContext = createContext()

export default ({ children }) => {
  const theme = useTheme()

  return (
    <>
      <div
        id="bg"
        style={{
          position: 'fixed',
          background: `radial-gradient(${theme.palette.primary.dark}, #1f1013)`,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      {children}
    </>
  )
}
