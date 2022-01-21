import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Toolbar_ from './toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme'
import { HOSTNAME } from '../../../config'
import { A, Img, Header } from '../../html-tags'

export const useImageHeight = () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  if (lgUp) return 93
  return 40
}

export const Toolbar = Toolbar_

const aProps = {
  style: { flexBasis: 0, flexGrow: 1, margin: 8, display: 'flex' },
  target: '_blank',
  rel: 'noreferrer',
}

export default () => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const { title, shortTitle, description, logoUrl, flagUrl } = useContext(clientContext)
  const imageHeight = useImageHeight()

  return (
    <Toolbar_>
      {/* DFFE LOGO */}

      <A {...aProps} href="http://www.environment.gov.za/">
        <Img
          crossOrigin="use-credentials"
          style={{ maxHeight: imageHeight, width: 'auto' }}
          src={`${HOSTNAME}/${logoUrl}`}
          alt={`Logo: ${title} (${description})`}
        />
      </A>

      {/* TITLE */}
      <Header
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
        <Tooltip title={description}>
          <Typography
            style={mdDown ? { fontSize: '16px' } : {}}
            color="textPrimary"
            variant="h5"
            variantMapping={{ h5: 'h1' }}
          >
            {mdDown ? shortTitle : title}
          </Typography>
        </Tooltip>
      </Header>

      {/* SA FLAG */}
      <A {...aProps} href="http://www.environment.gov.za/">
        <Img
          style={{
            maxHeight: imageHeight,
            width: 'auto',
            display: 'block',
            marginLeft: 'auto',
          }}
          src={`${HOSTNAME}/${flagUrl}`}
          alt={`Flag: ${title} (${description})`}
          crossOrigin="use-credentials"
        />
      </A>
    </Toolbar_>
  )
}
