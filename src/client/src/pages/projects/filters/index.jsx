import { useContext } from 'react'
import { context as filterContext } from '../context'
import reduceFilters from './reduce-filters'
import FilterSection from './filter-section'

export default () => {
  const { filters: _filters } = useContext(filterContext)
  const filters = reduceFilters(_filters)

  return (
    <>
      <FilterSection filters={filters.project} entityContext="Project" />
      <FilterSection filters={filters.mitigation} entityContext="Mitigation" />
      <FilterSection filters={filters.adaptation} entityContext="Adaptation" />
    </>
  )
}
