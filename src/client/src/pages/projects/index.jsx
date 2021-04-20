import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Icon from 'mdi-react/ClipboardSearchIcon'
import DetailsIcon from 'mdi-react/SearchIcon'
import Fade from '@material-ui/core/Fade'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <Container>
      <Box my={2}>
        <ContentNav
          title="project-management"
          navItems={[
            { primaryText: 'Projects', secondaryText: 'View and manage projects', Icon: Icon },
            {
              primaryText: 'Mitigations',
              secondaryText: 'Search mitigation details',
              Icon: DetailsIcon,
            },
            {
              primaryText: 'Adaptations',
              secondaryText: 'Search adaptation details',
              Icon: DetailsIcon,
            },
          ]}
        >
          {({ activeIndex }) => {
            return (
              <div style={{ position: 'relative', marginLeft: theme.spacing(1) }}>
                <Fade key={0} unmountOnExit in={activeIndex === 0}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>Projects</div>
                </Fade>
                <Fade key={1} unmountOnExit in={activeIndex === 1}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>Mitigation</div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>Adaptations</div>
                </Fade>
              </div>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
