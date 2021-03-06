import { useContext, lazy, Suspense, useMemo, memo, useState } from 'react'
import VerticalTabs from '../../packages/vertical-tabs'
import GraphQLFormProvider, { context as formContext } from './context'
import Finalize from './finalize'
import Loading from '../loading'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Navigation from './sections/navigation'
import SyncIcon from 'mdi-react/SyncIcon'
import Fade from '@mui/material/Fade'
import Avatar from '@mui/material/Avatar'
import CompleteIcon from 'mdi-react/CheckBoldIcon'
import Icon from '@mui/material/Icon'
import { Span, Div } from '../../components/html-tags'

const GeneralDetailsForm = lazy(() => import('./sections/general-details'))
const MitigationDetailsForm = lazy(() => import('./sections/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./sections/adaptation-details'))

const AvatarIcon = ({ i, complete, started, disabled, enabled }) => {
  return (
    <Avatar
      sx={{
        width: theme => theme.spacing(3),
        height: theme => theme.spacing(3),
        backgroundColor: theme =>
          started && !complete
            ? theme.palette.warning.main
            : complete
            ? theme.palette.common.white
            : disabled
            ? theme.palette.error.light
            : enabled
            ? theme.palette.success.light
            : 'default',
      }}
    >
      {!complete && i}
      {complete && (
        <Icon component={CompleteIcon} sx={{ color: theme => theme.palette.success.main }} />
      )}
    </Avatar>
  )
}

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
    () => mode => ({
      style,
      disabled: !canSubmit,
      primaryText: mode === 'edit' ? 'Status' : 'Submit',
      SecondaryIcon: () => (
        <Icon
          sx={{
            color: theme => (syncing ? theme.palette.warning.main : theme.palette.success.main),
          }}
          size={18}
          component={SyncIcon}
        />
      ),
      syncing,
      secondaryText: mode === 'edit' ? (syncing ? 'Saving ...' : 'Saved') : 'Review submission',
      Icon: () => <AvatarIcon disabled={!canSubmit} enabled={canSubmit} i={4} />,
    }),
    [style, canSubmit, syncing]
  )

  const sections =
    mode === 'edit' ? [...navItems, submitNavItem('edit')] : [...navItems, submitNavItem('new')]

  return (
    <VerticalTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} navItems={sections}>
      {/* TOP BAR */}
      <Navigation currentIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Div sx={{ marginBottom: theme => theme.spacing(2) }} />

      {[navItems[0], navItems[1], navItems[2]].map(({ Render, primaryText }, i) => {
        return (
          <Suspense
            key={primaryText}
            fallback={
              <Div sx={{ marginBottom: theme => theme.spacing(2) }}>
                <Loading />
              </Div>
            }
          >
            <Fade in={activeIndex === i} key={`loaded-${i}`}>
              <Span sx={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                <Render active={activeIndex === i} />
              </Span>
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
            <Span>
              <Loading />
            </Span>
          </Fade>
        }
      >
        <Fade timeout={theme.transitions.duration.standard} in={activeIndex === 3} key={'loaded'}>
          <Span sx={{ display: activeIndex === 3 ? 'inherit' : 'none' }}>
            <Finalize key="finalize" mode={mode} />
          </Span>
        </Fade>
      </Suspense>

      {/* BOTTOM BAR */}
      <Div sx={{ marginBottom: theme => theme.spacing(2) }} />
      <Navigation currentIndex={activeIndex} setActiveIndex={setActiveIndex} />
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
