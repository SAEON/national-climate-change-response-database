import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { alpha } from '@material-ui/core/styles/colorManipulator'

export default () => {
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
          Welcome to the National Climate Change Response Database
        </Typography>
      </Grid>
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{
            textAlign: 'justify',
            color: alpha(theme.palette.common.white, 0.9),
            marginBottom: theme.spacing(2),
          }}
          variant="body1"
        >
          South Africa has committed to a low carbon trajectory that encompasses both its
          contribution to the international effort to reduce global Greenhouse Gas (GHG) emissions;
          and its ambitions toward development and poverty eradication. The country is projected to
          face a higher frequency of climate related disasters that are increasing in intensity, and
          these events are likely to be associated with impacts that are on par with, if not worse
          than those already experienced. The National Climate Change Response Database (NCCRD) is
          intended as a resource to inform anyone currently working on climate change (adaptation
          and mitigation) on past, current and future climate change response efforts (policies,
          plans, strategies, projects and research) across South Africa.
        </Typography>
      </Grid>
    </Grid>
  )
}
