import { useContext, lazy, Suspense } from 'react'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import GraphQLFormProvider, { Submit, context as formContext } from './gql-form-binder'
import ProjectForm from './forms/project'
import CompleteIcon from 'mdi-react/CheckBoldIcon'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import Loading from '../../components/loading'
import AccessDenied from '../../components/access-denied'

const MitigationForms = lazy(() => import('./forms/mitigation'))
const AdaptationForms = lazy(() => import('./forms/adaptation'))

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
  const {
    projectForm,
    projectFormValidation,
    mitigationFormsValidation,
    adaptationFormsValidation,
  } = useContext(formContext)

  const { isComplete: projectFormComplete, isStarted: projectFormStarted } = projectFormValidation

  const { isComplete: mitigationFormsComplete, isStarted: mitigationFormsStarted } =
    mitigationFormsValidation

  const { isComplete: adaptationFormsComplete, isStarted: adaptationFormsStarted } =
    adaptationFormsValidation

  const mitigationsRequired = ['mitigation', 'cross cutting'].includes(
    projectForm['interventionType']?.term.toLowerCase()
  )

  const adaptationsRequired = ['adaptation', 'cross cutting'].includes(
    projectForm['interventionType']?.term.toLowerCase()
  )

  let canSubmit = true
  if (!projectFormComplete) canSubmit = false
  if (mitigationsRequired && !mitigationFormsComplete) canSubmit = false
  if (adaptationsRequired && !adaptationFormsComplete) canSubmit = false

  return (
    <>
      <Header />
      <Wrapper>
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
              disabled: !mitigationsRequired,
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
              disabled: !adaptationsRequired,
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
                {activeIndex === 1 && (
                  <Suspense fallback={<Loading />}>
                    <MitigationForms key="mitigation-forms" />
                  </Suspense>
                )}
                {activeIndex === 2 && (
                  <Suspense fallback={<Loading />}>
                    <AdaptationForms key="adaptation-forms" />
                  </Suspense>
                )}
                {activeIndex === 3 && <Submit key="submit" />}
              </>
            )
          }}
        </ContentNav>
      </Wrapper>
    </>
  )
}

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('create-project')) {
    return <AccessDenied requiredPermission="create-project" />
  }

  return (
    <GraphQLFormProvider>
      <Layout />
    </GraphQLFormProvider>
  )
}
