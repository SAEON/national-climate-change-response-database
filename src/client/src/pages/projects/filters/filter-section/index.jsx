import { useState, useContext } from 'react'
import { context as filterContext } from '../../context'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import FilterHeader from './_header'
import useTheme from '@material-ui/core/styles/useTheme'
import KEY_TO_HUMAN from './key-to-human'

const DEFAULT_VALUE = '(None)'

export default ({ filters, entityContext }) => {
  const title = `${entityContext} filters`
  const theme = useTheme()
  const context = useContext(filterContext)
  const setFilter = context[`set${entityContext}Filter`]
  const availableFilters = Object.entries(filters)
  const activeFilters = context.filterContext[`${entityContext}Filters`]
  const [collapsed, setCollapsed] = useState(
    !Object.entries(activeFilters).filter(([, value]) => value).length
  )

  return (
    <div>
      <FilterHeader title={title} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Collapse
        style={{ width: '100%' }}
        key={`result-list-collapse-${title}`}
        unmountOnExit
        in={!collapsed}
      >
        <Paper style={{ backgroundColor: theme.backgroundColor }}>
          <Box px={3} py={2}>
            {availableFilters.length ? (
              availableFilters.map(([field, values], i) => {
                return (
                  <TextField
                    key={field}
                    id={`project-filter-${field}`}
                    select
                    fullWidth
                    value={activeFilters?.[field] || ''}
                    variant="outlined"
                    margin="normal"
                    label={KEY_TO_HUMAN[field].name}
                    helperText={KEY_TO_HUMAN[field].helperText}
                    onChange={e => {
                      if (e.target.value === DEFAULT_VALUE) {
                        setFilter({ [field]: '' })
                      } else {
                        setFilter({ [field]: e.target.value })
                      }
                    }}
                  >
                    {[DEFAULT_VALUE, ...values].map(value => (
                      <MenuItem key={value} value={value}>
                        <Typography variant="overline">{value}</Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                )
              })
            ) : (
              <Typography variant="overline">(No filters available)</Typography>
            )}
          </Box>
        </Paper>
      </Collapse>
    </div>
  )
}
