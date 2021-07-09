import { useContext } from 'react'
import { context as filterContext } from '../context'
import FilterSection from './filter-section'

export default () => {
  const {
    projectFilters,
    mitigationFilters,
    adaptationFilters,
    setProjectFilters,
    setAdaptationFilters,
    setMitigationFilters,
  } = useContext(filterContext)

  return (
    <>
      <FilterSection
        title="Project filters"
        filters={projectFilters}
        setFilter={setProjectFilters}
      />

      <FilterSection
        title="Mitigation filters"
        filters={mitigationFilters}
        setFilter={setMitigationFilters}
      />

      <FilterSection
        title="Adaptation filters"
        filters={adaptationFilters}
        setFilter={setAdaptationFilters}
      />
    </>
  )
}
