import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Icon from 'mdi-react/ContentCopyIcon'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import MessageDialogue from '../../../../components/message-dialogue'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'
import CheckIcon from 'mdi-react/CheckCircleIcon'

export default () => {
  const [copied, setCopied] = useState(false)
  const theme = useTheme()

  return (
    <MessageDialogue
      title="Share submission form link"
      text={
        <>
          <Typography gutterBottom>
            This form will be available on the link below until it is submitted. After the form is
            submitted you can search for this submission on the project page and edit from there
          </Typography>
          <pre style={{ ...theme.pre }}>{window.location.href}</pre>
        </>
      }
      tooltipProps={{
        placement: 'bottom',
        title: 'Share form',
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
            startIcon={copied ? <CheckIcon size={18} /> : <Icon size={18} />}
            onClick={e => {
              navigator.clipboard.writeText(window.location.href)
              setCopied(true)
              if (copied) {
                closeFn(e)
              }
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        ),
      ]}
    />
  )
}
