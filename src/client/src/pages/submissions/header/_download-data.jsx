import Hidden from '@mui/material/Hidden'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import DownloadRecord from '../../../components/download-record'

export default () => {
  const theme = useTheme()

  return (
    <>
      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

      <Hidden mdDown>
        <DownloadRecord
          buttonTitle="Download submission data"
          title="All (filtered) submissions"
          search={'everything'}
        />
      </Hidden>
    </>
  )
}
