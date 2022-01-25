import BarChart, { transformData } from '../../echarts/bar-chart'

export default ({
  data: {
    SECTOR_BUDGET: { data },
  },
}) => {
  const chart = transformData(data, { d1: 'intervention', d2: 'hostSector', fact: 'budget' })

  return (
    <BarChart
      title={'Sector budget'}
      categories={chart.categories}
      xAxis={{ name: 'Intervention type' }}
      legend={{ show: false }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
