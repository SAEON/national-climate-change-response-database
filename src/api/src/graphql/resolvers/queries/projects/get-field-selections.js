const getFieldSelections = (selections, field = 'project') => {
  return selections.reduce(
    (acc, selection) => {
      if (selection.name.value === '__typename') {
        return acc
      }

      if (selection.selectionSet) {
        if (selection.name.value === 'mitigations' || selection.name.value === 'adaptations') {
          return Object.assign(
            { ...acc },
            getFieldSelections(selection.selectionSet.selections, selection.name.value)
          )
        }
      }

      acc[field] = [...new Set([...acc[field], selection.name.value])]

      return acc
    },
    {
      [field]: [],
    }
  )
}

export default getFieldSelections
