import IconButton from '@material-ui/core/IconButton'
import Icon from 'mdi-react/ContentCopyIcon'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import MessageDialogue from '../../../../components/message-dialogue'

export default () => {
  return (
    <MessageDialogue
      title="Share submission form"
      text={'Use this link to come back to the form later, and continue editing it'}
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
                startIcon={<Icon size={18} />}
              >
                Copy form-link
              </Button>
            </Hidden>
            <Hidden smUp>
              <IconButton onClick={openFn} size="small" color="primary">
                <Icon size={18} />
              </IconButton>
            </Hidden>
          </>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            key="delete-project"
            startIcon={<Icon size={18} />}
            onClick={e => {
              closeFn(e)
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Copy link (not implemented yet)
          </Button>
        ),
      ]}
    />
  )
}
