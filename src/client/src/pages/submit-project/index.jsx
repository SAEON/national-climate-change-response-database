import { useContext, lazy, Suspense } from 'react'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import GraphQLFormProvider, { Submit, context as formContext } from './gql-form-binder'
import CompleteIcon from 'mdi-react/CheckBoldIcon'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import Loading from '../../components/loading'
import AccessDenied from '../../components/access-denied'

const GeneralDetailsForm = lazy(() => import('./forms/general-details'))
const MitigationDetailsForm = lazy(() => import('./forms/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./forms/adaptation-details'))

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
    generalDetailsForm,
    generalDetailsFormValidation,
    mitigationFormsValidation,
    adaptationFormsValidation,
  } = useContext(formContext)

  const { isComplete: generalDetailsFormComplete, isStarted: generalDetailsFormStarted } =
    generalDetailsFormValidation

  const { isComplete: mitigationDetailsFormComplete, isStarted: mitigationDetailsFormStarted } =
    mitigationFormsValidation

  const { isComplete: adaptationDetailsFormComplete, isStarted: adaptationDetailsFormStarted } =
    adaptationFormsValidation

  const mitigationsRequired = ['mitigation'].includes(
    generalDetailsForm['interventionType']?.term.toLowerCase()
  )

  const adaptationsRequired = ['adaptation'].includes(
    generalDetailsForm['interventionType']?.term.toLowerCase()
  )

  let canSubmit = true
  if (!generalDetailsFormComplete) canSubmit = false
  if (mitigationsRequired && !mitigationDetailsFormComplete) canSubmit = false
  if (adaptationsRequired && !adaptationDetailsFormComplete) canSubmit = false

  return (
    <>
      <Header />
      <Wrapper>
        <ContentNav
          navItems={[
            {
              primaryText: 'General',
              secondaryText: 'Basic project details',
              Icon: () => (
                <AvatarIcon
                  i={1}
                  started={generalDetailsFormStarted}
                  complete={generalDetailsFormComplete}
                />
              ),
            },
            {
              disabled: !mitigationsRequired,
              primaryText: 'Mitigation details',
              secondaryText: 'Project mitigation details',
              Icon: () => (
                <AvatarIcon
                  i={2}
                  started={mitigationDetailsFormStarted}
                  complete={mitigationDetailsFormComplete}
                />
              ),
            },
            {
              disabled: !adaptationsRequired,
              primaryText: 'Adaptation details',
              secondaryText: 'Project adaptation details',
              Icon: () => (
                <AvatarIcon
                  i={3}
                  started={adaptationDetailsFormStarted}
                  complete={adaptationDetailsFormComplete}
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
                {activeIndex === 0 && (
                  <Suspense fallback={<Loading />}>
                    <GeneralDetailsForm key="project-form" />
                  </Suspense>
                )}
                {activeIndex === 1 && (
                  <Suspense fallback={<Loading />}>
                    <MitigationDetailsForm key="mitigation-form" />
                  </Suspense>
                )}
                {activeIndex === 2 && (
                  <Suspense fallback={<Loading />}>
                    <AdaptationDetailsForm key="adaptation-form" />
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
