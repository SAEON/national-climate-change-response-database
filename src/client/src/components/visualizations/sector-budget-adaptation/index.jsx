import BarChart, { transformData } from '../_echarts/bar-chart'

export default ({
  data: {
    SECTOR_BUDGET: { data },
  },
  ...props
}) => {
  const chart = transformData(
    data.filter(({ intervention }) => intervention === 'Adaptation'),
    { d1: 'hostSector', d2: 'intervention', fact: 'budget' }
  )

  return (
    <BarChart
      title={'Sector budget (adaptation)'}
      categories={chart.categories}
      xAxis={{ name: '' }}
      legend={{ show: false }}
      series={Object.entries(chart.series).map(([, series]) => series)}
      {...props}
    />
  )
}
