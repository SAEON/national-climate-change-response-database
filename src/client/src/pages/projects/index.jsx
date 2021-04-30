import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import ViewProjectsIcon from 'mdi-react/DatabaseSearchIcon'
import AddProjectIcon from 'mdi-react/DatabaseAddIcon'
import ReviewIcon from 'mdi-react/DatabaseCheckIcon'
import Projects from './project-list'
import SubmitProject from './submit-project'
import ReviewSubmissions from './review-submissions'

export default () => {
  return (
    <Container>
      <Box my={2} style={{ position: 'relative' }}>
        <ContentNav
          navItems={[
            {
              primaryText: 'Projects',
              secondaryText: 'View and edit projects',
              Icon: ViewProjectsIcon,
            },
            {
              primaryText: 'Review',
              secondaryText: 'Review project submissions',
              Icon: ReviewIcon,
            },
            {
              primaryText: 'Submit',
              secondaryText: 'Submit project(s)',
              Icon: AddProjectIcon,
            },
          ]}
        >
          {({ activeIndex }) => {
            return (
              <>
                {activeIndex === 0 && <Projects key={'view-projects'} />}
                {activeIndex === 1 && <ReviewSubmissions key={'review-project-submissions'} />}
                {activeIndex === 2 && <SubmitProject key={'submit-project'} />}
              </>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
