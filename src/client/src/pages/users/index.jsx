import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Tabs from './tabs.jsx'

export default () => (
  <Container>
    <Box my={2}>
      <ContentNav
        navItems={[
          { primaryText: 'Users', secondaryText: 'Manage users directly' },
          { primaryText: 'Roles', secondaryText: 'Assign users to roles' },
          { primaryText: 'Users', secondaryText: 'Assign permissions to roles' },
        ]}
      >
        {({ activeIndex }) => {
          return (
            <>
              <div>0</div>
              <div>1</div>
              <div>2</div>
            </>
          )
        }}
      </ContentNav>
    </Box>
  </Container>
)
