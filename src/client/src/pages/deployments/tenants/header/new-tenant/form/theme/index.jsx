import { memo, useContext, useRef, useEffect } from 'react'
import { context as formContext } from '../../_context'
import { context as themeContext } from '../../../../../../../contexts/theme'
import Q from '@saeon/quick-form'
import AceEditor from 'react-ace'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const Field = memo(
  ({ value, updateForm, updateTheme, resetTheme }) => {
    const ref = useRef(null)

    useEffect(() => {
      return () => {
        resetTheme()
      }
    }, [resetTheme])

    return (
      <>
        <div
          style={{
            height: '100%',
            width: '100%',
            border: '1px solid #c4c4c4',
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
                  onValidate={annotations => {
                    const error = annotations.find(({ type }) => type === 'error')
                    if (!error) {
                      updateForm(JSON.parse(value))
                      updateTheme(JSON.parse(value))
                    }
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
        </div>
      </>
    )
  },
  () => true
)

export default () => {
  const { form, setForm } = useContext(formContext)
  const { updateTheme, resetTheme } = useContext(themeContext)

  return (
    <Field
      resetTheme={resetTheme}
      updateTheme={updateTheme}
      value={form.theme}
      updateForm={theme => setForm({ ...form, theme })}
    />
  )
}
