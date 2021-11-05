import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import Toolbar from './toolbar'
import { useTheme } from '@mui/material/styles';

export const IMAGE_HEIGHT = 93

export default () => {
  const theme = useTheme()
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Toolbar>
      {/* DFFE LOGO */}
      <a
        style={{ display: 'flex', flexBasis: 0, flexGrow: 1 }}
        target="_blank"
        rel="noreferrer"
        href="http://www.environment.gov.za/"
      >
        <img
          style={{ maxHeight: IMAGE_HEIGHT, width: 'auto' }}
          src="/dffe-logo.jpg"
          alt="SA Government"
        />
      </a>

      {/* TITLE */}
      {mdAndUp && (
        <MuiLink component={Link} to="/" underline="hover">
          <Typography
            color="textPrimary"
            style={{ display: 'flex', flexBasis: 0, flexGrow: 1, textAlign: 'center' }}
            variant="h1"
          >
            {lgAndUp ? 'National Climate Change Response Database' : 'NCCRD'}
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
  );
}
