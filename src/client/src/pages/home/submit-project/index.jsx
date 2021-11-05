import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import useStyles from './style'
import ButtonBase from '@mui/material/ButtonBase'

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
          style={{ textAlign: 'left', color: alpha(theme.palette.common.white, 0.9) }}
          variant="body2"
        >
          Although the submission of information to the database is voluntary, data providers are
          encouraged to upload and update the information into the database to benefit a wide range
          of use cases in the country. While the administrator of the database (DFFE) takes all
          necessary steps to ensure quality of captured data, users of the information should note
          that accuracy of the information captured herein cannot be guaranteed. The database
          presents a platform where Project managers can upload information on their projects’
          details as well as to provide periodic updates. The database is beneficial in supporting
          various use cases in support of the National Climate Change Policy (2011) imperatives. The
          submitted data supports the undertaking of climate change monitoring and evaluation to
          track South Africa’s transition to a lower carbon economy and climate resilient society.
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
