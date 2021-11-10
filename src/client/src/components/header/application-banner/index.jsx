import Typography from '@mui/material/Typography'
import Toolbar_ from './toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme'

export const useImageHeight = () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  if (lgUp) {
    return 93
  }

  return 40
}

export const Toolbar = Toolbar_

const aProps = {
  style: { flexBasis: 0, flexGrow: 1, margin: 8, display: 'flex' },
  target: '_blank',
  rel: 'noreferrer',
}

export default ({ title }) => {
  const imageHeight = useImageHeight()

  return (
    <Toolbar_>
      {/* DFFE LOGO */}

      <a {...aProps} href="http://www.environment.gov.za/">
        <img
          style={{ maxHeight: imageHeight, width: 'auto' }}
          src="/dffe-logo.jpg"
          alt="SA Government"
        />
      </a>

      {/* TITLE */}
      <header
        style={{
          display: 'flex',
          flexBasis: 0,
          flexGrow: 1,
          textAlign: 'center',
          minHeight: imageHeight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title || <Typography>NCCRD</Typography>}
      </header>

      {/* SA FLAG */}
      <a {...aProps} href="http://www.environment.gov.za/">
        <img
          style={{
            maxHeight: imageHeight,
            width: 'auto',
            display: 'block',
            marginLeft: 'auto',
          }}
          src="/sa-flag.jpg"
          alt="SA Government"
        />
      </a>
    </Toolbar_>
  )
}
