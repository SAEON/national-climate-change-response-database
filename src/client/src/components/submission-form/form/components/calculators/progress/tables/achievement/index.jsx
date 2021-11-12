import Typography from '@mui/material/Typography'
import DataGrid, { TextEditor } from 'react-data-grid'
import useTheme from '@mui/material/styles/useTheme'
import AchievedUnitEditor from './_unit-editor'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default ({ rows, updateCalculator, calculator, grid1 }) => {
  const theme = useTheme()

  return (
    <>
      {/* PREAMBLE */}
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

      {/* TABLE */}
      <div
        style={{ height: rows.length <= 6 ? rows.length * 35 + 2 * 35 + 2 : 300, width: '100%' }}
      >
        <DataGrid
          style={{ height: '100%' }}
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
              editor: TextEditor,
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
      </div>
    </>
  )
}
