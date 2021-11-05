import { useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import Button from '@mui/material/Button'
import PlusIcon from 'mdi-react/PlusIcon'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from 'mdi-react/DeleteIcon'
import useStyles from './style'
import clsx from 'clsx'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import MessageDialogue from '../../../../message-dialogue'
import TextField from '@mui/material/TextField'

const NewPointForm = ({ closeFn, points, setPoints }) => {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  return (
    <>
      <DialogContent>
        <TextField
          value={lat}
          onChange={e => setLat(e.target.value)}
          label="Latitude"
          type="number"
          helperText="Latitude in degrees (East / West)"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          value={lng}
          onChange={e => setLng(e.target.value)}
          label="Longitude"
          type="number"
          helperText="Longitude in degrees (North / South)"
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          key="add-gps-point"
          onClick={e => {
            setPoints([...points, [parseFloat(lat), parseFloat(lng)]])
            closeFn(e)
          }}
          startIcon={<PlusIcon size={18} />}
          color="primary"
          size="small"
          variant="text"
          disableElevation
        >
          Add point
        </Button>
      </DialogActions>
    </>
  )
}

export default ({ points, setPoints }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <DataGrid
      disableSelectionOnClick
      disableColumnSelector
      components={{
        Footer: () => (
          <AppBar style={{ zIndex: 1 }} variant="outlined" color="default" position="relative">
            <Toolbar
              variant="dense"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: theme.spacing(1),
              }}
            >
              <MessageDialogue
                title="Add location point"
                tooltipProps={{
                  title: 'Add location point',
                }}
                Button={openFn => (
                  <Button
                    onClick={openFn}
                    disableElevation
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<PlusIcon size={18} />}
                  >
                    Add point
                  </Button>
                )}
              >
                {closeFn => (
                  <NewPointForm setPoints={setPoints} points={points} closeFn={closeFn} />
                )}
              </MessageDialogue>
            </Toolbar>
          </AppBar>
        ),
      }}
      columns={[
        {
          field: 'id',
          cellClassName: () => clsx(classes.cell),
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          headerName: 'ID',
          width: 50,
        },
        {
          field: 'xy',
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          headerName: 'Lat / Long',
          valueGetter: ({
            row: {
              xy: [x, y],
            },
          }) => `${x} / ${y}`,
          flex: 1,
        },
        {
          field: '_delete',
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          headerName: ` `,
          width: 100,
          cellClassName: () => clsx(classes.cell),
          renderCell: ({ row: { id: _i } }) => {
            return (
              <IconButton
                onClick={() => setPoints(points.filter((_, i) => i !== _i - 1))}
                size="small"
              >
                <DeleteIcon size={18} />
              </IconButton>
            )
          },
        },
      ]}
      rows={points.map(([x, y], i) => ({
        id: i + 1,
        xy: [x, y],
      }))}
    />
  )
}
