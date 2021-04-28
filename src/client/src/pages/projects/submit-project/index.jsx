import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import { Link } from 'react-router-dom'
import { NCCRD_TECHNICAL_CONTACT } from '../../../config'
import Collapse from '../../../components/collapse'
import WizardIcon from 'mdi-react/WizardHatIcon'
import ExcelIcon from 'mdi-react/FileExcelIcon'
import HelpIcon from 'mdi-react/HelpIcon'
import useTheme from '@material-ui/core/styles/useTheme'

const buttonStyle = {
  marginLeft: 'auto',
}

export default () => {
  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      {/* WIZARD */}
      <Grid item xs={12}>
        <Collapse
          defaultExpanded
          avatarStyle={{ backgroundColor: theme.palette.primary.light }}
          Icon={WizardIcon}
          title="Submit a project to the NCCRD using the online wizard"
        >
          <CardContent>
            <Typography gutterBottom>
              Use the wizard to submit projects with a structure that adheres to reporting
              standards. The wizard will guide you to enter information to a number of fields -
              these fields may differ somewhat from the information you need to submit.
            </Typography>
            <Typography gutterBottom>
              If translating your data to the required reporting model is very difficult, please
              request assistance using the form below.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              disableElevation
              component={Link}
              style={buttonStyle}
              color="primary"
              variant="contained"
              to="/projects/submission"
            >
              Submission wizard
            </Button>
          </CardActions>
        </Collapse>
      </Grid>

      {/* BULK UPLOAD */}
      <Grid item xs={12}>
        <Collapse
          avatarStyle={{ backgroundColor: theme.palette.primary.light }}
          Icon={ExcelIcon}
          title="Submit project(s) to the NCCRD using an Excel template"
        >
          <CardContent>
            <Typography gutterBottom>
              Upload projects in bulk to the system either by filling in our bulk Excel template, or
              by uploading many single-template files
            </Typography>
            <Typography gutterBottom>
              If these templates do not meet your requirements in any way, or if you would like
              additional means / help in uploading projects to the system in bulk please contact us
              at{' '}
              {
                <MuiLink href={`mailto:${NCCRD_TECHNICAL_CONTACT}`}>
                  {NCCRD_TECHNICAL_CONTACT}
                </MuiLink>
              }
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: 'space-between' }}>
            <Button
              onClick={() => alert('Not implemented yet')}
              disableElevation
              color="primary"
              variant="contained"
            >
              Bulk project Excel template
            </Button>
            <Button
              onClick={() => alert('Not implemented yet')}
              disableElevation
              color="primary"
              variant="contained"
            >
              Single project Excel template
            </Button>
            <Button
              onClick={() => alert('Not implemented yet')}
              disableElevation
              color="primary"
              variant="contained"
            >
              Bulk upload
            </Button>
          </CardActions>
        </Collapse>
      </Grid>

      {/* ASSISTANCE FORM */}
      <Grid item xs={12}>
        <Collapse
          avatarStyle={{ backgroundColor: theme.palette.primary.light }}
          Icon={HelpIcon}
          title="Request assisted-project submission"
        >
          <CardContent>
            <Typography gutterBottom>
              Please full in the basic details of your project and we will contact you to help guide
              you through the project submission process
            </Typography>

            <TextField
              fullWidth
              required
              label="Your name"
              margin="normal"
              helperText="First and last name"
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label="Contact number"
              margin="normal"
              helperText="Your contact number"
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label="E-mail"
              margin="normal"
              helperText="Your e-mail address"
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Description"
              margin="normal"
              helperText="Enter a description or a message here"
              variant="outlined"
            />
          </CardContent>
          <CardActions>
            <Button
              disableElevation
              style={{ marginLeft: 'auto' }}
              color="primary"
              variant="contained"
              onClick={() => alert('Not implemented yet')}
            >
              Submit
            </Button>
          </CardActions>
        </Collapse>
      </Grid>
    </Grid>
  )
}
