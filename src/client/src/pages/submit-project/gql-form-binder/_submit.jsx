import { useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { context as formContext } from './_context'
import { stringify } from 'wkt'
import fixGridValues from './calculators/fix-grid-values'

const convertFormToInput = form =>
  Object.fromEntries(
    Object.entries(form).map(([field, value]) => {
      if (field === 'yx') {
        return [
          field,
          stringify({
            type: 'GeometryCollection',
            geometries: (value || []).map(coordinates => ({ type: 'Point', coordinates })),
          }),
        ]
      }

      /**
       * All dynamic values that the grid displays
       * need to be explicitly set before being
       * submitted
       */

      if (field === 'energyData') {
        return [
          field,
          fixGridValues({
            fields: ['annualKwh', 'annualKwhPurchaseReduction'],
            calculator: value,
          }),
        ]
      }

      if (value?.__typename === 'ControlledVocabulary') {
        const { root, term, tree } = value
        return [field, { root, term, tree }]
      }

      if (value === 'false') {
        return [field, false]
      }

      if (value === 'true') {
        return [field, true]
      }

      return [field, value]
    })
  )

export default () => {
  const history = useHistory()
  const { projectForm, mitigationForms, adaptationForms } = useContext(formContext)

  const [createProject, { error, loading }] = useMutation(
    gql`
      mutation createProject(
        $projectForm: ProjectInput!
        $mitigationForms: [MitigationInput!]
        $adaptationForms: [AdaptationInput!]
      ) {
        createProject(
          projectForm: $projectForm
          mitigationForms: $mitigationForms
          adaptationForms: $adaptationForms
        ) {
          id
        }
      }
    `,
    {
      update: (cache, { data: { createProject } }) => {
        cache.modify({
          fields: {
            projects: (existingProjects = []) => [
              ...existingProjects,
              cache.writeFragment({
                data: createProject,
                fragment: gql`
                  fragment newProject on Project {
                    id
                  }
                `,
              }),
            ],
          },
        })
      },
      onCompleted: ({ createProject }) => {
        const { id } = createProject
        history.push(`/projects/${id}`)
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
          <Button
            onClick={() =>
              createProject({
                variables: {
                  projectForm: convertFormToInput(projectForm),
                  mitigationForms: mitigationForms.map(form => convertFormToInput(form)),
                  adaptationForms: adaptationForms.map(form => convertFormToInput(form)),
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
        </CardContent>
      </Card>
    </div>
  )
}
