import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import { Link } from 'react-router-dom'
import useStyles from './style'
import ButtonBase from '@material-ui/core/ButtonBase'

const image = {
  url: '/aaron-burden-CKlHKtCJZKk-unsplash.jpg',
  title: 'Submit a new project',
  width: '100%',
}

export default () => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Grid container spacing={4}>
      {/* DESCRIPTION */}
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{
            textAlign: 'center',
            marginBottom: theme.spacing(3),
            color: alpha(theme.palette.common.white, 0.9),
          }}
          variant="h4"
        >
          Submit a project to the National Climate Change Response Database
        </Typography>
        <Typography
          style={{ textAlign: 'justify', color: alpha(theme.palette.common.white, 0.9) }}
          variant="body1"
        >
          The NCCRD is designed to capture and store the details of climate change interventions
          including adaptation, mitigation and crosscutting efforts from across South African
          industrial, research, non-governmental organisations, government bodies and entities. The
          submission of information to the database is entirely voluntary and the accuracy of the
          information cannot be guaranteed. Project managers are responsible for adding and
          maintaining information about their projects. Projects are reviewed and have to be
          accepted by DFFE prior to becoming available in the system.
        </Typography>
      </Grid>

      {/* BUTTON */}
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <div style={{ height: '100%', position: 'relative', boxShadow: theme.shadows[9] }}>
          <div className={classes.root}>
            <ButtonBase
              component={Link}
              to="/submissions/new"
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
    </Grid>
  )
}
