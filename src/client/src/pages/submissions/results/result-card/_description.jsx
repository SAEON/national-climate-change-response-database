import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  text: {
    fontSize: '0.8rem',
    lineHeight: 1.5,
    whiteSpace: 'break-spaces',
    wordBreak: 'break-word',
    lineClamp: 3,
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
  },
}))

export default ({ description }) => {
  const classes = useStyles()
  return (
    <CardContent>
      <Typography className={clsx(classes.text)} variant="body2">
        {description || 'No description'}
      </Typography>
    </CardContent>
  )
}
