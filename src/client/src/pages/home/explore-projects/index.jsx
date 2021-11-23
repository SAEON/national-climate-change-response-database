import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import useStyles from './style'
import ButtonBase from '@mui/material/ButtonBase'

const image = {
  url: '/agence-olloweb-d9ILr-dbEdg-unsplash.jpg',
  title: 'Search project database',
  width: '100%',
}

export default () => {
  const { explore: pageContent } = JSON.parse(useContext(clientContext).frontMatter)
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
          {pageContent.title}
        </Typography>
        <Typography
          style={{ textAlign: 'left', color: alpha(theme.palette.common.black, 0.9) }}
          variant="body2"
        >
          {pageContent.content}
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
