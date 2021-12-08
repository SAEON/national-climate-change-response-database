import { useContext } from 'react'
import { context as formContext } from '../../_context'
import Select from '../../../../../../../components/submission-form/form/components/controlled-vocabulary-select'

const Field = ({ value, updateForm }) => {
  return (
    <Select
      root="South Africa"
      tree="regions"
      value={value}
      isRequired
      onChange={updateForm}
      placeholder="Select geofence"
      helperText="Tenant deployments differ from the main deployment only in that all location-related information is bounded (geofenced). Geofences are loaded into the application on startup and stored in the database as geometry data. This list shows available geofences"
    />
  )
}

export default () => {
  const { form, setForm } = useContext(formContext)

  return <Field value={form.geofence} updateForm={geofence => setForm({ geofence })} />
}
