import Typography from '@mui/material/Typography'
import 'react-data-grid/lib/styles.css'
import DataGrid_, { textEditor } from 'react-data-grid'
import { styled } from '@mui/material/styles'
import AchievedUnitEditor from './_unit-editor'
import { Div } from '../../../../../../../html-tags'

const DataGrid = styled(DataGrid_)({})

const headerRenderer = ({ column }) => (
  <Div sx={{ width: '100%', textAlign: 'center' }}>{column.name}</Div>
)

export default ({ rows, updateCalculator, calculator, grid1 }) => {
  return (
    <>
      {/* PREAMBLE */}
      <Typography
        variant="overline"
        sx={{
          textAlign: 'center',
          marginTop: theme => theme.spacing(2),
          marginRight: theme => theme.spacing(2),
          marginLeft: theme => theme.spacing(2),
          display: 'block',
        }}
      >
        Achievement reporting
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: theme => theme.spacing(2),
        }}
      >
        e.g a Number of Kilowatt-hours of electricity generated, Kilowatt-hours of electricity
        saved, Kilograms of waste saved
      </Typography>

      {/* TABLE */}
      <Div sx={{ height: rows.length <= 6 ? rows.length * 35 + 2 * 35 + 2 : 300, width: '100%' }}>
        <DataGrid
          sx={{ height: '100%' }}
          enableVirtualization={true}
          onRowsChange={(rows, { column: { key }, indexes: [i] }) => {
            const value = rows[i][key]
            const id = rows[i].id

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
                          [key]: parseInt(value, 10),
                        }
                      ),
                    }
                  ),
                }
              )
            )
          }}
          columns={[
            { key: 'year', name: 'Year', width: 120 },
            {
              key: 'achieved',
              name: 'How much was generated/saved/avoided achieved',
              headerRenderer,
              editor: textEditor,
              width: 450,
            },
            {
              key: 'achievedUnit',
              name: 'Unit of achievements',
              headerRenderer,
              formatter: props => (
                <AchievedUnitEditor
                  updateCalculator={updateCalculator}
                  calculator={calculator}
                  grid1={grid1}
                  {...props}
                />
              ),
            },
          ]}
          rows={rows}
        />
      </Div>
    </>
  )
}
