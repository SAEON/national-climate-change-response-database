export default (fields, form) => {
  const requiredFields = (
    fields?.map(({ name: fieldName, type: { kind } = {} }) => {
      if (kind === 'NON_NULL') {
        return [fieldName, Boolean(form?.[fieldName]?.length || form?.[fieldName]?.term)]
      }
    }) || []
  ).filter(_ => _)

  const filledInFields = Object.entries(form || {}).filter(([, value]) => value !== '')

  return {
    requiredFields: Object.fromEntries(requiredFields),
    isStarted: Boolean(filledInFields.length),
    isComplete: requiredFields.reduce(
      (isComplete, [, value]) => (isComplete ? value : false),
      true
    ),
  }
}
