import { useTheme, alpha } from '@mui/material/styles'
import Echarts from 'echarts-for-react'
import echartsTheme from '../../../../theme/echarts'

export const seriesTemplate = {
  stack: 'Total',
  type: 'bar',
  label: {
    show: false,
  },
  emphasis: {
    itemStyle: {
      shadowBlur: 8,
      shadowOffsetX: 0,
    },
  },
}

export const transformData = (data, { d1, d2, fact }) =>
  data.reduce(
    (data, row, index, array) => {
      const d1Value = row[d1]
      const d2Value = row[d2]
      const factValue = row[fact]

      let i = data.categories.findIndex(x => x === d1Value)
      if (i < 0) {
        data.categories.push(d1Value)
        i = data.categories.length - 1
      }

      data.series[d2Value] = data.series[d2Value] || {
        ...seriesTemplate,
        name: d2Value,
        data: new Array(array.length).fill(0),
      }

      data.series[d2Value].data[i] = factValue
      return data
    },
    { series: {}, categories: [] }
  )

export default ({
  categories,
  series,
  title,
  legend = { show: true, top: 50 },
  yAxis = {},
  xAxis = {},
}) => {
  const theme = useTheme()

  return (
    <Echarts
      theme={echartsTheme}
      style={{ height: '100%', width: '100%' }}
      option={{
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        backgroundColor: alpha(theme.palette.common.white, 0.3),
        legend,
        axisPointer: {
          type: 'shadow',
          snap: true,
        },
        title: {
          top: '10px',
          left: 'center',
          text: title,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        grid: {
          top: 90,
          left: 50,
          right: 30,
          bottom: 40,
          containLabel: true,
          show: true,
        },
        xAxis: {
          boundaryGap: true,
          type: 'category',
          name: 'X Axis',
          axisLabel: { rotate: 30 },
          nameLocation: 'center',
          nameTextStyle: {
            fontStyle: 'italic',
          },
          position: 'bottom',
          offset: 0,
          nameGap: 50,
          axisTick: {
            show: true,
          },
          minorTick: {
            show: true,
          },
          data: categories,
          ...xAxis,
        },
        yAxis: {
          nameRotate: 90,
          nameGap: 55,
          nameLocation: 'center',
          nameTextStyle: {
            fontStyle: 'italic',
          },
          axisTick: {
            show: true,
          },
          minorTick: {
            show: true,
          },
          axisLabel: {
            formatter: value => `${(value / 1000000).toFixed(0)}  `,
          },
          offset: 0,
          type: 'value',
          name: 'Million ZAR',
          ...yAxis,
        },
        series,
      }}
    />
  )
}
