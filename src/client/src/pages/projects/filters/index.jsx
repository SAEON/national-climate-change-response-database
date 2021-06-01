import reduceFilters from './reduce-filters'
import Filter from './filter'

export default ({ filters: _filters }) => {
  console.log(_filters) // TODO adaptation.interventionStatus not showing
  const filters = reduceFilters(_filters)

  return (
    <>
      <Filter type={filters.project} title="Project filters" />
      <Filter type={filters.mitigation} title="Mitigation filters" />
      <Filter type={filters.adaptation} title="Adaptation filters" />
    </>
  )
}
