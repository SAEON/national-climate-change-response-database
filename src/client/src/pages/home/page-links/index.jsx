import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import BoxButton from '../../../components/fancy-buttons/box-button'
import { alpha, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import GridItem from '../components/grid-item'
import Grid from '@mui/material/Grid'

const Text_ = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
}))

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

export default () => {
  const emphasizedRoutes = useContext(clientContext)._clientRoutes.filter(
    ({ includeOnHomePage = false }) => includeOnHomePage
  )

  return (
    <Grid justifyContent="center" container spacing={6}>
      {emphasizedRoutes.map(({ cta, label, Icon, description = 'Description missing', to }) => {
        return (
          <GridItem key={label}>
            <Title>{label}</Title>
            <Icon
              sx={theme => ({
                color: alpha(theme.palette.common.white, 0.9),
                margin: theme.spacing(3),
                marginBottom: theme.spacing(4),
              })}
              size={48}
            />
            <Content>{description}</Content>
            <BoxButton sx={{ height: 100 }} to={to} title={cta} />
          </GridItem>
        )
      })}
    </Grid>
  )
}
