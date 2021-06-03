export default form => {
  return Object.entries(form)
    .filter(([, value]) => value)
    .reduce(
      (entries, [key, value]) => {
        if (Object.prototype.toString.call(value) === '[object Object]') {
          entries.vocabInput.push([key, value])
        } else {
          entries.simpleInput.push([key, value])
        }
        return entries
      },
      { simpleInput: [], vocabInput: [] }
    )
}
