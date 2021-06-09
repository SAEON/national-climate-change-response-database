import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from 'mdi-react/RefreshIcon'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import MessageDialogue from '../../components/message-dialogue'

export default () => {
  return (
    <MessageDialogue
      title="Confirm reset"
      text="Are you sure you want to reset the form? All your entered data will be lost"
      tooltipProps={{
        placement: 'bottom',
        title: 'Reset form',
      }}
      Button={openFn => {
        return (
          <>
            <Hidden xsDown>
              <Button
                onClick={openFn}
                disableElevation
                size="small"
                variant="text"
                color="primary"
                startIcon={<RefreshIcon size={18} />}
              >
                Reset form
              </Button>
            </Hidden>
            <Hidden smUp>
              <IconButton onClick={openFn} size="small" color="primary">
                <RefreshIcon size={18} />
              </IconButton>
            </Hidden>
          </>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            key="delete-project"
            startIcon={<RefreshIcon size={18} />}
            onClick={e => {
              closeFn(e)
              window.location.reload()
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        ),
      ]}
    />
  )
}
