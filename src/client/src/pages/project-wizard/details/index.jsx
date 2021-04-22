import { gql, useQuery } from '@apollo/client'
import Form from './form'
import Loading from '../../../components/loading'
import Fade from '@material-ui/core/Fade'

export default ({ form, updateForm }) => {
  const { error, loading, data } = useQuery(
    gql`
      query projectDetailFields($name: String!) {
        __type(name: $name) {
          inputFields {
            name
            description
            type {
              name
              ofType {
                name
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        name: 'ProjectInput',
      },
    }
  )

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <span>
          <Loading />
        </span>
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  return (
    <Fade in={Boolean(data)} key="form-in">
      <span>
        <Form form={form} updateForm={updateForm} fields={data.__type.inputFields} />
      </span>
    </Fade>
  )
}
