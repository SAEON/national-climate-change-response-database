import { useContext } from 'react'
import { context as formContext } from './_context'
import Button from '@mui/material/Button'
import AcceptIcon from 'mdi-react/TickIcon'
import useFetch from 'use-http'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'
import { CircularProgress } from '@mui/material'

export default ({ setOpen }) => {
  const { form } = useContext(formContext)
  const { post, response, loading, error } = useFetch(NCCRD_API_HTTP_ADDRESS, {
    credentials: 'include',
  })

  if (error) {
    throw error
  }

  return (
    <Button
      onClick={async () => {
        await post('/create-tenant', { ...form })
        // setOpen(false)
      }}
      disabled={!form.valid || loading}
      variant="text"
      size="small"
      startIcon={loading ? <CircularProgress size={14} /> : <AcceptIcon size={18} />}
    >
      {loading ? 'Loading' : 'Confirm'}
    </Button>
  )
}
