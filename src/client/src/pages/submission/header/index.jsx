import Download from './_download'
import Edit from './_edit'
import Hidden from '@mui/material/Hidden'
import ToolbarHeader from '../../../components/toolbar-header'
import Delete from './_delete'
import { Div } from '../../../components/html-tags'

export default ({ id, title, createdBy }) => {
  return (
    <ToolbarHeader>
      {/* EDIT */}
      <Edit id={id} />

      {/* DELETE */}
      <Delete id={id} createdBy={createdBy} />

      {/* DOWNLOAD PROJECT DATA */}
      <Hidden smDown>
        <Div sx={{ marginLeft: theme => theme.spacing(1) }} />
        <Download id={id} title={title} />
      </Hidden>
    </ToolbarHeader>
  )
}
