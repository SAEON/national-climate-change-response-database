import { gql, useQuery } from '@apollo/client'
import GridItem from '../components/grid-item'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { alpha, styled } from '@mui/material/styles'
import BoxButton from '../../../components/fancy-buttons/box-button'
import Typography from '@mui/material/Typography'
import DatabaseIcon from 'mdi-react/DatabaseIcon'
import { Span, Div } from '../../../components/html-tags'

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

const DBIcon = styled(DatabaseIcon)({})

export default () => {
  const { error, loading, data } = useQuery(
    gql`
      query {
        tenants {
          id
          title
          hostname
          shortTitle
          description
        }
      }
    `
  )

  if (loading) {
    return (
      <GridItem>
        <CircularProgress sx={{ color: theme => alpha(theme.palette.common.white, 0.5) }} />
      </GridItem>
    )
  }

  if (error) {
    throw error
  }

  return (
    <>
      {data.tenants.map(({ hostname, title, shortTitle, description }) => (
        <GridItem sm={12} md={6} key={hostname}>
          <Title>{shortTitle || 'Missing shortTitle'}</Title>
          <DBIcon
            sx={theme => ({
              color: alpha(theme.palette.common.white, 0.9),
              margin: theme.spacing(3),
              marginBottom: theme.spacing(4),
            })}
            size={48}
          />
          <Content textAlign="center">{description || 'Missing description'}</Content>
          <Tooltip title={`Go to the ${title}`}>
            <Span sx={{ width: '100%', height: 100 }}>
              <BoxButton
                sx={{ height: 100 }}
                href={`http://${hostname}`}
                title={`Go to the ${shortTitle}`}
              />
            </Span>
          </Tooltip>
          <Div
            sx={theme => ({
              [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(8),
              },
            })}
          />
        </GridItem>
      ))}
    </>
  )
}
