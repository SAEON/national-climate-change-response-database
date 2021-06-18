import Icon from 'mdi-react/FileDownloadIcon'
import Button from '@material-ui/core/Button'
import MessageDialogue from '../../../../components/message-dialogue'

export default () => {
  return (
    <MessageDialogue
      title="Download Excel template"
      text="Download the project-submission Excel template for individual submission and/or bulk submission"
      tooltipProps={{
        placement: 'bottom',
        title: 'Download Excel submission template',
      }}
      Button={openFn => {
        return (
          <Button
            onClick={openFn}
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<Icon size={18} />}
          >
            Download Excel template
          </Button>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            key="submit-project-by-excel-template"
            startIcon={<Icon size={18} />}
            onClick={e => {
              closeFn(e)
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
