import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { Link } from 'react-router-dom'
import useStyles from './style'
import ButtonBase from '@material-ui/core/ButtonBase'

const image = {
  url: '/agence-olloweb-d9ILr-dbEdg-unsplash.jpg',
  title: 'Search project database',
  width: '100%',
}

export default () => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Grid container spacing={4}>
      <Grid item sm={6}>
        <div style={{ height: '100%', position: 'relative', boxShadow: theme.shadows[9] }}>
          <div className={classes.root}>
            <ButtonBase
              component={Link}
              to="/projects"
              focusRipple
              key={image.title}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{
                width: image.width,
              }}
            >
              <span
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {image.title}
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </ButtonBase>
          </div>
        </div>
      </Grid>
      <Grid item sm={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{ marginBottom: theme.spacing(3), color: fade(theme.palette.common.black, 0.9) }}
          variant="h4"
        >
          Explore climate mitigation and adaptation projects
        </Typography>
        <Typography style={{ color: fade(theme.palette.common.black, 0.9) }} variant="body1">
          Through the NCCRD each project in the database is broken down into several key areas
          including a general project overview, a description of the funding provided for the
          project, and the details of specific adaptation and mitigation intervention/s in the
          project. For each intervention, additional details are supplied depending on if the
          intervention is considered an applied or research action. Research interventions are
          studies to test some aspect of project implementation whereas applied projects can be
          implemented or rolled out directly at a variety of scales.
        </Typography>
      </Grid>
    </Grid>
  )
}
