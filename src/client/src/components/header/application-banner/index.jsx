import Typography from '@mui/material/Typography'
import Toolbar_ from './toolbar'
import Hidden from '@mui/material/Hidden'

export const IMAGE_HEIGHT = 93

export const Toolbar = Toolbar_

const aProps = {
  style: { flexBasis: 0, flexGrow: 1, margin: 8, display: 'flex' },
  target: '_blank',
  rel: 'noreferrer',
}

export default ({ title }) => {
  return (
    <Toolbar_>
      {/* DFFE LOGO */}
      <Hidden lgDown>
        <a {...aProps} href="http://www.environment.gov.za/">
          <img
            style={{ maxHeight: IMAGE_HEIGHT, width: 'auto' }}
            src="/dffe-logo.jpg"
            alt="SA Government"
          />
        </a>
      </Hidden>

      {/* TITLE */}
      <header
        style={{
          display: 'flex',
          flexBasis: 0,
          flexGrow: 1,
          textAlign: 'center',
          minHeight: IMAGE_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title || <Typography>NCCRD</Typography>}
      </header>

      {/* SA FLAG */}
      <Hidden lgDown>
        <a {...aProps} href="http://www.environment.gov.za/">
          <img
            style={{
              maxHeight: IMAGE_HEIGHT,
              width: 'auto',
              display: 'block',
              marginLeft: 'auto',
            }}
            src="/sa-flag.jpg"
            alt="SA Government"
          />
        </a>
      </Hidden>
    </Toolbar_>
  )
}
