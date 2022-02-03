import BarChart, { transformData } from '../_echarts/bar-chart'

export default ({
  data: {
    PROJECT_COUNT: { data },
  },
  ...props
}) => {
  const chart = transformData(data, {
    d1: 'intervention',
    d2: 'implementationStatus',
    fact: 'total',
  })

  return (
    <BarChart
      title={'Project count by status'}
      categories={chart.categories}
      xAxis={{ name: 'Intervention type' }}
      yAxis={{
        name: 'Project count',
        axisLabel: {
          formatter: value => `${value}  `,
        },
      }}
      series={Object.entries(chart.series).map(([, series]) => series)}
      {...props}
    />
  )
}
