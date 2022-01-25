import BarChart, { transformData } from '../../echarts/bar-chart'

export default ({
  data: {
    OPERATIONAL_PROJECTS_BY_YEAR: { data },
  },
}) => {
  const chart = transformData(data, { d1: 'year', d2: 'intervention', fact: 'operationalProjects' })

  return (
    <BarChart
      title={'Operational projects (annually)'}
      categories={chart.categories}
      xAxis={{ name: 'Year' }}
      yAxis={{
        name: 'Project count',
        axisLabel: {
          formatter: value => `${value}  `,
        },
      }}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
