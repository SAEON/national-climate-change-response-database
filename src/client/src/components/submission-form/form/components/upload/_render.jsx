import Upload from './upload-dialogue'
import Clear from './clear-files-dialogue'
import Typography from '@mui/material/Typography'
import FileIcon_ from 'mdi-react/FileIcon'
import { Div } from '../../../../html-tags'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'

const FileIcon = styled(FileIcon_)({})

export default ({ value, submissionId, updateValue, placeholder, helperText, formName }) => {
  return (
    <>
      {/* DISPLAY UPLOADED FILES */}
      <Div sx={{ marginBottom: theme => theme.spacing(2) }}>
        {value?.map(({ id, name }) => (
          <Typography
            key={name}
            variant="body2"
            sx={{ marginTop: theme => theme.spacing(2), display: 'flex' }}
          >
            <FileIcon size={18} sx={{ marginRight: theme => theme.spacing(1) }} />{' '}
            <Link
              href={`${NCCRD_API_HTTP_ADDRESS}/download-public-file?fileId=${id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {name}
            </Link>
          </Typography>
        ))}
        {!value?.length && <Typography variant="body2">(No uploads)</Typography>}
      </Div>

      {/* ACTIONS */}
      <Div sx={{ display: 'flex', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
        <Clear
          disabled={!value?.length}
          value={value}
          submissionId={submissionId}
          updateValue={updateValue}
          placeholder={placeholder}
          helperText={helperText}
        />
        <Upload
          formName={formName}
          submissionId={submissionId}
          value={value}
          updateValue={updateValue}
          placeholder={placeholder}
          helperText={helperText}
        />
      </Div>
    </>
  )
}
