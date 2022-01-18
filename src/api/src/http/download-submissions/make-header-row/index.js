// TODO read the .graphql files to get the comments that show the human readable name

export default ({ columns }) => {
  const header = new Array(Object.keys(columns).length).fill('')
  for (const column in columns) {
    header[columns[column]] = column
  }

  return `${header.join(',')}\n`
}
