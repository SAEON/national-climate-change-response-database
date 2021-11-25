import { createContext, useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const { error, loading, data } = useQuery(
    gql`
      query tenants {
        tenants {
          id
          hostname
          title
          shortTitle
          frontMatter
          description
          theme
        }
      }
    `
  )

  const [rows, setRows] = useState([])

  /**
   * Remove selected rows that are no longer present in data.tenants
   * (These have been deleted)
   **/
  useEffect(() => {
    if (data?.tenants) {
      const ids = data?.tenants.map(({ id }) => id) || []
      const _selected = [...selectedRows].filter(id => ids.includes(id))
      if (_selected.length !== selectedRows.size) {
        setSelectedRows(new Set([..._selected]))
      }
    }
  }, [data?.tenants, selectedRows])

  // Update rows
  useEffect(() => {
    if (data?.tenants) {
      setRows(
        [...(data.tenants || [])].sort(({ hostname: a }, { hostname: b }) => {
          if (a > b) return 1
          if (a < b) return -1
          return 0
        })
      )
    }
  }, [data?.tenants])

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return (
    <context.Provider
      value={{
        rows,
        setRows,
        selectedRows,
        setSelectedRows,
      }}
    >
      {children}
    </context.Provider>
  )
}
