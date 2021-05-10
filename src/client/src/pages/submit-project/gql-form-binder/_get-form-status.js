export const getFormStatus = (fields, form) => {
  const requiredFields = (
    fields?.map(({ name: fieldName, type }) => {
      const { ofType } = type
      if (ofType) {
        return [fieldName, Boolean(form[fieldName])]
      }
    }) || []
  ).filter(_ => _)

  const filledInFields = Object.entries(form).filter(([, value]) => value !== '')

  return {
    requiredFields: Object.fromEntries(requiredFields),
    isStarted: Boolean(filledInFields.length),
    isComplete: requiredFields.reduce((acc, current) => {
      if (!acc) return false
      return current[1]
    }, true),
  }
}

export const getMultiFormsStatus = forms => ({
  forms,
  isStarted: Boolean(forms.length),
  isComplete: forms.length ? forms.reduce((acc, c) => (!acc ? false : c.isComplete), true) : false,
})
