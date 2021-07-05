export default filters =>
  filters.reduce(
    (a, c) => {
      const { mitigations, adaptations, ...project } = c

      Object.entries(project)
        .filter(([field, value]) => field !== '__typename' && value)
        .forEach(([field, value]) => {
          a.project[field] = a.project[field] ? [...new Set([...a.project[field], value])] : [value]
        })

      mitigations.forEach(mitigation => {
        Object.entries(mitigation)
          .filter(([field, value]) => field !== '__typename' && value)
          .forEach(([field, value]) => {
            a.mitigation[field] = a.mitigation[field]
              ? [...new Set([...a.mitigation[field], value])]
              : [value]
          })
      })

      adaptations.forEach(adaptation => {
        Object.entries(adaptation)
          .filter(([field, value]) => field !== '__typename' && value)
          .forEach(([field, value]) => {
            a.adaptation[field] = a.adaptation[field]
              ? [...new Set([...a.adaptation[field], value])]
              : [value]
          })
      })

      return a
    },
    { project: {}, mitigation: {}, adaptation: {} }
  )
