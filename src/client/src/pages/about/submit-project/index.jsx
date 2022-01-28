import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Div } from '../../../components/html-tags'
import { alpha } from '@mui/material/styles'
import ImageButton from '../../../components/image-button'

export default () => {
  const { submit: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <Grid container spacing={4}>
      {/* DESCRIPTION */}
      <Grid item lg={6} sx={{ flexGrow: 1 }}>
        <Typography
          sx={theme => ({
            textAlign: 'center',
            marginBottom: theme.spacing(3),
            color: alpha(theme.palette.common.white, 0.9),
          })}
          variant="h4"
        >
          {pageContent.title}
        </Typography>
        <Typography
          sx={{ textAlign: 'left', color: theme => alpha(theme.palette.common.white, 0.9) }}
          variant="body2"
        >
          {pageContent.content}
        </Typography>
      </Grid>

      {/* BUTTON */}
      <Grid item lg={6} sx={{ flexGrow: 1 }}>
        <Div sx={{ height: '100%', position: 'relative' }}>
          <ImageButton
            image={{
              url: '/aaron-burden-CKlHKtCJZKk-unsplash.jpg',
              title: 'Submit a new project',
              width: '100%',
            }}
            to="/submissions/new"
          />
        </Div>
      </Grid>
    </Grid>
  )
}
