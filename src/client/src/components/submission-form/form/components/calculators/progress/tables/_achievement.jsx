import { useState } from 'react'
import getCellValue from '../../get-cell-value.js'
import Typography from '@mui/material/Typography'
import DataGrid, { TextEditor } from 'react-data-grid'
import useTheme from '@mui/material/styles/useTheme'
import ControlledVocabularySelect from '../../../controlled-vocabulary-select'

export default ({ years, endYear, updateCalculator, calculator, grid1 }) => {
  const theme = useTheme()

  const rows = years.map(year => ({
    id: year,
    year,
    achieved: getCellValue({
      calculator: 'progress',
      endYear: endYear,
      currentYear: year,
      grid: grid1,
      key: 'achieved',
    }),
    achievedUnit: getCellValue({
      calculator: 'progress',
      endYear: endYear,
      currentYear: year,
      grid: grid1,
      key: 'achievedUnit',
    }),
  }))

  return (
    <>
      <Typography
        variant="overline"
        style={{
          textAlign: 'center',
          marginTop: theme.spacing(2),
          marginRight: theme.spacing(2),
          marginLeft: theme.spacing(2),
          display: 'block',
        }}
      >
        Achievement reporting
      </Typography>
      <Typography
        variant="caption"
        style={{
          display: 'block',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: theme.spacing(2),
        }}
      >
        e.g a Number of Kilowatt-hours of electricity generated, Kilowatt-hours of electricity
        saved, Kilograms of waste saved
      </Typography>
      <div style={{ height: rows.length <= 6 ? rows.length * 52 + 58 : 300, width: '100%' }}>
        <DataGrid
          style={{ height: '100%' }}
          enableVirtualization={true}
          columns={[
            { key: 'year', name: 'Year', width: 120 },
            {
              key: 'achieved',
              name: 'How much was generated/saved/avoided achieved',
              type: 'number',
              editor: TextEditor,
              width: 450,
            },
            {
              key: 'achievedUnit',
              name: 'Unit of achievements',
              formatter: ({ row: { id, achievedUnit } }) => (
                <ControlledVocabularySelect
                  tree={'mitigationUnits'}
                  root="Unit"
                  value={achievedUnit.term ? achievedUnit : { term: '(NONE)' }}
                  onChange={value => {
                    updateCalculator(
                      Object.assign(
                        { ...calculator },
                        {
                          grid1: Object.assign(
                            { ...grid1 },
                            {
                              [id]: Object.assign(
                                { ...(grid1?.[id] || {}) },
                                {
                                  achievedUnit: value,
                                }
                              ),
                            }
                          ),
                        }
                      )
                    )
                  }}
                />
              ),
            },
          ]}
          rows={rows}
          hideFooter={rows.length < 100 ? true : false}
          onEditCellChangeCommitted={({ id, key, props }) => {
            return updateCalculator(
              Object.assign(
                { ...calculator },
                {
                  grid1: Object.assign(
                    { ...grid1 },
                    {
                      [id]: Object.assign(
                        { ...(grid1?.[id] || {}) },
                        {
                          [key]: props.value,
                        }
                      ),
                    }
                  ),
                }
              )
            )
          }}
        />
      </div>
    </>
  )
}
