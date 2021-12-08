import { memo, useContext, useMemo } from 'react'
import { context as formContext } from '../../_context'
import FileIcon from 'mdi-react/FileIcon'
import useTheme from '@mui/material/styles/useTheme'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Q from '@saeon/quick-form'
import debounce from '../../../../../../../lib/debounce'

const Field = memo(
  ({ value, updateForm }) => {
    const theme = useTheme()
    const effect = useMemo(() => debounce(({ value }) => updateForm(value)), [updateForm])

    return (
      <Q effects={[effect]} value={value}>
        {(update, { value }) => {
          return (
            <div style={{ marginTop: theme.spacing(2) }}>
              {/* UPLOAD CONTROL */}
              <FormControl margin="normal" fullWidth variant="outlined">
                <input
                  accept=".jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  id="upload-flag"
                  type="file"
                  onChange={e => {
                    update({ value: e.target.files })
                  }}
                />
                <label htmlFor="upload-flag">
                  <Button
                    fullWidth
                    variant="outlined"
                    disableElevation
                    size="large"
                    component="span"
                  >
                    Select flag image
                  </Button>
                </label>
                <FormHelperText>
                  Select the flag image to be displayed in the top right corner of the application
                  banner (the default is the South African flag). Dimensions should be 150 x 93
                  pixels
                </FormHelperText>
              </FormControl>

              {/* SELECTION SUMMARY */}
              {[...value].map(file => {
                return (
                  <Typography key={file.name} variant="body2" style={{ display: 'flex' }}>
                    <FileIcon size={18} style={{ marginRight: theme.spacing(1) }} /> {file.name}
                  </Typography>
                )
              })}
            </div>
          )
        }}
      </Q>
    )
  },
  () => true
)

export default () => {
  const { form, setForm } = useContext(formContext)

  return <Field value={form.flag} updateForm={flag => setForm({ flag })} />
}
