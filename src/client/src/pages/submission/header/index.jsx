import { useTheme } from '@mui/material/styles'
import Download from './_download'
import Edit from './_edit'
import Hidden from '@mui/material/Hidden'
import ToolbarHeader from '../../../components/toolbar-header'

export default ({ id, title }) => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      {/* EDIT */}
      <Edit id={id} />

      {/* DOWNLOAD PROJECT DATA */}
      <Hidden smDown>
        <div style={{ marginLeft: theme.spacing(2) }} />
        <Download id={id} title={title} />
      </Hidden>
    </ToolbarHeader>
  )
}
