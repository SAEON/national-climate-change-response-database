import { lazy, Suspense, useState } from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import TypeInfo from './type-info'
import Form from './form'

const Adaptation = lazy(() => import('./adaptation'))
const Research = lazy(() => import('./research'))
const Submit = lazy(() => import('./submit'))

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const AvatarIcon = ({ i }) => {
  const classes = useStyles()
  return <Avatar className={clsx(classes.small)}>{i}</Avatar>
}

export default () => {
  const [projectDetails, updateProjectDetails] = useState({})
  const [mitigationDetails, updateMitigationDetails] = useState({})
  const [adaptationDetails, updateAdaptationDetails] = useState({})

  const updateProjectForm = obj => {
    updateProjectDetails(Object.assign({ ...projectDetails }, obj))
  }

  const updateMitigationForm = obj => {
    updateMitigationDetails(Object.assign({ ...mitigationDetails }, obj))
  }

  const updateAdaptationForm = obj => {
    updateAdaptationDetails(Object.assign({ ...adaptationDetails }, obj))
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
              primaryText: 'Mitigation',
              secondaryText: 'Project mitigation details',
              Icon: () => <AvatarIcon i={2} />,
            },
            {
              primaryText: 'Adaptation',
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
        >
          {({ activeIndex }) => {
            return (
              <div style={{ position: 'relative' }}>
                <Fade key={0} unmountOnExit in={activeIndex === 0}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TypeInfo name="ProjectInput">
                      {fields => {
                        return (
                          <Suspense fallback={<Loading />}>
                            <Form
                              title="Project details"
                              multilineFields={['description', 'projectManager']}
                              fields={fields}
                              form={projectDetails}
                              updateForm={updateProjectForm}
                            />
                          </Suspense>
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
                          <Suspense fallback={<Loading />}>
                            <Form
                              title="Mitigation details"
                              multilineFields={[]}
                              fields={fields}
                              form={mitigationDetails}
                              updateForm={updateMitigationForm}
                            />
                          </Suspense>
                        )
                      }}
                    </TypeInfo>
                  </div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    TODO
                    {/* <TypeInfo name="AdaptationInput">
                      {fields => {
                        return (
                          <Suspense fallback={<Loading />}>
                            <Form
                              title="Adaptation details"
                              multilineFields={[]}
                              fields={fields}
                              form={adaptationDetails}
                              updateForm={updateAdaptationForm}
                            />
                          </Suspense>
                        )
                      }}
                    </TypeInfo> */}
                  </div>
                </Fade>
                <Fade key={3} unmountOnExit in={activeIndex === 3}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <div>todo</div>
                    </Suspense>
                  </div>
                </Fade>
                <Fade key={4} unmountOnExit in={activeIndex === 4}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Submit projectDetails={projectDetails} />
                    </Suspense>
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
