import BarChart, { transformData } from '../_echarts/bar-chart'

export default ({
  data: {
    SPEND_BUDGET: { data },
  },
}) => {
  const chart = transformData(data, { d1: 'year', d2: 'intervention', fact: 'spend' })

  return (
    <BarChart
      title={'Spend budget'}
      categories={chart.categories}
      xAxis={{ name: 'Year' }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
