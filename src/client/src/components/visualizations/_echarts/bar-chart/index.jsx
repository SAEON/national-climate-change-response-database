import Echarts from 'echarts-for-react'
import theme from '../themes/default'
import _seriesTemplate from './_series-template'
import _transformData from './_transform-data'

export const seriesTemplate = _seriesTemplate

export const transformData = _transformData

export default ({
  categories,
  series,
  title,
  legend = { show: true, top: 50 },
  yAxis = {},
  xAxis = {},
}) => {
  return (
    <Echarts
      theme={theme}
      style={{ height: '100%', width: '100%' }}
      option={{
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        backgroundColor: 'transparent',
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
