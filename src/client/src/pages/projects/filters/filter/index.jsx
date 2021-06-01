import { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import FilterHeader from './_header'
import useTheme from '@material-ui/core/styles/useTheme'

const KEY_TO_HUMAN = {
  projectStatus: { name: 'Project status', helperText: 'Project status' },
  interventionType: { name: 'Intervention type', helperText: 'Intervention type' },
  interventionStatus: { name: 'Intervention status', helperText: 'Intervention status' },
  validationStatus: { name: 'Validation status', helperText: 'Validation status' },
  fundingStatus: { name: 'Funding status', helperText: 'Funding status' },
  estimatedBudget: { name: 'Estimated budget', helperText: 'Estimated budget' },
  hostSector: { name: 'Host sector', helperText: 'Host sector' },
  hostSubSector: { name: 'Host sub-sector', helperText: 'Host sub-sector' },
  province: { name: 'Province', helperText: 'Province' },
  districtMunicipality: { name: 'District municipality', helperText: 'District municipality' },
  localMunicipality: { name: 'Local municipality', helperText: 'Local municipality' },

  // Mitigation
  mitigationType: { name: 'Mitigation type', helperText: 'Mitigation type' },
  mitigationSubType: { name: 'Mitigation sub-type', helperText: 'Mitigation sub-type' },
  cdmMethodology: { name: 'CDM methodology', helperText: 'CDM methodology' },
  cdmExecutiveStatus: { name: 'CDM executive status', helperText: 'CDM executive status' },
  hostSubSectorPrimary: {
    name: 'Host sub-sector (primary)',
    helperText: 'Host sub-sector (primary)',
  },
  hostSubSectorSecondary: {
    name: 'Host sub-sector (secondary)',
    helperText: 'Host sub-sector (secondary)',
  },

  // Adaptation
  adaptationSector: { name: 'Adaptation sector', helperText: 'Adaptation sector' },
  adaptationPurpose: { name: 'Adaptation purpose', helperText: 'Adaptation purpose' },
  hazardFamily: { name: 'Hazard family', helperText: 'Hazard family' },
  hazardSubFamily: { name: 'Hazard sub-family', helperText: 'Hazard sub-family' },
  hazard: { name: 'Hazard', helperText: 'Hazard' },
  subHazard: { name: 'Sub-hazard', helperText: 'Sub-hazard' },
}

export default ({ type, title }) => {
  const [collapsed, setCollapsed] = useState(true)
  const theme = useTheme()

  const inputs = Object.entries(type)

  return (
    <div>
      <FilterHeader title={title} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Collapse
        style={{ width: '100%' }}
        key={`result-list-collapse-${title}`}
        unmountOnExit
        in={!collapsed}
      >
        <Paper style={{ backgroundColor: theme.backgroundColor }}>
          <Box px={3} py={2}>
            {inputs.length ? (
              inputs.map(([field, values]) => {
                return (
                  <TextField
                    key={field}
                    id={`project-filter-${field}`}
                    select
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label={KEY_TO_HUMAN[field].name}
                    helperText={KEY_TO_HUMAN[field].helperText}
                  >
                    {values.map(value => (
                      <MenuItem key={value}>
                        <Typography variant="overline">{value}</Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                )
              })
            ) : (
              <Typography variant="overline">(No filters available)</Typography>
            )}
          </Box>
        </Paper>
      </Collapse>
    </div>
  )
}
