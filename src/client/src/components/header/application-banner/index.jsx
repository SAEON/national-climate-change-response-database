import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Toolbar_ from './toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme'
import { HOSTNAME } from '../../../config'
import { A, Img, Header, Div } from '../../html-tags'

export const useImageHeight = () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  if (lgUp) return 93
  return 40
}

export const Toolbar = Toolbar_

export default () => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const { title, shortTitle, description, logoUrl, flagUrl } = useContext(clientContext)
  const imageHeight = useImageHeight()

  return (
    <Toolbar_>
      {/* DFFE LOGO */}

      <Div sx={{ flexBasis: 0, flexGrow: 1, margin: theme => theme.spacing(1), display: 'flex' }}>
        <A sx={{ target: '_blank', rel: 'noreferrer' }} href="http://www.environment.gov.za/">
          <Img
            crossOrigin="use-credentials"
            sx={{ maxHeight: imageHeight, width: 'auto' }}
            src={`${HOSTNAME}/${logoUrl}`}
            alt={`Logo: ${title} (${description})`}
          />
        </A>
      </Div>

      {/* TITLE */}
      <Header
        sx={{
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
            sx={mdDown ? { fontSize: '16px' } : {}}
            color="textPrimary"
            variant="h5"
            variantMapping={{ h5: 'h1' }}
          >
            {mdDown ? shortTitle : title}
          </Typography>
        </Tooltip>
      </Header>

      {/* SA FLAG */}
      <Div
        sx={{
          flexBasis: 0,
          flexGrow: 1,
          margin: theme => theme.spacing(1),
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <A sx={{ maxHeight: imageHeight, width: 'auto' }} href="http://www.environment.gov.za/">
          <Img
            sx={{
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
      </Div>
    </Toolbar_>
  )
}
