import makeStyles from '@mui/styles/makeStyles'

export default makeStyles(theme => {
  return {
    card: {
      borderRadius: 0,
    },
    buttonBase: {
      backgroundColor: theme.palette.common.white,
      transition: theme.transitions.create(['all']),
      [theme.breakpoints.up('lg')]: {
        minHeight: theme.spacing(10),
      },
    },
    active: {
      transition: theme.transitions.create(['all']),
      backgroundColor: '#b2cebe',
      [theme.breakpoints.up('lg')]: {
        minHeight: theme.spacing(16),
      },
    },
    disabled: {
      backgroundColor: theme.palette.grey[200],
    },
  }
})
