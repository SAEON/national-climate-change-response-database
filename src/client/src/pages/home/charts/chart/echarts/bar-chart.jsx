import Echarts from 'echarts-for-react'
import theme from '../../../../../theme/echarts'

export default ({ categories, series, title }) => {
  return (
    <Echarts
      theme={theme}
      style={{ height: '100%', width: '100%' }}
      option={{
        legend: {
          show: true,
          top: 50,
        },
        axisPointer: {
          type: 'shadow',
        },
        title: {
          top: '10px',
          left: 'center',
          text: title,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
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
          boundaryGap: false,
          type: 'category',
          name: 'Year',
          axisLabel: { rotate: 90 },
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
        },
        series,
      }}
    />
  )
}
