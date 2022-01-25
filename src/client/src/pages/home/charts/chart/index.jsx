import { useContext } from 'react'
import { context as dataContext } from '../context'
import CircularProgress from '@mui/material/CircularProgress'
import { Div, Span } from '../../../../components/html-tags'
import { styled } from '@mui/material/styles'
import Icon from 'mdi-react/AlertIcon'
import Tooltip from '@mui/material/Tooltip'

export { default as SPEND_BUDGET } from './spend-budget'

const ErrorIcon = styled(Icon)(({ theme }) => ({
  color: theme.palette.error.main,
}))

const Outline = styled(Div)(({ theme }) => ({
  width: 500,
  height: 500,
  border: `1px solid ${theme.palette.common.white}`,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  position: 'relative',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}))

export default ({ children: Children }) => {
  const { error, loading, data } = useContext(dataContext)

  if (loading) {
    return (
      <Outline>
        <CircularProgress />
      </Outline>
    )
  }

  if (error) {
    console.error('Chart error', error)
    return (
      <Outline sx={{ height: 200, width: 200 }}>
        <Tooltip
          placement="top"
          title={'Error loading chart data. Please look at the console for more details'}
        >
          <Span>
            <ErrorIcon size={64} />
          </Span>
        </Tooltip>
      </Outline>
    )
  }

  return (
    <Outline>
      <Div sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <Children data={data} />
      </Div>
    </Outline>
  )
}
