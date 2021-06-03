const columns = [
  { field: 'renewableType', headerName: 'Renewable', editable: false, type: 'string', width: 250 },
  {
    field: 'totalKwh',
    headerName: 'Total kWh project lifespan',
    editable: false,
    type: 'number',
    width: 250,
  },
  {
    field: 'totalKwhReduction',
    headerName: 'Total annual reduction of grid purchases (kWh)',
    editable: false,
    type: 'number',
    width: 250,
  },
]

export default ({ calculator }) => {
  const { grid } = calculator

  if (!grid) {
    return null
  }

  const rows = Object.entries(grid).map(([renewable, info]) => {
    console.log('info', renewable, info)
    return 'hi'
  })

  console.log('calculator', calculator)
  return 'hi'
}
