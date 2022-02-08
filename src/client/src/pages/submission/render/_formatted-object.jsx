import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { NCCRD_API_HTTP_ADDRESS } from '../../../config'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import FileIcon_ from 'mdi-react/DownloadIcon'
import { styled } from '@mui/material/styles'
import { Div } from '../../../components/html-tags'

const FileIcon = styled(FileIcon_)({})

const renderValue = ({ key, value }) => {
  if (value?.term) {
    return value.term
  }

  if (key === 'fileUploads') {
    return (
      <>
        <Div sx={{ my: theme => theme.spacing(1) }} />
        {value.map(({ id, name }) => (
          <Div key={name} sx={{ mt: theme => theme.spacing(0.5) }}>
            <Button
              component={Link}
              target="_blank"
              rel="noopener noreferrer"
              href={`${NCCRD_API_HTTP_ADDRESS}/download-public-file?fileId=${id}`}
              startIcon={<FileIcon size={18} />}
              variant="text"
              size="medium"
            >
              {name}
            </Button>
          </Div>
        ))}
      </>
    )
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return value
}

export default ({ json }) => {
  const theme = useTheme()

  return Object.keys(json).map(key => {
    return (
      <div key={key}>
        {/* TITLE */}
        <Typography variant="overline">
          <b>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
        </Typography>

        {/* VALUE */}
        <Typography
          variant="body2"
          style={{
            wordBreak: 'break-word',
            marginBottom: theme.spacing(2),
          }}
        >
          <>{renderValue({ key, value: json[key] })}</>
        </Typography>
      </div>
    )
  })
}
