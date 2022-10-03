import { useState } from 'react'
import 'react-data-grid/lib/styles.css';
import DataGrid_ from 'react-data-grid'
import Button from '@mui/material/Button'
import PlusIcon from 'mdi-react/PlusIcon'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from 'mdi-react/DeleteIcon'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import MessageDialogue from '../../../../../message-dialogue'
import TextField from '@mui/material/TextField'
import { Div } from '../../../../../html-tags'

const DataGrid = styled(DataGrid_)({})

const headerRenderer = ({ column }) => (
  <Div sx={{ width: '100%', textAlign: 'center' }}>{column.name}</Div>
)

const NewPointForm = ({ closeFn, points, setPoints }) => {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  return (
    <>
      <DialogContent>
        <TextField
          value={lng}
          onChange={e => setLng(e.target.value)}
          label="Longitude"
          type="number"
          helperText="Longitude in degrees (East / West)"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          value={lat}
          onChange={e => setLat(e.target.value)}
          label="Latitude"
          type="number"
          helperText="Latitude in degrees (North / South)"
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          key="add-gps-point"
          onClick={e => {
            setPoints([...points, [parseFloat(lng), parseFloat(lat)]])
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

export default ({ points, setPoints }) => (
  <Div sx={{ height: '100%' }}>
    <DataGrid
      sx={{ height: 'calc(100% - 48px)' }}
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
            <Div sx={{ width: '100%', textAlign: 'center' }}>
              <IconButton
                onClick={() => setPoints(points.filter((_, i) => i !== _i - 1))}
                size="small"
              >
                <DeleteIcon size={18} />
              </IconButton>
            </Div>
          ),
        },
      ]}
      rows={points.map(([x, y], i) => ({
        id: i + 1,
        xy: [x, y],
      }))}
    />
    <AppBar sx={{ zIndex: 1 }} variant="outlined" elevation={0} color="default" position="relative">
      <Toolbar
        variant="dense"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: theme => theme.spacing(1),
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
  </Div>
)
