import { useState, useRef, useEffect } from 'react'

export default ({ children, effect, ...formFields }) => {
  const [fields, updateAllFields] = useState(formFields)

  const effectRef = useRef(null)

  useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = effect
    }
  }, [effect])

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current(fields)
    }
  }, [fields])

  const updateForm = obj => {
    updateAllFields(Object.assign({ ...fields }, obj))
  }

  return children(updateForm, {
    ...fields,
  })
}
