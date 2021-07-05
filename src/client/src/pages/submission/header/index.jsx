import useTheme from '@material-ui/core/styles/useTheme'
import Download from './_download'
import Edit from './_edit'
import Hidden from '@material-ui/core/Hidden'
import ToolbarHeader from '../../../components/toolbar-header'

export default ({ id }) => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      {/* EDIT */}
      <Edit id={id} />

      {/* DOWNLOAD PROJECT DATA */}
      <Hidden xsDown>
        <div style={{ marginLeft: theme.spacing(2) }} />
        <Download />
      </Hidden>
    </ToolbarHeader>
  )
}
