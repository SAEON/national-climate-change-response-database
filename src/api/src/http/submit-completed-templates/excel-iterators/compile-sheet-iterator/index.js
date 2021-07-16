export default (sheet, topLeft, bottomRight) => {
  const range = sheet.range(topLeft, bottomRight).cells()

  return function iterate(rowNumber = 0) {
    const row = range[rowNumber]
    return {
      next: () => iterate(rowNumber + 1),
      data: row,
      done: !row,
    }
  }
}
