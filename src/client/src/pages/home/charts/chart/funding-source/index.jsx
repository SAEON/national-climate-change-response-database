import BarChart, { transformData } from '../../echarts/bar-chart'

export default ({
  data: {
    FUNDING_SOURCE: { data },
  },
}) => {
  const chart = transformData(data, { d1: 'intervention', d2: 'fundingSource', fact: 'budget' })

  return (
    <BarChart
      title={'Funding source'}
      categories={chart.categories}
      xAxis={{ name: 'Intervention type' }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
