import Icon from 'mdi-react/MicrosoftExcelIcon'
import Button from '@material-ui/core/Button'

import MessageDialogue from '../../../../components/message-dialogue'

export default () => {
  return (
    <MessageDialogue
      title="Submit project via Excel file upload"
      text="TODO"
      tooltipProps={{
        placement: 'bottom',
        title: 'Submit project via Excel template',
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
            Upload project(s)
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
