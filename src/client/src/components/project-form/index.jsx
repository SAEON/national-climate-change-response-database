import { useContext, lazy, Suspense } from 'react'
import ContentNav from '../content-nav'
import GraphQLFormProvider, { Submit, context as formContext } from './gql-form-binder'
import Loading from '../loading'
import AvatarIcon from './_avatar-icon'

const GeneralDetailsForm = lazy(() => import('./sections/general-details'))
const MitigationDetailsForm = lazy(() => import('./sections/mitigation-details'))
const AdaptationDetailsForm = lazy(() => import('./sections/adaptation-details'))

const Form = () => {
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
  )
}

export default ({
  project = undefined,
  mitigation = undefined,
  adaptation = undefined,
  submissionId = undefined,
}) => {
  if (!submissionId) {
    throw new Error(
      'Project form needs to be instantiated with an editId to associate uploaded files'
    )
  }
  return (
    <GraphQLFormProvider
      project={project}
      mitigation={mitigation}
      adaptation={adaptation}
      submissionId={submissionId}
    >
      <Form />
    </GraphQLFormProvider>
  )
}
