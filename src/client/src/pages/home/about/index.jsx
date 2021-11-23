import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)
  const theme = useTheme()

  return (
    <Grid container spacing={4}>
      <Grid item lg={6} style={{ display: 'flex' }}>
        <Typography
          style={{
            alignItems: 'center',
            display: 'flex',
            textAlign: 'center',
            marginBottom: theme.spacing(3),
            color: alpha(theme.palette.common.white, 0.9),
          }}
          variant="h4"
        >
          {pageContent.title}
        </Typography>
      </Grid>
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{
            textAlign: 'left',
            color: alpha(theme.palette.common.white, 0.9),
            marginBottom: theme.spacing(2),
          }}
          variant="body2"
        >
          {pageContent.content}
        </Typography>
      </Grid>
    </Grid>
  )
}
