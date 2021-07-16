export default (defs, inputType) => {
  console.log(`input\\s${inputType}`)
  const regex = new RegExp(`input\\s${inputType}\\s{(.|\\n)*?}`, 'g')
  return defs
    .match(regex)[0]
    .split('\n')
    .slice(1, -1)
    .map(fieldDef => fieldDef.split(':'))
    .filter(([, type = '']) => type.trim().match(/ControlledVocabularyInput/))
    .map(([name]) => name.trim())
}
