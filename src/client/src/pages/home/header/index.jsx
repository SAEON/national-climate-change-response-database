// TODO clean up unused
import { useContext, forwardRef } from 'react'
import { context as dataContext } from '../context'
import DownloadExcelTemplate from '../../../components/download-template'
import { Link } from 'react-router-dom'
import NewSubmission from '../../../components/new-submission'
import ToolbarHeader from '../../../components/toolbar-header'
import { Div } from '../../../components/html-tags'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import CountSummary from './count-summary'
import Button from '@mui/material/Button'
import Icon_ from 'mdi-react/SearchIcon'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

const Icon = styled(Icon_)({})

export default forwardRef((props, ref) => {
  const { data } = useContext(dataContext)
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <ToolbarHeader ref={ref}>
      <Tooltip placement="bottom" title="Search submissions database">
        <span>
          <Hidden smDown>
            <Button
              component={Link}
              to="/submissions"
              disableElevation
              size="small"
              variant="text"
              color="primary"
              startIcon={lgUp ? <Icon size={18} /> : null}
            >
              Search data
            </Button>
          </Hidden>
          <Hidden smUp>
            <IconButton component={Link} to="/submissions" size="small" color="primary">
              <Icon size={18} />
            </IconButton>
          </Hidden>
        </span>
      </Tooltip>

      <Divider
        flexItem
        orientation="vertical"
        sx={{ marginLeft: theme => theme.spacing(2), marginRight: theme => theme.spacing(2) }}
      />
      <NewSubmission />
      <Hidden mdDown>
        <Div sx={{ marginLeft: theme => theme.spacing(2) }} />
        <DownloadExcelTemplate />
        {/* <Div sx={{ marginLeft: theme => theme.spacing(2) }} /> */}
        {/* <UploadProject /> */}
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
