import { useContext } from 'react'
import { context as formContext } from './../_context'
import Upload from './upload-dialogue'
import Clear from './clear-files-dialogue'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import FileIcon from 'mdi-react/FileIcon'

export default ({ value, ...props }) => {
  console.log('the value', value)
  const theme = useTheme()
  const { submissionId } = useContext(formContext)

  return (
    <>
      <div style={{ marginBottom: theme.spacing(2) }}>
        {value?.map(({ name }) => (
          <Typography
            key={name}
            variant="body2"
            style={{ marginTop: theme.spacing(2), display: 'flex' }}
          >
            <FileIcon size={18} style={{ marginRight: theme.spacing(1) }} /> {name}
          </Typography>
        ))}
        {!value?.length && <Typography variant="body2">(No uploads)</Typography>}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        onClick={e => e.stopPropagation()}
      >
        <Clear disabled={!value.length} value={value} submissionId={submissionId} {...props} />
        <Upload submissionId={submissionId} {...props} />
      </div>
    </>
  )
}
