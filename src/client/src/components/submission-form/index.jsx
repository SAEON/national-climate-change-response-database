import { useContext, lazy, Suspense, useMemo, memo, useState } from 'react'
import VerticalTabs from '../../packages/vertical-tabs'
import GraphQLFormProvider, { context as formContext } from './context'
import Submit from './submit'
import Loading from '../loading'
import AvatarIcon from './_avatar-icon'
import { useTheme } from '@mui/material/styles'
import SyncStatus from './_sync-status'
import useMediaQuery from '@mui/material/useMediaQuery'
import BottomNav from './bottom-nav'
import SyncIcon from 'mdi-react/SyncIcon'
import Fade from '@mui/material/Fade'

const GeneralDetailsForm = lazy(() => import('./sections/general-details'))
const MitigationDetailsForm = lazy(() => import('./sections/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./sections/adaptation-details'))

const FormController = () => {
  const [activeIndex, setActiveIndex] = useState(0)

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
        Render: GeneralDetailsForm,
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
        Render: MitigationDetailsForm,
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
        Render: AdaptationDetailsForm,
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

  const sections = mode === 'edit' ? [...navItems, syncingNavItem] : [...navItems, submitNavItem]

  return (
    <VerticalTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} navItems={sections}>
      {[navItems[0], navItems[1], navItems[2]].map(({ Render, primaryText }, i) => {
        return (
          <Suspense key={primaryText} fallback={<Loading />}>
            <Fade in={activeIndex === i} key={`loaded-${i}`}>
              <span style={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                <Render active={activeIndex === i} />
              </span>
            </Fade>
          </Suspense>
        )
      })}

      <Suspense
        fallback={
          <Fade
            timeout={theme.transitions.duration.standard}
            in={activeIndex === 3}
            key={'loading'}
          >
            <span>
              <Loading />
            </span>
          </Fade>
        }
      >
        <Fade timeout={theme.transitions.duration.standard} in={activeIndex === 3} key={'loaded'}>
          <span style={{ display: activeIndex === 3 ? 'inherit' : 'none' }}>
            <Submit key="submit" />
          </span>
        </Fade>
      </Suspense>

      {mode !== 'edit' ? (
        <>
          <div style={{ marginTop: theme.spacing(2) }} />
          <BottomNav currentIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </>
      ) : null}
    </VerticalTabs>
  )
}

const Provider = ({
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

export default memo(
  props => {
    return <Provider {...props} />
  },
  ({ isSubmitted: a }, { isSubmitted: b }) => a === b
)
