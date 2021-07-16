import Card from '@material-ui/core/Card'
import { Link } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTheme from '@material-ui/core/styles/useTheme'
import Tooltip from '@material-ui/core/Tooltip'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import SyncIcon from 'mdi-react/SyncIcon'

export default ({ syncing, style, submissionId }) => {
  const theme = useTheme()
  const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'))
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
