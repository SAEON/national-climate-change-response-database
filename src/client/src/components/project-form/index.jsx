import { useContext, lazy, Suspense } from 'react'
import ContentNav from '../content-nav'
import GraphQLFormProvider, { context as formContext } from './context'
import Submit from './submit'
import Loading from '../loading'
import AvatarIcon from './_avatar-icon'

const GeneralDetailsForm = lazy(() => import('./sections/general-details'))
const MitigationDetailsForm = lazy(() => import('./sections/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./sections/adaptation-details'))

const FormController = () => {
  const {
    mode,
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
    generalDetailsForm?.['interventionType']?.term.toLowerCase()
  )

  const adaptationsRequired = ['adaptation'].includes(
    generalDetailsForm?.['interventionType']?.term.toLowerCase()
  )

  let canSubmit = true
  if (!generalDetailsFormComplete) canSubmit = false
  if (mitigationsRequired && !mitigationDetailsFormComplete) canSubmit = false
  if (adaptationsRequired && !adaptationDetailsFormComplete) canSubmit = false

  const navItems = [
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
  ]

  return (
    <ContentNav navItems={mode === 'edit' ? navItems.slice(0, -1) : navItems}>
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
  )
}

export default ({
  project = undefined,
  mitigation = undefined,
  adaptation = undefined,
  submissionId = undefined,
  mode = 'new-submission',
}) => {
  if (!submissionId) {
    throw new Error('Project form needs to be instantiated with a submissionId')
  }
  return (
    <GraphQLFormProvider
      project={project}
      mitigation={mitigation}
      adaptation={adaptation}
      submissionId={submissionId}
      mode={mode}
    >
      <FormController />
    </GraphQLFormProvider>
  )
}
