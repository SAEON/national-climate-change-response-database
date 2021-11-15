import { memo, useContext, useRef } from 'react'
import { context as formContext } from '../../_context'
import Q from '@saeon/quick-form'
import debounce from '../../../../../../../lib/debounce'
import AceEditor from 'react-ace'
import useTheme from '@mui/material/styles/useTheme'
import Typography from '@mui/material/Typography'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-vibrant_ink'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const Field = memo(
  ({ value, updateForm }) => {
    const theme = useTheme()
    const ref = useRef(null)

    return (
      <>
        <Typography
          style={{ marginTop: theme.spacing(4), display: 'block' }}
          gutterBottom
          variant="overline"
        >
          Theme editor
        </Typography>
        <div
          style={{
            height: 500,
            width: '100%',
            marginBottom: theme.spacing(4),
          }}
        >
          <Q value={JSON.stringify(value, null, 2)}>
            {(update, { value }) => {
              return (
                <AceEditor
                  ref={e => (ref.current = e)}
                  height="100%"
                  width="100%"
                  name={`ace-editor}`}
                  value={value}
                  onValidate={debounce(annotations => {
                    const error = annotations.find(({ type }) => type === 'error')
                    if (!error) updateForm(value)
                  })}
                  onChange={debounce(value => update({ value }))}
                  editorProps={{ $blockScrolling: false, $blockSelectEnabled: true }}
                  mode="json"
                  theme="vibrant_ink"
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
        </div>
      </>
    )
  },
  () => true
)

export default () => {
  const { form, setForm } = useContext(formContext)

  return <Field value={form.theme} updateForm={theme => setForm({ ...form, theme })} />
}
