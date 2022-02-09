import Typography from '@mui/material/Typography'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../config'
import Link from '@mui/material/Link'
import { Span, Div, Table, Tr, Td, Th, Thead, Tbody } from '../../../../components/html-tags'

const T = props => (
  <Typography
    variant="body2"
    style={{
      wordBreak: 'break-word',
      marginBottom: theme => theme.spacing(2),
    }}
    {...props}
  />
)

const renderValue = ({ key, value }) => {
  try {
    if (value?.term) {
      return <T>{value.term}</T>
    }

    if (value?.[0]?.term) {
      return (
        <T>
          {value.map(({ term }) => (
            <Span key={term} sx={{ display: 'block' }}>
              {term}
            </Span>
          ))}
        </T>
      )
    }

    if (key === 'coordinates (lng/lat)') {
      return value.map(xy => (
        <Span key={xy} sx={{ display: 'block' }}>
          {xy}
        </Span>
      ))
    }

    if (key === 'progressData') {
      const achievedTable = value.grid1
      const expenditureTable = value.grid2

      return (
        <>
          {Object.keys(achievedTable || {}).length ? (
            <Table>
              <Thead>
                <Tr>
                  <Th sx={{ pr: theme => theme.spacing(8), textAlign: 'left' }}>
                    <Typography variant="overline">Year</Typography>
                  </Th>
                  <Th sx={{ textAlign: 'left' }}>
                    <Typography variant="overline">Achievement</Typography>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {Object.entries(achievedTable).map(([year, { achieved, achievedUnit }]) => (
                  <Tr key={year}>
                    <Td>
                      <Typography variant="body2">{year}</Typography>
                    </Td>
                    <Td>
                      <Typography variant="body2">
                        {achieved} <i>{achievedUnit.term}</i>
                      </Typography>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : null}
          {Object.keys(expenditureTable || {}).length ? (
            <>
              <Div sx={{ mb: theme => theme.spacing(2) }} />
              <Table>
                <Thead>
                  <Tr>
                    <Th sx={{ pr: theme => theme.spacing(8), textAlign: 'left' }}>
                      <Typography variant="overline">Year</Typography>
                    </Th>
                    <Th sx={{ textAlign: 'left' }}>
                      <Typography variant="overline">Expenditure</Typography>
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {Object.entries(expenditureTable).map(([year, { expenditureZar }]) => (
                    <Tr key={year}>
                      <Td>
                        <Typography variant="body2">{year}</Typography>
                      </Td>
                      <Td>
                        <Typography variant="body2">
                          {Intl.NumberFormat('en-ZA', {
                            style: 'currency',
                            currency: 'ZAR',
                          }).format(expenditureZar)}
                        </Typography>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : null}
        </>
      )
    }

    if (key === 'startYear' || key === 'endYear') {
      return <T>{new Date(value).getFullYear()}</T>
    }

    if (key === 'carbonCredit') {
      return <T>{`${value}`}</T>
    }

    if (key === 'fileUploads') {
      return (
        <>
          <Span sx={{ my: theme => theme.spacing(1) }} />
          {value.map(({ id, name }) => (
            <Span key={name} sx={{ display: 'block' }}>
              <T
                component={Link}
                target="_blank"
                rel="noopener noreferrer"
                href={`${NCCRD_API_HTTP_ADDRESS}/download-public-file?fileId=${id}`}
              >
                {name}
              </T>
            </Span>
          ))}
        </>
      )
    }

    if (typeof value === 'object') {
      return <T>{JSON.stringify(value)}</T>
    }

    return <T>{value}</T>
  } catch (error) {
    console.error('Error rendering key:value of submission', key, value)
    return <T>{`${value}`}</T>
  }
}

export default ({ json }) => {
  return Object.keys(json).map(key => {
    return (
      <div key={key}>
        {/* TITLE */}
        <Typography variant="overline">
          <b>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
        </Typography>

        {/* VALUE */}
        <>
          {renderValue({ key, value: json[key] })}
          <Div sx={{ marginBottom: theme => theme.spacing(3) }} />
        </>
      </div>
    )
  })
}
