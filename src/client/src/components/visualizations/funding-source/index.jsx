import BarChart, { transformData } from '../_echarts/bar-chart'

export default ({
  data: {
    FUNDING_SOURCE: { data },
  },
  ...props
}) => {
  const chart = transformData(data, { d1: 'intervention', d2: 'fundingSource', fact: 'budget' })

  return (
    <BarChart
      title={'Funding source breakdown'}
      categories={chart.categories}
      xAxis={{ name: 'Intervention type' }}
      series={Object.entries(chart.series).map(([, series]) => series)}
      {...props}
    />
  )
}
