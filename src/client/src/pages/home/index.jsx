import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Grid from '@material-ui/core/Grid'

export default () => {
  const theme = useTheme()
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>Content</CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
