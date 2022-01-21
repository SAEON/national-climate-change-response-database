import Upload from './upload-dialogue'
import Clear from './clear-files-dialogue'
import Typography from '@mui/material/Typography'
import FileIcon from 'mdi-react/FileIcon'
import { Div } from '../../../../html-tags'
import Icon from '@mui/material/Icon'

export default ({ value, submissionId, updateValue, placeholder, helperText, formName }) => {
  return (
    <>
      {/* DISPLAY UPLOADED FILES */}
      <Div sx={{ marginBottom: theme => theme.spacing(2) }}>
        {value?.map(({ name }) => (
          <Typography
            key={name}
            variant="body2"
            sx={{ marginTop: theme => theme.spacing(2), display: 'flex' }}
          >
            <Icon component={FileIcon} size={18} sx={{ marginRight: theme => theme.spacing(1) }} />{' '}
            {name}
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
