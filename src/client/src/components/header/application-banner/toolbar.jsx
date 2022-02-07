import Toolbar from '@mui/material/Toolbar'

export default ({ sx, ...props }) => {
  return (
    <Toolbar
      disableGutters
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: theme => theme.spacing(1),
        ...sx,
      }}
      {...props}
    />
  )
}
