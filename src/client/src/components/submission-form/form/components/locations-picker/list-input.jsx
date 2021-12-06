import { useState } from 'react'
import DataGrid from 'react-data-grid'
import Button from '@mui/material/Button'
import PlusIcon from 'mdi-react/PlusIcon'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from 'mdi-react/DeleteIcon'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import MessageDialogue from '../../../../message-dialogue'
import TextField from '@mui/material/TextField'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

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
  const theme = useTheme()

  return (
    <div style={{ height: '100%' }}>
      <DataGrid
        style={{ height: 'calc(100% - 48px)' }}
        enableVirtualization={true}
        columns={[
          {
            key: 'id',
            headerRenderer,
            name: 'ID',
            width: 50,
          },
          {
            key: 'xy',
            headerRenderer,
            name: 'Long / Lat',
            formatter: ({
              row: {
                xy: [x, y],
              },
            }) => `${x} / ${y}`,
          },
          {
            key: '_delete',
            name: '',
            width: 100,
            formatter: ({ row: { id: _i } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <IconButton
                  onClick={() => setPoints(points.filter((_, i) => i !== _i - 1))}
                  size="small"
                >
                  <DeleteIcon size={18} />
                </IconButton>
              </div>
            ),
          },
        ]}
        rows={points.map(([x, y], i) => ({
          id: i + 1,
          xy: [x, y],
        }))}
      />
      <AppBar
        style={{ zIndex: 1 }}
        variant="outlined"
        elevation={0}
        color="default"
        position="relative"
      >
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
            {closeFn => <NewPointForm setPoints={setPoints} points={points} closeFn={closeFn} />}
          </MessageDialogue>
        </Toolbar>
      </AppBar>
    </div>
  )
}
