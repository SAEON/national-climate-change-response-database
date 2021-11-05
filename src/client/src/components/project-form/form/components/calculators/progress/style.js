import makeStyles from '@mui/styles/makeStyles';

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
