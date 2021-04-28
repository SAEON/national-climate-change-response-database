import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import Fade from '@material-ui/core/Fade'

export const context = createContext()

export default ({ children }) => {
  const { error, loading, data } = useQuery(
    gql`
      query formFields(
        $projectInputType: String!
        $adaptationInputType: String!
        $mitigationInputType: String!
      ) {
        projectFields: __type(name: $projectInputType) {
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
        mitigationFields: __type(name: $mitigationInputType) {
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
        adaptationFields: __type(name: $adaptationInputType) {
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
        projectInputType: 'ProjectInput',
        adaptationInputType: 'AdaptationInput',
        mitigationInputType: 'MitigationInput',
      },
    }
  )

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <span>
          <Loading msg="Loading form fields" />
        </span>
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  return (
    <context.Provider
      value={{
        projectFields: data.projectFields.inputFields,
        mitigationFields: data.mitigationFields.inputFields,
        adaptationFields: data.adaptationFields.inputFields,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <span>{children}</span>
      </Fade>
    </context.Provider>
  )
}
