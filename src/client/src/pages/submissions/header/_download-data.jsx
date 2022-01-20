import { useContext, memo, useMemo } from 'react'
import { context as filterContext } from '../context'
import Hidden from '@mui/material/Hidden'
import Divider from '@mui/material/Divider'
import DownloadRecord from '../../../components/download-record'

const Download = memo(
  ({ filters, totalRecords }) => {
    return (
      <>
        <Divider
          flexItem
          orientation="vertical"
          sx={theme => ({ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) })}
        />

        <Hidden mdDown>
          <DownloadRecord
            buttonTitle={`Download ${totalRecords} submission${totalRecords === 1 ? '' : 's'}`}
            title="All (filtered) submissions"
            search={filters}
          />
        </Hidden>
      </>
    )
  },
  ({ filters: a }, { filters: b }) => JSON.stringify(a) == JSON.stringify(b)
)

export default () => {
  const { projectFilters, mitigationFilters, adaptationFilters, totalRecords } =
    useContext(filterContext)

  const project = useMemo(
    () =>
      Object.fromEntries(Object.entries(projectFilters).filter(([, { value }]) => Boolean(value))),
    [projectFilters]
  )

  const mitigation = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(mitigationFilters).filter(([, { value }]) => Boolean(value))
      ),
    [mitigationFilters]
  )

  const adaptation = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(adaptationFilters).filter(([, { value }]) => Boolean(value))
      ),
    [adaptationFilters]
  )

  return (
    <Download
      totalRecords={totalRecords}
      filters={{
        project,
        mitigation,
        adaptation,
      }}
    />
  )
}
