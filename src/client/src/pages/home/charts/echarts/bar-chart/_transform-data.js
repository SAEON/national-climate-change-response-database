import seriesTemplate from './_series-template'

export default (data, { d1, d2, fact }) =>
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
