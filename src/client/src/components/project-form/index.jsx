import { useContext, lazy, Suspense, useMemo } from 'react'
import ContentNav from '../content-nav'
import GraphQLFormProvider, { context as formContext } from './context'
import Submit from './submit'
import Loading from '../loading'
import AvatarIcon from './_avatar-icon'
import useTheme from '@material-ui/core/styles/useTheme'
import SyncStatus from './_sync-status'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import BottomNav from './bottom-nav'
import SyncIcon from 'mdi-react/SyncIcon'

const GeneralDetailsForm = lazy(() => import('./sections/general-details'))
const MitigationDetailsForm = lazy(() => import('./sections/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./sections/adaptation-details'))

const FormController = () => {
  const theme = useTheme()
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))
  const {
    mode,
    generalDetailsForm,
    generalDetailsFormValidation,
    mitigationFormsValidation,
    adaptationFormsValidation,
    syncing,
    submissionId,
  } = useContext(formContext)

  const { isComplete: generalDetailsFormComplete, isStarted: generalDetailsFormStarted } =
    generalDetailsFormValidation

  const { isComplete: mitigationDetailsFormComplete, isStarted: mitigationDetailsFormStarted } =
    mitigationFormsValidation

  const { isComplete: adaptationDetailsFormComplete, isStarted: adaptationDetailsFormStarted } =
    adaptationFormsValidation

  const mitigationsRequired = ['mitigation'].includes(
    generalDetailsForm?.['interventionType']?.term.toLowerCase()
  )

  const adaptationsRequired = ['adaptation'].includes(
    generalDetailsForm?.['interventionType']?.term.toLowerCase()
  )

  let canSubmit = true
  if (!generalDetailsFormComplete) canSubmit = false
  if (mitigationsRequired && !mitigationDetailsFormComplete) canSubmit = false
  if (adaptationsRequired && !adaptationDetailsFormComplete) canSubmit = false

  const navItems = useMemo(
    () => [
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
    ],
    [
      mitigationsRequired,
      adaptationsRequired,
      generalDetailsFormStarted,
      generalDetailsFormComplete,
      mitigationDetailsFormStarted,
      mitigationDetailsFormComplete,
      adaptationDetailsFormStarted,
      adaptationDetailsFormComplete,
    ]
  )

  const style = useMemo(() => (lgAndUp ? { marginTop: theme.spacing(2) } : {}), [lgAndUp, theme])

  const submitNavItem = useMemo(
    () => ({
      style,
      disabled: !canSubmit,
      primaryText: 'Submit',
      SecondaryIcon: () => (
        <SyncIcon
          style={{
            color: syncing ? theme.palette.warning.main : theme.palette.success.main,
          }}
          size={18}
        />
      ),
      syncing,
      secondaryText: 'Review submission',
      Icon: () => <AvatarIcon disabled={!canSubmit} enabled={canSubmit} i={4} />,
    }),
    [style, canSubmit, syncing, theme.palette.warning.main, theme.palette.success.main]
  )

  const syncingNavItem = useMemo(
    () => ({
      style,
      syncing,
      Component: props => <SyncStatus submissionId={submissionId} {...props} syncing={syncing} />,
    }),
    [syncing, submissionId, style]
  )

  return (
    <ContentNav
      navItems={mode === 'edit' ? [...navItems, syncingNavItem] : [...navItems, submitNavItem]}
    >
      {({ activeIndex, setActiveIndex }) => {
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
            {activeIndex === 3 && (mode !== 'edit' ? <Submit key="submit" /> : null)}
            {mode !== 'edit' ? (
              <BottomNav currentIndex={activeIndex} setActiveIndex={setActiveIndex} />
            ) : null}
          </>
        )
      }}
    </ContentNav>
  )
}

export default ({
  project = undefined,
  mitigation = undefined,
  adaptation = undefined,
  submissionId = undefined,
  mode = 'new-submission',
  isSubmitted = false,
}) => {
  if (!submissionId) {
    throw new Error('Form needs to be instantiated with a submissionId')
  }
  return (
    <GraphQLFormProvider
      project={project}
      mitigation={mitigation}
      adaptation={adaptation}
      submissionId={submissionId}
      mode={mode}
      isSubmitted={isSubmitted}
    >
      <FormController />
    </GraphQLFormProvider>
  )
}
