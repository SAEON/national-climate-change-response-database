export default form => {
  return Object.entries(form)
    .filter(([, value]) => value)
    .reduce(
      (entries, [key, value]) => {
        // If the value is an object
        if (Object.prototype.toString.call(value) === '[object Object]') {
          if (key === 'energyData') {
            entries.energyData = value
          } else if (key === 'emissionsData') {
            entries.emissionsData = value
          } else if (key === 'progressData') {
            entries.progressData = value
          } else {
            entries.vocabInput.push([key, value])
          }
        }
        // Otherwise the value is a simple type
        else {
          entries.simpleInput.push([key, value])
        }

        return entries
      },
      { simpleInput: [], vocabInput: [], energyData: undefined, emissionsData: undefined }
    )
}
