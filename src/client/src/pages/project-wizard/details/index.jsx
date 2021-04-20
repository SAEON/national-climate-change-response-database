import Wrapper from '../wrapper'
import TextField from '@material-ui/core/TextField'

export default () => (
  <Wrapper title="Project details">
    <TextField
      margin="normal"
      id="project-title-form-entry"
      label="Project title"
      fullWidth
      placeholder="Enter project title here"
      variant="outlined"
      helperText="Max 50 characters"
    />
    <TextField
      id="project-description-form-entry"
      label="Project description"
      multiline
      margin="normal"
      rows={3}
      fullWidth
      placeholder="Enter project description here"
      variant="outlined"
    />
    <TextField
      id="project-methodology-form-entry"
      label="Project methodology"
      multiline
      margin="normal"
      rows={3}
      fullWidth
      placeholder="Enter project methodology here"
      variant="outlined"
    />
  </Wrapper>
)
