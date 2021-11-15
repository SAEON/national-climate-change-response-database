import Button from '@mui/material/Button'

export default ({ setOpen }) => {
  return (
    <Button
      onClick={() => {
        setOpen(false)
      }}
      variant="text"
      size="small"
    >
      Confirm
    </Button>
  )
}
