import { useState } from 'react'
import FileIcon from 'mdi-react/FileIcon'
import useTheme from '@mui/material/styles/useTheme'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

export default () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  return (
    <div style={{ marginTop: theme.spacing(2) }}>
      {/* UPLOAD CONTROL */}
      <FormControl margin="normal" fullWidth variant="outlined">
        <input
          accept="*"
          style={{ display: 'none' }}
          id="upload-geofence-shapefile"
          type="file"
          multiple
          onChange={e => {
            setError(null)
            setFiles(e.target.files)
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
        <FormHelperText id="my-helper-text">
          Tenant deployments differ from the main deployment only in that all location-related
          information is bounded (geofenced). Geofences (shapefiles) are required to be uploaded as
          archives (zip) or .shp files. Please use the highest resolution shapefile(s) possible
        </FormHelperText>
      </FormControl>

      {/* SELECTION SUMMARY */}
      {[...files].map(file => {
        return (
          <Typography key={file.name} variant="body2" style={{ display: 'flex' }}>
            <FileIcon size={18} style={{ marginRight: theme.spacing(1) }} /> {file.name}
          </Typography>
        )
      })}

      {/* UPLOAD ERRORS */}
      {error && (
        <Typography color="error" variant="body2">
          {error.message}
        </Typography>
      )}
    </div>
  )
}
