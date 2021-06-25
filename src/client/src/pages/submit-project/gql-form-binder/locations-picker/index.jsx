import { memo } from 'react'
import useTheme from '@material-ui/core/styles/useTheme'
import ListInput from './list-input'
import Typography from '@material-ui/core/Typography'

const LocationBounds = memo(({ onChange, points, setPoints }) => {
  const theme = useTheme()

  return (
    <div style={{ marginTop: theme.spacing(3) }}>
      <Typography
        style={{ display: 'block', textAlign: 'center', marginBottom: theme.spacing(1) }}
        variant="overline"
      >
        Add GPS location points
      </Typography>
      <div style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}>
        <ListInput setPoints={setPoints} addPoint={onChange} points={points} />
      </div>
    </div>
  )
})

export default ({ onChange, points, setPoints }) => {
  return <LocationBounds onChange={onChange} points={points} setPoints={setPoints} />
}
