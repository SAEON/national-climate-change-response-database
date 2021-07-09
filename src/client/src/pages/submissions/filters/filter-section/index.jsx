import { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import FilterHeader from './_header'
import useTheme from '@material-ui/core/styles/useTheme'
import TextFilter from './_text-filter'
import VocabularyFilter from './_vocabulary-filter'
import { DEFAULT_VALUE as NA_VOCAB_SELECT } from './_vocabulary-filter'

export default ({ filters, setFilter, title }) => {
  const _filters = Object.entries(filters)
  const theme = useTheme()

  const [collapsed, setCollapsed] = useState(
    !Object.entries(filters).reduce((isFiltered, [, { value }]) => {
      if (value && value.toLowerCase() !== NA_VOCAB_SELECT.toLowerCase()) {
        isFiltered = true
      }
      return isFiltered
    }, false)
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
            {_filters.length ? (
              _filters.map(([field, info]) => {
                const { type, root, tree } = info
                if (type === 'fulltext') {
                  return (
                    <TextFilter
                      key={field}
                      field={field}
                      info={info}
                      setValue={value => setFilter({ field, value })}
                    />
                  )
                }

                if (type === 'controlledVocabulary') {
                  if (!root || !tree) {
                    throw new Error('No root or tree specified for controlled vocabulary filter')
                  }
                  return (
                    <VocabularyFilter
                      key={field}
                      field={field}
                      root={root}
                      tree={tree}
                      info={info}
                      setValue={value => setFilter({ field, value })}
                    />
                  )
                }

                throw new Error('Unknown filter type')
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
