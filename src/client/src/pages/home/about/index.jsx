import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import OlReact from '../../../components/ol-react'

export default () => {
  const theme = useTheme()

  return (
    <Grid container spacing={4}>
      <Grid item sm={6}>
        <Typography
          style={{ marginBottom: theme.spacing(3), color: fade(theme.palette.common.white, 0.9) }}
          variant="h4"
        >
          Welcome to the National Climate Change Response Database
        </Typography>
        <Typography style={{ color: fade(theme.palette.common.white, 0.9) }} variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industrys standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
      </Grid>
      <Grid item sm={6} style={{ flexGrow: 1 }}>
        <div style={{ minHeight: 300, height: '100%', boxShadow: theme.shadows[9] }}>
          <OlReact />
        </div>
      </Grid>
    </Grid>
  )
}
