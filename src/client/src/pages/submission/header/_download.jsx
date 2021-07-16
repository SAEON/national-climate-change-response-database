import Hidden from '@material-ui/core/Hidden'
import Download from '../../../components/download-record'

export default ({ id, title }) => {
  return (
    <Hidden smDown>
      <Download variant="text" id={id} title={title} />
    </Hidden>
  )
}
