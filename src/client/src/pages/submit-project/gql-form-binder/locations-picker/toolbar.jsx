import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from 'mdi-react/DeleteIcon'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ setPoints }) => {
  const theme = useTheme()
  return (
    <Card
      variant="outlined"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        margin: '10px 10px 0 0',
        padding: theme.spacing(1),
        backgroundColor: theme.backgroundColor,
      }}
    >
      <Tooltip title={'Remove all points'}>
        <span>
          <IconButton size="small" onClick={() => setPoints([])}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Card>
  )
}
