import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

export default () => {
  return (
    <Container>
      <Box my={2}>
        This page will shows a list of tenants. Each tenant is basically a form that allows for (1)
        specifying a project filter (2) uploading a logo and (3) defining a domain name that this
        filter will be applied on. This will likely be implemented using the 'client-info' api
        address, which will return the hostname that the website is being accessed on. This will
        then create a non-editable filter that is applied to projects, and will use the appropriate
        logo in the header. Also... might be a good way for specifying backgrounds
      </Box>
    </Container>
  )
}