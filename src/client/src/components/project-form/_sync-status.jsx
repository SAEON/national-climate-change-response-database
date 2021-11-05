import Card from '@mui/material/Card'
import { Link } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import SyncIcon from 'mdi-react/SyncIcon'

export default ({ syncing, style, submissionId }) => {
  const theme = useTheme()
  const xsAndDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Tooltip title={'Save edits'} placement="top-end">
      <Card
        variant="outlined"
        style={{
          flexBasis: mdAndUp ? 'auto' : 0,
          flexGrow: 1,
          border: 'none',
          ...style,
        }}
      >
        <ButtonBase component={Link} to={`/submissions/${submissionId}`} style={{ width: '100%' }}>
          <ListItem>
            {smAndUp && (
              <ListItemText
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                primary={'Save submission edits'}
                secondary={
                  mdAndUp && syncing ? (
                    <Fade timeout={1000} in={syncing} key="syncing">
                      <Typography component="span">Saving form</Typography>
                    </Fade>
                  ) : (
                    <Fade timeout={1000} in={!syncing} key="synced">
                      <Typography component="span">Form saved</Typography>
                    </Fade>
                  )
                }
              />
            )}
            {(xsAndDown || mdAndUp) && (
              <ListItemIcon style={{ justifyContent: 'center' }}>
                {syncing ? (
                  <SyncIcon
                    size={24}
                    style={{
                      color: theme.palette.warning.main,
                    }}
                  />
                ) : (
                  <SyncIcon
                    size={24}
                    style={{
                      color: theme.palette.success.main,
                    }}
                  />
                )}
              </ListItemIcon>
            )}
          </ListItem>
        </ButtonBase>
      </Card>
    </Tooltip>
  )
}
