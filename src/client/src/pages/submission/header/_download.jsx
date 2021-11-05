import Hidden from '@mui/material/Hidden'
import Download from '../../../components/download-record'

export default ({ id, title }) => {
  return (
    <Hidden mdDown>
      <Download variant="text" id={id} title={title} />
    </Hidden>
  )
}
