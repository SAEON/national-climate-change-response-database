import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'
import { Div } from '../../../components/html-tags'
import BoxButton from '../../../components/fancy-buttons/box-button'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'

const Text = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: alpha(theme.palette.common.white, 0.9),
  marginBottom: theme.spacing(2),
}))

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
      <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Container>
          {/* <Text variant="h5">
            The platform is developed and managed by the Department of Forestry, Fisheries and the
            Environment (DFFE) to facilitate the monitoring and tracking of national, provincial and
            local responses to climate change.
          </Text>
          <Text variant="h5">
            As outlined in both the National Development Plan (NDP) and National Climate Change
            Response Policy (2011), South Africa has committed to a just transition to a low carbon
            economy and climate-resilient society. The country is projected to face a higher
            frequency of climate-related disasters that are increasing in intensity, and these
            events are likely to be associated with impacts that are on par with, if not worse than
            those already experienced.
          </Text> */}
          <Div sx={{ height: 100 }}>
            <BoxButton title="Explore 876 South African climate change projects" />
            <Button
              sx={{ color: theme => theme.palette.common.white }}
              component={Link}
              to="/submissions"
              variant="text"
              size="large"
            >
              About
            </Button>
            <Button
              sx={{ color: theme => theme.palette.common.white }}
              component={Link}
              to="/submissions"
              variant="text"
              size="large"
            >
              Analyze our data
            </Button>
            <Button
              sx={{ color: theme => theme.palette.common.white }}
              component={Link}
              to="/submissions"
              variant="text"
              size="large"
            >
              Submit a project
            </Button>
          </Div>

          {/* <Text variant="overline">
            The National Climate Change Response Database (NCCRD) is intended as a resource to
            collect and track interventions on climate change (adaptation and mitigation) on past,
            current and future climate change response efforts (policies, plans, strategies,
            projects and research) across South Africa.
          </Text> */}
        </Container>
      </Div>
    </Div>
  )
}
