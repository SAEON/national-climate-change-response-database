import { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import AceEditor from 'react-ace'
import { gql, useMutation } from '@apollo/client'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import Q from '@saeon/quick-form'

export default ({ row, column: { key }, onClose }) => {
  const value = row[key]
  const valueRef = useRef(value)
  const ref = useRef(null)

  const [updateTenant, { error, loading }] = useMutation(
    gql`
      mutation updateTenant($id: ID!, $input: TenantInput!) {
        updateTenant(id: $id, input: $input) {
          id
        }
      }
    `,
    {
      update: (cache, { data: { updateTenant: tenant } }) => {
        onClose()
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <Dialog
      maxWidth="xl"
      onClose={(e, reason) => {
        if (loading) {
          if (reason) {
            return
          }
        }
        onClose()
      }}
      open={true}
    >
      <DialogTitle>JSON editor</DialogTitle>
      <DialogContent dividers style={{ width: 800, height: 800, padding: 0 }}>
        <Q value={JSON.stringify(JSON.parse(value), null, 2)}>
          {(update, { value }) => {
            return (
              <AceEditor
                ref={e => (ref.current = e)}
                height="100%"
                width="100%"
                name={`ace-editor}`}
                onValidate={annotations => {
                  const error = annotations.find(({ type }) => type === 'error')
                  if (!error) valueRef.current = value
                }}
                onChange={value => update({ value })}
                defaultValue={value}
                editorProps={{ $blockScrolling: false, $blockSelectEnabled: true }}
                mode="json"
                theme="chrome"
                setOptions={{
                  wrap: true,
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  firstLineNumber: 1,
                  newLineMode: 'unix',
                  useSoftTabs: true,
                  tabSize: 2,
                  scrollPastEnd: 8,
                  selectionStyle: 'line',
                  highlightActiveLine: true,
                  highlightSelectedWord: true,
                  cursorStyle: 'ace',
                  animatedScroll: true,
                  displayIndentGuides: true,
                  fadeFoldWidgets: true,
                  vScrollBarAlwaysVisible: false,
                  scrollSpeed: 1,
                  highlightGutterLine: true,
                  fontSize: 12,
                  fixedWidthGutter: true,
                  showPrintMargin: false,
                }}
              />
            )
          }}
        </Q>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} variant="text" disableElevation size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="text"
          disableElevation
          size="small"
          onClick={() => {
            updateTenant({
              variables: {
                id: row.id,
                input: {
                  [key]: JSON.parse(valueRef.current),
                },
              },
            })
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
