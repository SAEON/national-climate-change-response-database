import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import GraphQLFormProvider, { Submit } from './gql-form-binder'
import useTheme from '@material-ui/core/styles/useTheme'
import ProjectForm from './forms/project'
import MitigationForms from './forms/mitigation'
import AdaptationForms from './forms/adaptation'
import ResearchForms from './forms/research'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ResetForm from './reset-form'

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const AvatarIcon = ({ i }) => {
  const classes = useStyles()
  return <Avatar className={clsx(classes.small)}>{i}</Avatar>
}

export default () => {
  const theme = useTheme()
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Container>
      <Box my={2} style={{ position: 'relative' }}>
        <GraphQLFormProvider>
          <ContentNav
            navItems={[
              {
                primaryText: 'Project',
                secondaryText: 'Basic project details',
                Icon: () => <AvatarIcon i={1} />,
              },
              {
                primaryText: 'Mitigation(s)',
                secondaryText: 'Project mitigation details',
                Icon: () => <AvatarIcon i={2} />,
              },
              {
                primaryText: 'Adaptation(s)',
                secondaryText: 'Project adaptation details',
                Icon: () => <AvatarIcon i={3} />,
              },
              {
                primaryText: 'Research',
                secondaryText: 'Project research details',
                Icon: () => <AvatarIcon i={4} />,
              },
              {
                primaryText: 'Submit',
                secondaryText: 'Review and submit project',
                Icon: () => <AvatarIcon i={5} />,
              },
            ]}
            subNavChildren={({ setActiveIndex }) => {
              return mdAndUp && <ResetForm setActiveIndex={setActiveIndex} />
            }}
          >
            {({ activeIndex }) => {
              return (
                <>
                  {activeIndex === 0 && <ProjectForm key="project-form" />}
                  {activeIndex === 1 && <MitigationForms key="mitigation-forms" />}
                  {activeIndex === 2 && <AdaptationForms key="adaptation-forms" />}
                  {activeIndex === 3 && <ResearchForms key="research-forms" />}
                  {activeIndex === 4 && <Submit key="submit" />}
                </>
              )
            }}
          </ContentNav>
        </GraphQLFormProvider>
      </Box>
    </Container>
  )
}
