import ContentNav from '../../components/content-nav'
import ViewProjectsIcon from 'mdi-react/DatabaseSearchIcon'
import AddProjectIcon from 'mdi-react/DatabaseAddIcon'
import ReviewIcon from 'mdi-react/DatabaseCheckIcon'
import Projects from './project-list'
import SubmitProject from './submit-project'
import ReviewSubmissions from './review-submissions'

export default () => {
  return (
    <ContentNav
      navItems={[
        {
          primaryText: 'Submit',
          secondaryText: 'Submit project(s)',
          Icon: AddProjectIcon,
        },
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
      ]}
    >
      {({ activeIndex }) => {
        return (
          <>
            {activeIndex === 0 && <SubmitProject key={'submit-project'} />}
            {activeIndex === 1 && <Projects key={'view-projects'} />}
            {activeIndex === 2 && <ReviewSubmissions key={'review-project-submissions'} />}
          </>
        )
      }}
    </ContentNav>
  )
}
