import { useTheme } from '@mui/material/styles'
import Download from './_download'
import Edit from './_edit'
import Hidden from '@mui/material/Hidden'
import ToolbarHeader from '../../../components/toolbar-header'
import Delete from './_delete'

export default ({ id, title, createdBy }) => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      {/* EDIT */}
      <Edit id={id} />

      {/* DELETE */}
      <div style={{ marginLeft: theme.spacing(2) }} />
      <Delete id={id} createdBy={createdBy} />

      {/* DOWNLOAD PROJECT DATA */}
      <Hidden smDown>
        <div style={{ marginLeft: theme.spacing(2) }} />
        <Download id={id} title={title} />
      </Hidden>
    </ToolbarHeader>
  )
}
