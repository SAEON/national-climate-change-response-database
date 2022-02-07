import { useContext, forwardRef } from 'react'
import { context as dataContext } from '../context'
import DownloadExcelTemplate from '../../../components/download-template'
import UploadProject from '../../../components/submit-template'
import NewSubmission from '../../../components/new-submission'
import ToolbarHeader from '../../../components/toolbar-header'
import { Div } from '../../../components/html-tags'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import CountSummary from './count-summary'

export default forwardRef((props, ref) => {
  const { data } = useContext(dataContext)

  return (
    <ToolbarHeader ref={ref}>
      <NewSubmission />
      <Hidden mdDown>
        <Div sx={{ marginLeft: theme => theme.spacing(2) }} />
        <DownloadExcelTemplate />
        <Div sx={{ marginLeft: theme => theme.spacing(2) }} />
        <UploadProject />
        <Divider
          flexItem
          orientation="vertical"
          sx={{ marginLeft: theme => theme.spacing(2), marginRight: theme => theme.spacing(2) }}
        />
      </Hidden>
      <Div sx={{ marginRight: 'auto' }} />
      <Hidden smDown>
        <CountSummary PROJECT_COUNT={data?.PROJECT_COUNT} />
      </Hidden>
    </ToolbarHeader>
  )
})
