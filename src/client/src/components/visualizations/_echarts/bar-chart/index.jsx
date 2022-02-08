import Echarts from 'echarts-for-react'
import makeEchartsTheme from '../themes/default'
import _seriesTemplate from './_series-template'
import _transformData from './_transform-data'
import { useTheme } from '@mui/material/styles'

export const seriesTemplate = _seriesTemplate

export const transformData = _transformData

export default ({
  categories,
  series,
  title,
  legend = { show: true, top: 50 },
  yAxis = {},
  xAxis = {},
  toolbox = {
    showTitle: true,
    top: 5,
    right: 5,
    feature: {
      magicType: {
        type: ['line', 'bar', 'stack'],
      },
      saveAsImage: {
        title: 'Save as image',
        pixelRatio: 10,
      },
    },
  },
}) => {
  const theme = useTheme()

  return (
    <Echarts
      theme={makeEchartsTheme(
        9,
        { color: theme.palette.primary.main, pos: 0 },
        { color: theme.palette.grey[200], pos: 0.3 },
        { color: theme.palette.grey[400], pos: 0.6 },
        { color: theme.palette.secondary.main, pos: 1 }
      )}
      style={{ height: '100%', width: '100%' }}
      option={{
        toolbox,
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
          appendToBody: true,
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
