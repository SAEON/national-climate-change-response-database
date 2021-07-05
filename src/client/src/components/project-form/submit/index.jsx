import { useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import { context as formContext, convertFormToGqlInput } from '../context'
import Typography from '@material-ui/core/Typography'

export default () => {
  const history = useHistory()
  const { generalDetailsForm, mitigationDetailsForm, adaptationDetailsForm, submissionId } =
    useContext(formContext)

  const [createProject, { error, loading }] = useMutation(
    gql`
      mutation saveSubmission(
        $submissionId: ID!
        $project: JSON
        $mitigation: JSON
        $adaptation: JSON
        $isSubmitted: Boolean
      ) {
        saveSubmission(
          submissionId: $submissionId
          project: $project
          mitigation: $mitigation
          adaptation: $adaptation
          isSubmitted: $isSubmitted
        ) {
          id
        }
      }
    `,
    {
      update: (cache, { data: { saveSubmission } }) => {
        // cache.modify({
        //   fields: {
        //     projects: (existingProjects = []) => [
        //       ...existingProjects,
        //       cache.writeFragment({
        //         data: saveSubmission,
        //         fragment: gql`
        //           fragment newSu on Submission {
        //             id
        //           }
        //         `,
        //       }),
        //     ],
        //   },
        // })
      },
      onCompleted: ({ saveSubmission }) => {
        const { id } = saveSubmission
        // history.push(`/projects/${id}`)
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <div>
      <Card variant="outlined">
        <CardHeader title={'Finalize and submit'} />
        <CardContent>
          <Typography variant="body2">
            Please check the form before finalizing the submission - once you have finalized the
            submission you will not be able to edit project information except via requesting
            assistance
          </Typography>
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() =>
              createProject({
                variables: {
                  submissionId,
                  project: convertFormToGqlInput(generalDetailsForm),
                  mitigation: convertFormToGqlInput(mitigationDetailsForm),
                  adaptation: convertFormToGqlInput(adaptationDetailsForm),
                  isSubmitted: true,
                },
              })
            }
            variant="contained"
            color="primary"
            disableElevation
          >
            {loading && 'Loading'}
            {!loading && 'submit'}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
