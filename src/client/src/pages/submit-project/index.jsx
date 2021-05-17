import { useContext } from 'react'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import GraphQLFormProvider, { Submit, context as formContext } from './gql-form-binder'
import useTheme from '@material-ui/core/styles/useTheme'
import ProjectForm from './forms/project'
import MitigationForms from './forms/mitigation'
import AdaptationForms from './forms/adaptation'
import ResetForm from './reset-form'
import CompleteIcon from 'mdi-react/CheckBoldIcon'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  started: {
    backgroundColor: theme.palette.warning.main,
  },
  complete: {
    color: theme.palette.success.main,
  },
  completeAvatar: {
    backgroundColor: theme.palette.common.white,
  },
  disabled: {
    backgroundColor: theme.palette.error.light,
  },
  enabled: {
    backgroundColor: theme.palette.success.light,
  },
}))

const AvatarIcon = ({ i, complete, started, disabled, enabled }) => {
  const classes = useStyles()

  return (
    <Avatar
      className={clsx(classes.small, {
        [classes.started]: started && !complete,
        [classes.completeAvatar]: complete,
        [classes.disabled]: disabled,
        [classes.enabled]: enabled,
      })}
    >
      {!complete && i}
      {complete && <CompleteIcon className={clsx(classes.complete)} />}
    </Avatar>
  )
}

const Layout = () => {
  const theme = useTheme()

  const {
    projectFormValidation,
    mitigationFormsValidation,
    adaptationFormsValidation,
  } = useContext(formContext)

  const { isComplete: projectFormComplete, isStarted: projectFormStarted } = projectFormValidation

  const {
    isComplete: mitigationFormsComplete,
    isStarted: mitigationFormsStarted,
  } = mitigationFormsValidation

  const {
    isComplete: adaptationFormsComplete,
    isStarted: adaptationFormsStarted,
  } = adaptationFormsValidation

  const canSubmit = projectFormComplete
  // TODO disable research button if project type is not research

  return (
    <>
      <AppBar
        style={{
          marginBottom: theme.spacing(2),
          zIndex: 1000,
        }}
        color="inherit"
        variant="outlined"
        position="relative"
      >
        <Toolbar variant="dense">
          <ResetForm style={{ marginLeft: 'auto' }} />
        </Toolbar>
      </AppBar>

      <ContentNav
        navItems={[
          {
            primaryText: 'Project',
            secondaryText: 'Basic project details',
            Icon: () => (
              <AvatarIcon i={1} started={projectFormStarted} complete={projectFormComplete} />
            ),
          },
          {
            primaryText: 'Mitigation(s)',
            secondaryText: 'Project mitigation details',
            Icon: () => (
              <AvatarIcon
                i={2}
                started={mitigationFormsStarted}
                complete={mitigationFormsComplete}
              />
            ),
          },
          {
            primaryText: 'Adaptation(s)',
            secondaryText: 'Project adaptation details',
            Icon: () => (
              <AvatarIcon
                i={3}
                started={adaptationFormsStarted}
                complete={adaptationFormsComplete}
              />
            ),
          },
          {
            disabled: !canSubmit,
            primaryText: 'Submit',
            secondaryText: 'Review and submit project',
            Icon: () => <AvatarIcon disabled={!canSubmit} enabled={canSubmit} i={4} />,
          },
        ]}
      >
        {({ activeIndex }) => {
          return (
            <>
              {activeIndex === 0 && <ProjectForm key="project-form" />}
              {activeIndex === 1 && <MitigationForms key="mitigation-forms" />}
              {activeIndex === 2 && <AdaptationForms key="adaptation-forms" />}
              {activeIndex === 3 && <Submit key="submit" />}
            </>
          )
        }}
      </ContentNav>
    </>
  )
}

export default () => (
  <GraphQLFormProvider>
    <Layout />
  </GraphQLFormProvider>
)
