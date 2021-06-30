export default (defs, type) => {
  const regex = new RegExp(`type\\s${type}\\s{(.|\\n)*?}`, 'g')
  return defs
    .match(regex)[0]
    .split('\n')
    .slice(1, -1)
    .map(fieldDef => fieldDef.split(':'))
    .filter(([, type = '']) => type.trim() === 'ControlledVocabulary')
    .map(([name]) => name.trim())
}
