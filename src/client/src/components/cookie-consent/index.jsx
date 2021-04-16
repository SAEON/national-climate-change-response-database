import { forwardRef } from 'react'
import CookieConsent from 'react-cookie-consent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ children }) => {
  const theme = useTheme()

  return (
    <>
      <CookieConsent
        overlay={false}
        overlayStyle={{ zIndex: 2000 }}
        style={{ background: theme.palette.primary.dark }}
        ariaAcceptLabel="Allow cookies"
        ButtonComponent={forwardRef((props, ref) => {
          return (
            <Button
              {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== 'style'))}
              color="secondary"
              variant="contained"
              style={{ marginRight: theme.spacing(1) }}
              ref={ref}
            >
              Okay
            </Button>
          )
        })}
        location="bottom"
      >
        <Typography variant="h6">
          This website uses cookies to enhance the user experience. Without cookies, this website
          will not work as expected
        </Typography>
      </CookieConsent>
      {children}
    </>
  )
}
