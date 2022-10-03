import Typography from '@mui/material/Typography'
import 'react-data-grid/lib/styles.css'
import DataGrid, { textEditor } from 'react-data-grid'
import useTheme from '@mui/material/styles/useTheme'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default ({ rows, grid2, calculator, updateCalculator }) => {
  const theme = useTheme()

  return (
    <>
      {/* PREAMBLE */}
      <Typography
        variant="overline"
        style={{ textAlign: 'center', margin: theme.spacing(2), display: 'block' }}
      >
        Project expenditure
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
        The term &quot;project expenditure&quot; refers to the annual cost of the previous calendar
        year. This is not the project&apos;s total budget; however, it is a breakdown of the annual
        financial expenditures.
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
                  grid2: Object.assign(
                    { ...grid2 },
                    {
                      [id]: Object.assign(
                        { ...(grid2?.[id] || {}) },
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
            {
              key: 'year',
              name: 'Year',
              editable: false,
              width: 150,
              headerRenderer,
              summaryFormatter: ({ row }) => <>{row.yearsSummary}</>,
            },

            {
              key: 'expenditureZar',
              name: 'Expenditure in (ZAR)',
              editor: textEditor,
              headerRenderer,
              summaryFormatter: ({ row }) => <>{row.expenditureSum}</>,
            },
          ]}
          rows={rows}
          summaryRows={[
            {
              yearsSummary: 'TOTAL',
              expenditureSum: rows.reduce((sum, { expenditureZar }) => sum + expenditureZar, 0),
            },
          ]}
        />
      </div>
    </>
  )
}
