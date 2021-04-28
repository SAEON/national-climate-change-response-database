import { useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import Fade from '@material-ui/core/Fade'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import TypeInfo from './type-info'
import Form from './form'
import Submit from './submit'
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
  const [projectDetails, updateProjectDetails] = useState({})
  const [mitigationDetails, updateMitigationDetails] = useState({})
  const [adaptationDetails, updateAdaptationDetails] = useState([])
  const [researchDetails, updateResearchDetails] = useState({})

  const updateProjectForm = obj => {
    updateProjectDetails(Object.assign({ ...projectDetails }, obj))
  }

  const updateMitigationForm = obj => {
    updateMitigationDetails(Object.assign({ ...mitigationDetails }, obj))
  }

  const updateAdaptationForm = (obj, i) => {
    updateAdaptationDetails(adaptationDetails =>
      adaptationDetails.map((d, _i) => (i === _i ? Object.assign({ ...d }, obj) : d))
    )
  }

  const updateResearchForm = obj => {
    updateResearchDetails(Object.assign({ ...researchDetails }, obj))
  }

  const resetForm = (cb = null) => {
    updateProjectDetails({})
    updateMitigationDetails({})
    updateAdaptationDetails([])
    updateResearchDetails({})
    cb && cb()
  }

  return (
    <Container>
      <Box my={2}>
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
          subNavChildren={({ setActiveIndex }) => {
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
                    onClick={() => resetForm(setActiveIndex(0))}
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
                    <TypeInfo name="ProjectInput">
                      {fields => {
                        return (
                          <Form
                            title="Project details"
                            multilineFields={['description', 'projectManager']}
                            fields={fields}
                            form={projectDetails}
                            updateForm={updateProjectForm}
                          />
                        )
                      }}
                    </TypeInfo>
                  </div>
                </Fade>
                <Fade key={1} unmountOnExit in={activeIndex === 1}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TypeInfo name="MitigationInput">
                      {fields => {
                        return (
                          <Form
                            title="Mitigation details"
                            multilineFields={[]}
                            fields={fields}
                            form={mitigationDetails}
                            updateForm={updateMitigationForm}
                          />
                        )
                      }}
                    </TypeInfo>
                  </div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    {adaptationDetails.map((adaptationDetails, i) => (
                      <TypeInfo key={i} name="AdaptationInput">
                        {fields => {
                          return (
                            <div style={{ marginBottom: theme.spacing(2) }}>
                              <Collapse
                                avatarStyle={{ backgroundColor: theme.palette.primary.light }}
                                Icon={FormIcon}
                                title={adaptationDetails.title || 'New details added'}
                                actions={[
                                  <IconButton
                                    onClick={e => {
                                      e.stopPropagation()
                                      updateAdaptationDetails(d => d.filter((_, _i) => _i !== i))
                                    }}
                                    key="delete"
                                  >
                                    <DeleteIcon />
                                  </IconButton>,
                                ]}
                              >
                                <Form
                                  multilineFields={[]}
                                  fields={fields}
                                  form={adaptationDetails}
                                  updateForm={obj => updateAdaptationForm(obj, i)}
                                />
                              </Collapse>
                            </div>
                          )
                        }}
                      </TypeInfo>
                    ))}
                    {!adaptationDetails.length && (
                      <NoDetailsStub style={{ marginBottom: theme.spacing(2) }} />
                    )}
                    <div style={{ display: 'flex' }}>
                      <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        onClick={() => updateAdaptationDetails(existing => [...existing, {}])}
                        endIcon={<PlusIcon />}
                        style={{ marginLeft: 'auto' }}
                      >
                        Add details
                      </Button>
                    </div>
                  </div>
                </Fade>
                <Fade key={3} unmountOnExit in={activeIndex === 3}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TypeInfo name="ResearchInput">
                      {fields => {
                        return (
                          <Form
                            title="Research details"
                            multilineFields={[]}
                            fields={fields}
                            form={researchDetails}
                            updateForm={updateResearchForm}
                          />
                        )
                      }}
                    </TypeInfo>
                  </div>
                </Fade>
                <Fade key={4} unmountOnExit in={activeIndex === 4}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Submit
                      clearForm={() => resetForm(setActiveIndex(0))}
                      projectDetails={projectDetails}
                    />
                  </div>
                </Fade>
              </div>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
