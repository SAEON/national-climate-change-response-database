import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles(() => {
  return {
    cell: {
      padding: '0px !important',
      '&> div': {
        flexGrow: 1,
      },
    },
  }
})
