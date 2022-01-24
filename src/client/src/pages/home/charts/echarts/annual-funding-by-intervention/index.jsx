import Echarts from 'echarts-for-react'
import theme from '../../../../../theme/echarts'

export default ({
  data: {
    ANNUAL_FUNDING_BY_INTERVENTION: { data },
  },
}) => {
  const series = {}
  const xAxis = {
    boundaryGap: false,
    type: 'category',
    data: [],
  }
  const yAxis = {
    type: 'value',
  }

  data.forEach(({ year, intervention, spend }) => {
    let i = xAxis.data.findIndex(year_ => year === year_)
    if (i < 0) {
      xAxis.data.push(year)
      i = xAxis.data.length - 1
    }

    series[intervention] = series[intervention] || {
      name: intervention,
      stack: 'Total',
      type: 'bar',
      data: new Array(data.length).fill(0),
      label: {
        show: false,
      },
      emphasis: {
        focus: 'series',
      },
    }

    series[intervention].data[i] = spend
  })

  return (
    <Echarts
      theme={theme}
      style={{ height: '100%', width: '100%' }}
      option={{
        axisPointer: {
          type: 'shadow',
        },
        title: {
          left: 'center',
          text: 'Budgeted intervention spend',
          subtext: 'ZAR/year',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis,
        yAxis,
        series: Object.entries(series).map(([, series]) => series),
      }}
    />
  )
}
