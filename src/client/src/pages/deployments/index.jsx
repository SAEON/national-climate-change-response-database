import { useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import Card from '@material-ui/core/Card'
import Wrapper from '../../components/page-wrapper'
import ToolbarHeader from '../../components/toolbar-header'
import AccessDenied from '../../components/access-denied'

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('view-/deployments')) {
    return (
      <Wrapper>
        <AccessDenied requiredPermission="view-/deployments" />
      </Wrapper>
    )
  }

  return (
    <>
      <ToolbarHeader></ToolbarHeader>
      <Wrapper>
        <Card>
          This page will shows a list of deployments. Each tenant is basically a form that allows
          for (1) specifying a project filter (2) uploading a logo and (3) defining a domain name
          that this filter will be applied on. This will likely be implemented using the client-info
          api address, which will return the hostname that the website is being accessed on. This
          will then create a non-editable filter that is applied to projects, and will use the
          appropriate logo in the header. Also... might be a good way for specifying backgrounds
        </Card>
      </Wrapper>
    </>
  )
}
