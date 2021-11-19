import { useContext, useState } from 'react'
import { context as formContext } from './_context'
import Button from '@mui/material/Button'
import AcceptIcon from 'mdi-react/TickIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'
import { CircularProgress } from '@mui/material'

export default ({ setOpen }) => {
  const [loading, setLoading] = useState(false)
  const {
    form: { flag, logo, shapefiles, ...form },
  } = useContext(formContext)

  return (
    <Button
      onClick={async () => {
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

        if (shapefiles.constructor === FileList) {
          for (const file of shapefiles) {
            formData.append(`geofence-${file.name}`, file, file.name)
          }
        }

        const result = await fetch(url, {
          method: 'PUT',
          credentials: 'include',
          mode: 'cors',
          body: formData,
        }).then(res => res.status)

        console.log('l', result)

        setLoading(false)
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
