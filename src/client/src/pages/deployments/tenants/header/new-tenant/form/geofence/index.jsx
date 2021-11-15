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
                  accept=".shp,.zip"
                  style={{ display: 'none' }}
                  id="upload-geofence-shapefile"
                  type="file"
                  multiple
                  onChange={e => {
                    update({ value: e.target.files })
                  }}
                />
                <label htmlFor="upload-geofence-shapefile">
                  <Button
                    fullWidth
                    disabled={uploading}
                    variant="outlined"
                    disableElevation
                    size="large"
                    component="span"
                  >
                    Select geofences (shapefiles)
                  </Button>
                </label>
                <FormHelperText>
                  Tenant deployments differ from the main deployment only in that all
                  location-related information is bounded (geofenced). Geofences (shapefiles) are
                  required to be uploaded as archives (zip) or .shp files. Please use the highest
                  resolution shapefile(s) possible
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
  const { form, setForm, uploadingGeofence } = useContext(formContext)

  return (
    <Field
      uploading={uploadingGeofence}
      value={form.shapefiles}
      updateForm={shapefiles => setForm({ ...form, shapefiles })}
    />
  )
}
