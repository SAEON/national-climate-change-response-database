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
  ({ uploading, value, updateForm }) => {
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
                  id="upload-logo"
                  type="file"
                  onChange={e => {
                    update({ value: e.target.files })
                  }}
                />
                <label htmlFor="upload-logo">
                  <Button
                    fullWidth
                    disabled={uploading}
                    variant="outlined"
                    disableElevation
                    size="large"
                    component="span"
                  >
                    Select logo image
                  </Button>
                </label>
                <FormHelperText>
                  Select the logo image to be displayed in the top left corner of the application
                  banner (the default is the Department of Environment, Forestry and Fisheries
                  logo). Dimensions should be 322 x 100 pixels
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
  const { form, setForm, uploadingLogo } = useContext(formContext)

  return (
    <Field
      uploading={uploadingLogo}
      value={form.logo}
      updateForm={logo => setForm({ ...form, logo })}
    />
  )
}
