import BarChart from '../echarts/bar-chart'

export default ({
  data: {
    SPEND_BUDGET: { data },
  },
}) => {
  const chart = data.reduce(
    (data, row, index, array) => {
      const { year, intervention, spend } = row

      let i = data.categories.findIndex(year_ => year === year_)
      if (i < 0) {
        data.categories.push(year)
        i = data.categories.length - 1
      }

      data.series[intervention] = data.series[intervention] || {
        name: intervention,
        stack: 'Total',
        type: 'bar',
        data: new Array(array.length).fill(0),
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }

      data.series[intervention].data[i] = spend
      return data
    },
    { series: {}, categories: [] }
  )

  return (
    <BarChart
      title={'Spend budget'}
      categories={chart.categories}
      series={Object.entries(chart.series).map(([, series]) => series)}
    />
  )
}
