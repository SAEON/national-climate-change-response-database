import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <Grid container spacing={4}>
      <Grid item lg={6} sx={{ display: 'flex' }}>
        <Typography
          sx={{
            alignItems: 'center',
            display: 'flex',
            textAlign: 'center',
            marginBottom: theme => theme.spacing(3),
            color: theme => alpha(theme.palette.common.white, 0.9),
          }}
          variant="h4"
        >
          {pageContent.title}
        </Typography>
      </Grid>
      <Grid item lg={6} sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            textAlign: 'left',
            color: theme => alpha(theme.palette.common.white, 0.9),
            marginBottom: theme => theme.spacing(2),
          }}
          variant="body2"
        >
          {pageContent.content}
        </Typography>
      </Grid>
    </Grid>
  )
}
