import { useState, useEffect, useRef, createRef } from 'react'

export default ({ children, effects = [], ...formFields }) => {
  const [fields, updateAllFields] = useState(formFields)

  const refs = useRef(
    effects.reduce((refs, effect, i) => {
      const ref = createRef()
      ref.current = effect
      return Object.assign(refs, { [i]: ref })
    }, {})
  )

  useEffect(
    () =>
      Object.entries(refs.current).forEach(([, { current: effect }]) => {
        effect(fields)
      }),
    [fields]
  )

  const updateForm = obj => {
    updateAllFields(fields => Object.assign({ ...fields }, obj))
  }

  return children(updateForm, {
    ...fields,
  })
}
