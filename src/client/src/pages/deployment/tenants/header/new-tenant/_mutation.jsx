import { useContext, useState } from 'react'
import { context as formContext } from './_context'
import Button from '@mui/material/Button'
import AcceptIcon from 'mdi-react/TickIcon'
import { gql } from '@apollo/client'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'
import { useApolloClient } from '@apollo/client'
import { CircularProgress } from '@mui/material'
import { DEFAULT_VALUE as defaultSelectValue } from '../../../../../components/submission-form/form/components/controlled-vocabulary-select'

export default ({ setOpen }) => {
  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)
  const {
    form: { flag, logo, ...form },
    setForm,
  } = useContext(formContext)

  const disabled = !form.valid || form.geofence?.term === defaultSelectValue.term || loading

  return (
    <Button
      disabled={disabled}
      onClick={async () => {
        try {
          setLoading(true)
          const url = `${NCCRD_API_HTTP_ADDRESS}/create-tenant`

          const formData = new FormData()
          formData.append('json', JSON.stringify(form))

          if (logo.constructor === FileList) {
            const file = logo[0]
            formData.append('logo', file, file.name)
          }

          if (flag.constructor === FileList) {
            const file = flag[0]
            formData.append('flag', file, file.name)
          }

          const res = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              accept: 'application/json',
            },
            mode: 'cors',
            body: formData,
          })

          const status = res.status

          if (status === 409) {
            throw new Error(
              'Conflict - this hostname is already in use. Please provide a unique domain name'
            )
          }

          if (status !== 201) {
            throw new Error(`Unexpected HTTP status returned for PUT request: ${status}`)
          }

          const newTenant = await res.json()

          const query = gql`
            query {
              tenants {
                id
                hostname
                title
                shortTitle
                frontMatter
                description
                theme
              }
            }
          `

          const { tenants: existingTenants } = cache.read({ query })
          const tenants = [...existingTenants, { __typename: 'Tenant', ...newTenant }]

          cache.writeQuery({
            query,
            data: {
              tenants,
            },
          })

          setOpen(false)
        } catch (error) {
          setForm({ putError: error.message })
        } finally {
          setLoading(false)
        }
      }}
      variant="text"
      size="small"
      startIcon={loading ? <CircularProgress size={14} /> : <AcceptIcon size={18} />}
    >
      {loading ? 'Loading' : 'Confirm'}
    </Button>
  )
}
