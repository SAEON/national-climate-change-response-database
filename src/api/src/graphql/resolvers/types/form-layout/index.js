import { generalDetails, mitigationDetails, adaptationDetails } from './layout-config.js'

export default {
  generalDetails: async () => generalDetails,
  mitigationDetails: async () => mitigationDetails,
  adaptationDetails: () => adaptationDetails,
}
