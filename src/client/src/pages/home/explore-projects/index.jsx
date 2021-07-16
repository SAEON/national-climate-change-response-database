import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { alpha } from '@material-ui/core/styles/colorManipulator'
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
      {/* DESCRIPTION */}
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{
            textAlign: 'center',
            marginBottom: theme.spacing(3),
            color: alpha(theme.palette.common.black, 0.9),
          }}
          variant="h4"
        >
          Explore climate mitigation and adaptation projects
        </Typography>
        <Typography
          style={{ textAlign: 'left', color: alpha(theme.palette.common.black, 0.9) }}
          variant="body2"
        >
          The NCCRD is part of the National Climate Change Information System. It is designed to
          capture and store the details of climate change interventions including adaptation,
          mitigation and crosscutting efforts from across wide range of stakeholders in South Africa
          such as industrial entities, research, non-governmental organisations as well as
          government institutions and entities. Information on climate change related projects
          contained in the NCCRD include details mitigation and adaptation projects that features
          specifications on general project overview, description of funding sources and details
          about project supporters as well as related activity data related to the projects
        </Typography>
      </Grid>

      {/* BUTTON */}
      <Grid item lg={6} style={{ flexGrow: 1 }}>
        <div style={{ height: '100%', position: 'relative', boxShadow: theme.shadows[9] }}>
          <div className={classes.root}>
            <ButtonBase
              component={Link}
              to="/submissions"
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
