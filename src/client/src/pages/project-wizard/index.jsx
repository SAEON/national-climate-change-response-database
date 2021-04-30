import { useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import Fade from '@material-ui/core/Fade'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import GraphQLFormProvider, { Submit } from './gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import useTheme from '@material-ui/core/styles/useTheme'
import RefreshIcon from 'mdi-react/RefreshIcon'
import PlusIcon from 'mdi-react/PlusIcon'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Collapse from '../../components/collapse'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import ProjectForm from './_project-form'
import MitigationForms from './_mitigation-forms'
import AdaptationForms from './_adaptation-forms'
import ResearchFields from './_research-forms'

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const NoDetailsStub = ({ style, props }) => {
  const theme = useTheme()
  return (
    <Card
      {...props}
      variant="outlined"
      style={{
        width: '100%',
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Typography>No details added yet</Typography>
    </Card>
  )
}

const AvatarIcon = ({ i }) => {
  const classes = useStyles()
  return <Avatar className={clsx(classes.small)}>{i}</Avatar>
}

export default () => {
  const theme = useTheme()

  return (
    <Container>
      <Box my={2}>
        <GraphQLFormProvider>
          <ContentNav
            title="new-project"
            navItems={[
              {
                primaryText: 'Project',
                secondaryText: 'Basic project details',
                Icon: () => <AvatarIcon i={1} />,
              },
              {
                primaryText: 'Mitigation(s)',
                secondaryText: 'Project mitigation details',
                Icon: () => <AvatarIcon i={2} />,
              },
              {
                primaryText: 'Adaptation(s)',
                secondaryText: 'Project adaptation details',
                Icon: () => <AvatarIcon i={3} />,
              },
              {
                primaryText: 'Research',
                secondaryText: 'Project research details',
                Icon: () => <AvatarIcon i={4} />,
              },
              {
                primaryText: 'Submit',
                secondaryText: 'Review and submit project',
                Icon: () => <AvatarIcon i={5} />,
              },
            ]}
            subNavChildren={() => {
              return (
                <Grid container spacing={2} style={{ marginTop: theme.spacing(2) }}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      size="large"
                      startIcon={<RefreshIcon />}
                      color="secondary"
                      variant="contained"
                      disableElevation
                      onClick={() => alert('todo')}
                    >
                      Reset form
                    </Button>
                  </Grid>
                </Grid>
              )
            }}
          >
            {({ setActiveIndex, activeIndex }) => {
              return (
                <div style={{ position: 'relative' }}>
                  <Fade key={0} unmountOnExit in={activeIndex === 0}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <ProjectForm />
                    </div>
                  </Fade>
                  <Fade key={1} unmountOnExit in={activeIndex === 1}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <MitigationForms />
                    </div>
                  </Fade>
                  <Fade key={2} unmountOnExit in={activeIndex === 2}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <AdaptationForms />
                    </div>
                  </Fade>
                  <Fade key={3} unmountOnExit in={activeIndex === 3}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <ResearchFields />
                    </div>
                  </Fade>
                  <Fade key={4} unmountOnExit in={activeIndex === 4}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <Submit setActiveIndex={setActiveIndex} />
                    </div>
                  </Fade>
                </div>
              )
            }}
          </ContentNav>
        </GraphQLFormProvider>
      </Box>
    </Container>
  )
}
