import BarChart, { transformData } from '../_echarts/bar-chart'

export default ({
  data: {
    SECTOR_BUDGET: { data },
  },
}) => {
  const chart = transformData(
    data.filter(({ intervention }) => intervention === 'Mitigation'),
    { d1: 'hostSector', d2: 'intervention', fact: 'budget' }
  )

  return (
    <BarChart
      title={'Sector budget (mitigation)'}
      categories={chart.categories}
      xAxis={{ name: '' }}
      legend={{ show: false }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
