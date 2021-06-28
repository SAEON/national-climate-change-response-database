import Avatar from '@material-ui/core/Avatar'
import useStyles from './style'
import clsx from 'clsx'
import CompleteIcon from 'mdi-react/CheckBoldIcon'

export default ({ i, complete, started, disabled, enabled }) => {
  const classes = useStyles()

  return (
    <Avatar
      className={clsx(classes.small, {
        [classes.started]: started && !complete,
        [classes.completeAvatar]: complete,
        [classes.disabled]: disabled,
        [classes.enabled]: enabled,
      })}
    >
      {!complete && i}
      {complete && <CompleteIcon className={clsx(classes.complete)} />}
    </Avatar>
  )
}
