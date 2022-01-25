import BarChart, { transformData } from '../../echarts/bar-chart'

export default ({
  data: {
    SECTOR_FUNDING: { data },
  },
}) => {
  const chart = transformData(data, { d1: 'fundingSource', d2: 'hostSector', fact: 'budget' })

  return (
    <BarChart
      title={'Sector funding'}
      categories={chart.categories}
      xAxis={{ name: 'Funding type' }}
      legend={{ show: false }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
