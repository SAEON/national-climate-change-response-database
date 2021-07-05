import { memo, useMemo } from 'react'
import useTheme from '@material-ui/core/styles/useTheme'
import ListInput from './list-input'
import Typography from '@material-ui/core/Typography'
import QuickForm from '../../../../quick-form'
import debounce from '../../../../../lib/debounce'

const LocationBounds = memo(
  ({ points, setPoints }) => {
    const theme = useTheme()
    const effect = useMemo(() => debounce(({ points }) => setPoints(points)), [setPoints])

    return (
      <QuickForm effect={effect} points={points}>
        {(update, { points }) => {
          return (
            <div style={{ marginTop: theme.spacing(3) }}>
              <Typography
                style={{ display: 'block', textAlign: 'center', marginBottom: theme.spacing(1) }}
                variant="overline"
              >
                Add GPS location points
              </Typography>
              <div
                style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}
              >
                <ListInput setPoints={points => update({ points })} points={points} />
              </div>
            </div>
          )
        }}
      </QuickForm>
    )
  },
  /**
   * State is managed internally, and synced
   * to context.
   *
   * Never re-render this component once mounted
   */
  () => true
)

export default ({ onChange, points, setPoints }) => {
  return <LocationBounds onChange={onChange} points={points} setPoints={setPoints} />
}
