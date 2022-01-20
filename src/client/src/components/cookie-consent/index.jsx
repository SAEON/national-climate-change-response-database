import { forwardRef } from 'react'
import CookieConsent from 'react-cookie-consent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const Cookie = styled(CookieConsent)({
  background: theme => theme.palette.primary.dark,
  zIndex: 1200,
})

export default ({ children }) => {
  return (
    <>
      <Cookie
        overlay={false}
        ariaAcceptLabel="Allow cookies"
        ButtonComponent={forwardRef((props, ref) => {
          return (
            <Button
              {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== 'style'))}
              color="secondary"
              variant="contained"
              sx={{ marginRight: theme => theme.spacing(1) }}
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
      </Cookie>
      {children}
    </>
  )
}
