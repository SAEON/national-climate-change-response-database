import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import RefreshIcon from 'mdi-react/RefreshIcon'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <Grid container spacing={2} style={{ marginTop: theme.spacing(2) }}>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          startIcon={<RefreshIcon />}
          color="secondary"
          variant="contained"
          disableElevation
          onClick={() => window.location.reload()}
        >
          Reset form
        </Button>
      </Grid>
    </Grid>
  )
}
