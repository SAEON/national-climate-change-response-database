export default form => {
  return Object.entries(form)
    .filter(([, value]) => value)
    .reduce(
      (entries, [key, value]) => {
        // If the value is an object
        if (Object.prototype.toString.call(value) === '[object Object]') {
          if (key === 'energyData') {
            if (entries.energyData) {
              throw new Error('Cannot define energy data twice for insertion')
            }
            entries.energyData = value
          } else if (key === 'emissionsData') {
            if (entries.emissionsData) {
              throw new Error('Cannot define emissions data twice for insertion')
            }
            entries.emissionsData = value
          } else {
            entries.vocabInput.push([key, value])
          }
        } else {
          entries.simpleInput.push([key, value])
        }

        // Otherwise the value is a simple type
        return entries
      },
      { simpleInput: [], vocabInput: [], energyData: undefined, emissionsData: undefined }
    )
}
