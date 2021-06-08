import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Collapse from '@material-ui/core/Collapse'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography'
import Toolbar from './toolbar'
import useTheme from '@material-ui/core/styles/useTheme'

export const IMAGE_HEIGHT = 93

export const HideOnScroll = ({ children }) => {
  const [_trigger, set_Trigger] = useState(false)

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  let timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer?.current)
    timer.current = setTimeout(() => {
      set_Trigger(trigger)
    }, 100)
  }, [trigger])

  return (
    <Collapse in={!_trigger}>
      <div>{children}</div>
    </Collapse>
  )
}

export default props => {
  const theme = useTheme()
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <HideOnScroll {...props}>
      <Toolbar>
        {/* DFFE LOGO */}
        <a
          style={{ display: 'flex', flexBasis: 0, flexGrow: 1 }}
          target="_blank"
          rel="noreferrer"
          href="http://www.environment.gov.za/"
        >
          <img
            style={{ height: IMAGE_HEIGHT }}
            src="/dffe-logo-transparent.png"
            alt="SA Government"
          />
        </a>

        {/* TITLE */}
        {mdAndUp && (
          <MuiLink component={Link} to="/">
            <Typography
              color="textPrimary"
              style={{ display: 'flex', flexBasis: 0, flexGrow: 1, textAlign: 'center' }}
              variant="h1"
            >
              National Climate Change Response Database
            </Typography>
          </MuiLink>
        )}

        {/* SA FLAG */}
        {smAndUp && (
          <a
            style={{ display: 'flex', flexBasis: 0, flexGrow: 1, justifyContent: 'flex-end' }}
            target="_blank"
            rel="noreferrer"
            href="http://www.environment.gov.za/"
          >
            <img
              style={{ height: IMAGE_HEIGHT, display: 'flex' }}
              src="/sa-flag.jpg"
              alt="SA Government"
            />
          </a>
        )}
      </Toolbar>
    </HideOnScroll>
  )
}
