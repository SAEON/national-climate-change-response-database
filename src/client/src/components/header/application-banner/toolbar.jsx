import Toolbar from '@mui/material/Toolbar'

export default props => {
  const { style, ...otherProps } = props

  return (
    <Toolbar
      disableGutters
      style={Object.assign(
        {
          display: 'flex',
          justifyContent: 'space-between',
        },
        otherProps
      )}
      {...otherProps}
    />
  )
}
