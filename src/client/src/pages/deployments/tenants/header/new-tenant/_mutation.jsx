import Button from '@mui/material/Button'
import AcceptIcon from 'mdi-react/TickIcon'

export default ({ setOpen }) => {
  return (
    <Button
      onClick={() => {
        setOpen(false)
      }}
      variant="text"
      size="small"
      startIcon={<AcceptIcon size={18} />}
    >
      Confirm
    </Button>
  )
}
