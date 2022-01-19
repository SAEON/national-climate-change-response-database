import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

export default ({ description }) => {
  return (
    <CardContent>
      <Typography
        sx={{
          fontSize: '0.8rem',
          lineHeight: 1.5,
          whiteSpace: 'break-spaces',
          wordBreak: 'break-word',
          lineClamp: 3,
          boxOrient: 'vertical',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
        }}
        variant="body2"
      >
        {description || 'No description'}
      </Typography>
    </CardContent>
  )
}
