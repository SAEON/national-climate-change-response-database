import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  minWidth: 300,
  minHeight: 300,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
  },
  '& .MuiTypography-root': {
    outline: '2px solid transparent',
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      outline: '2px solid currentColor',
    },
  },
  transition: theme.transitions.create(['border']),
  border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
  '&:hover': {
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },
}))

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
})

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}))

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}))

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}))

export default ({ image, to }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      <ImageButton
        component={Link}
        focusRipple
        key={image.title}
        to={to}
        style={{
          width: image.width,
        }}
      >
        <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: theme => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >
            {image.title}
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
    </Box>
  )
}
