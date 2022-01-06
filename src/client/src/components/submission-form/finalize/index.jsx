import { useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { context as formContext, convertFormToGqlInput } from '../context'
import Typography from '@mui/material/Typography'

export default ({ mode }) => {
  const history = useHistory()
  const {
    generalDetailsForm,
    generalDetailsFormValidation,
    mitigationDetailsForm,
    mitigationFormsValidation,
    adaptationDetailsForm,
    adaptationFormsValidation,
    submissionId,
  } = useContext(formContext)

  const { __submissionStatus: submissionStatus, __submissionComments: submissionComments } =
    generalDetailsForm

  const formComplete =
    generalDetailsFormValidation.isComplete &&
    (generalDetailsForm.interventionType?.term === 'Cross Cutting' ||
      mitigationFormsValidation.isComplete ||
      adaptationFormsValidation.isComplete)

  const [createSubmission, { error, loading }] = useMutation(
    gql`
      mutation saveSubmission(
        $submissionId: ID!
        $project: JSON
        $mitigation: JSON
        $adaptation: JSON
        $isSubmitted: Boolean
        $submissionStatus: JSON
        $submissionComments: String
      ) {
        saveSubmission(
          submissionId: $submissionId
          project: $project
          mitigation: $mitigation
          adaptation: $adaptation
          isSubmitted: $isSubmitted
          submissionStatus: $submissionStatus
          submissionComments: $submissionComments
        ) {
          id
          isSubmitted
        }
      }
    `,
    {
      update: (cache, { data: { saveSubmission: submission } }) => {
        cache.modify({
          fields: {
            submissions: (existingSubmissions = []) => [
              ...existingSubmissions,
              cache.writeFragment({
                data: submission,
                fragment: gql`
                  fragment newData on Submission {
                    id
                    isSubmitted
                  }
                `,
              }),
            ],
          },
        })
      },
      onCompleted: ({ saveSubmission }) => {
        const { id } = saveSubmission
        history.push(`/submissions/${id}`)
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <div>
      <Card variant="outlined">
        <CardHeader title={mode === 'edit' ? 'Edits saved' : 'Finalize and submit'} />
        <CardContent>
          <Typography variant="body2">
            {mode === 'edit'
              ? 'Your edits have already been saved!'
              : `Please check the form before finalizing the submission - once you have finalized the submission you will not be able to edit project information except via requesting assistance`}
          </Typography>
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disabled={!formComplete}
            onClick={() =>
              createSubmission({
                variables: {
                  submissionId,
                  project: convertFormToGqlInput(generalDetailsForm),
                  mitigation: convertFormToGqlInput(mitigationDetailsForm),
                  adaptation: convertFormToGqlInput(adaptationDetailsForm),
                  isSubmitted: true,
                  submissionStatus,
                  submissionComments,
                },
              })
            }
            variant="contained"
            color="primary"
            disableElevation
          >
            {loading && 'Loading'}
            {!loading && mode === 'edit' ? 'Okay' : 'submit'}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
