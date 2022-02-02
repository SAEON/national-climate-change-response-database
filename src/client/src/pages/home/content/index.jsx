import { forwardRef } from 'react'
import Container from '@mui/material/Container'
import { Div } from '../../../components/html-tags'
import BoxButton from '../../../components/fancy-buttons/box-button'
import Grid from '@mui/material/Grid'
import { alpha, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const Text_ = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
}))

const StyledGrid = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const GridItem = props => <StyledGrid item xs={12} sm={4} {...props} />

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

export default forwardRef(({ routes }, ref) => {
  const emphasizedRoutes = routes.filter(({ includeOnHomePage = false }) => includeOnHomePage)

  return (
    <Div ref={ref} sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }}>
      <Container
        sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(12) }}
      >
        <Grid container spacing={8} sx={{ my: theme => theme.spacing(6) }}>
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
      </Container>
    </Div>
  )
})
