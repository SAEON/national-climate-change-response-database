import { forwardRef } from 'react'
import Container from '@mui/material/Container'
import { Div } from '../../../components/html-tags'
import BoxButton from '../../../components/fancy-buttons/box-button'
import Grid from '@mui/material/Grid'
import { alpha, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import AboutIcon_ from 'mdi-react/InformationVariantIcon'
import ReportsIcon from 'mdi-react/ChartBarStackedIcon'
import SubmitIcon from 'mdi-react/DatabaseAddIcon'

const Text_ = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
}))

const G_ = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const AboutIcon = styled(AboutIcon_)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  margin: theme.spacing(3),
  marginBottom: theme.spacing(4),
}))

const DataIcon = styled(ReportsIcon)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  margin: theme.spacing(3),
  marginBottom: theme.spacing(4),
}))

const ContributeIcon = styled(SubmitIcon)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  margin: theme.spacing(3),
  marginBottom: theme.spacing(4),
}))

const G = props => <G_ item xs={12} sm={4} {...props} />

const Title = props => <Text_ textAlign="center" fontSize="1rem" variant={'overline'} {...props} />

const Content = props => (
  <Text_
    flexGrow={1}
    marginBottom={theme => theme.spacing(6)}
    textAlign="left"
    variant="body2"
    {...props}
  />
)

export default forwardRef((props, ref) => (
  <Div ref={ref} sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }}>
    <Container
      sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(12) }}
    >
      <Grid container spacing={8} sx={{ my: theme => theme.spacing(6) }}>
        <G>
          <Title>About</Title>
          <AboutIcon size={48} />
          <Content>
            The National Climate Change Response Database (NCCRD) is intended as a resource to
            collect and track interventions on climate change (adaptation and mitigation) on past,
            current and future climate change response efforts (policies, plans, strategies,
            projects and research) across South Africa.
          </Content>
          <BoxButton sx={{ height: 100 }} to="/about" title={'More'} />
        </G>
        <G>
          <Title>Data</Title>
          <DataIcon size={48} />
          <Content>
            Information on climate change related projects contained in the NCCRD include details
            mitigation and adaptation projects that features specifications on general project
            overview, description of funding sources and details about project supporters as well as
            related activity data related to the projects.
          </Content>
          <BoxButton sx={{ height: 100 }} to="/reports" title={'View'} />
        </G>
        <G>
          <Title>Contribute</Title>
          <ContributeIcon size={48} />
          <Content>
            Upload and periodically update project details. Although the submission of information
            to the database is voluntary, data providers are encouraged to upload and update the
            information into the database to benefit a wide range of use cases in the country.
          </Content>
          <BoxButton sx={{ height: 100 }} to="/submissions/new" title={'Start'} />
        </G>
      </Grid>
    </Container>
  </Div>
))
