import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import ViewProjectsIcon from 'mdi-react/DatabaseSearchIcon'
import AddProjectIcon from 'mdi-react/DatabaseAddIcon'
import ReviewIcon from 'mdi-react/DatabaseCheckIcon'
import Fade from '@material-ui/core/Fade'
import Projects from './project-list'
import SubmitProject from './submit-project'
import ReviewSubmissions from './review-submissions'

export default () => {
  return (
    <Container>
      <Box my={2}>
        <ContentNav
          title="project-management"
          navItems={[
            {
              primaryText: 'Projects',
              secondaryText: 'View and edit projects',
              Icon: ViewProjectsIcon,
            },
            {
              primaryText: 'Submit',
              secondaryText: 'Submit projects (single/bulk)',
              Icon: AddProjectIcon,
            },
            {
              primaryText: 'Review',
              secondaryText: 'Review project submissions',
              Icon: ReviewIcon,
            },
          ]}
        >
          {({ activeIndex }) => {
            return (
              <div style={{ position: 'relative' }}>
                <Fade key={0} unmountOnExit in={activeIndex === 0}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Projects />
                  </div>
                </Fade>
                <Fade key={1} unmountOnExit in={activeIndex === 1}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <SubmitProject />
                  </div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <ReviewSubmissions />
                  </div>
                </Fade>
              </div>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
