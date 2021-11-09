import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { useTheme } from '@mui/material/styles'

export default ({ points, setPoints }) => {
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
          <IconButton disabled={!points.length} size="small" onClick={() => setPoints([])}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Card>
  )
}
