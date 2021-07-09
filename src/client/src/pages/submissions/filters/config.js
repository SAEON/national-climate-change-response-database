export const projectFilters = {
  title: {
    label: 'Filter by title',
    helperText: 'Returns partial and close matches',
    type: 'fulltext',
    value: '',
  },
  validationStatus: {
    label: 'Validation status',
    helperText: '(admins only)',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Validation Status',
    tree: 'projectValidationStatus',
  },
  estimatedBudget: {
    label: 'Estimated budget',
    helperText: 'Filter by budget estimation',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Estimated budget',
    tree: 'budgetRanges',
  },
  interventionType: {
    label: 'Intervention type',
    helperText: 'Filter by intervention type',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Intervention type',
    tree: 'interventionTypes',
  },
  implementationStatus: {
    label: 'Implementation status',
    helperText: 'Filter by implementation status',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Status',
    tree: 'actionStatus',
  },
  fundingType: {
    label: 'Funding type',
    helperText: 'Filter by funding type',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Funding type',
    tree: 'fundingTypes',
  },
  province: {
    label: 'Province',
    helperText: 'Filter by province',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'South Africa',
    tree: 'regions',
  },
}

export const mitigationFilters = {
  hostSector: {
    label: 'Host sector',
    helperText: 'Filter by host sector',
    type: 'controlledVocabulary',
    value: undefined,
    root: 'Mitigation sector',
    tree: 'mitigationSectors',
  },
}

export const adaptationFilters = {}
