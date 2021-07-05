import { lazy, Suspense } from 'react'

export { default as BooleanField } from './_boolean'
export { default as DateTimeField } from './_datetime'
export { default as IntField } from './_int'
export { default as MoneyField } from './_money'
export { default as StringField } from './_string'
export { default as EnumField } from './_enum'
export { default as GqlBoundFormInput } from './_bind-input'
export { default as ControlledVocabularySelect } from './_controlled-vocabulary-select'
export { default as ControlledVocabularySelectMultiple } from './_controlled-vocabulary-select-multiple'
export { default as FormSection } from './_form-section'
export { default as ComposeForm } from './_compose-form'

const LocationsPicker_ = lazy(() => import('./locations-picker'))
const FileUpload_ = lazy(() => import('./upload'))

export const LocationsPicker = props => (
  <Suspense fallback={null}>
    <LocationsPicker_ {...props} />
  </Suspense>
)

export const FileUpload = props => (
  <Suspense fallback={null}>
    <FileUpload_ {...props} />
  </Suspense>
)
