import { useContext, memo } from 'react'
import { context as formContext } from '../context'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import PreviousIcon from 'mdi-react/ChevronLeftIcon'
import NextIcon from 'mdi-react/ChevronRightIcon'
import { useTheme } from '@mui/material/styles'

const sections = [
  'generalDetailsFormValidation',
  'mitigationFormsValidation',
  'adaptationFormsValidation',
  'submit',
]

const Buttons = memo(
  ({
    setActiveIndex,
    currentIndex,
    adaptationFormsValidation,
    mitigationFormsValidation,
    generalDetailsFormValidation,
    interventionType,
  }) => {
    const theme = useTheme()
    let hasPrevious
    let previousFn
    let hasNext
    let nextFn

    const section = sections[currentIndex]

    if (section === 'submit') {
      hasNext = false
      hasPrevious = true
      nextFn = undefined
      if (adaptationFormsValidation) {
        previousFn = () => setActiveIndex(2)
      } else if (mitigationFormsValidation) {
        previousFn = () => setActiveIndex(1)
      } else {
        previousFn = () => setActiveIndex(0)
      }
    } else if (section === 'adaptationFormsValidation') {
      previousFn = () => setActiveIndex(0)
      hasPrevious = true
      if (adaptationFormsValidation) {
        hasNext = true
        nextFn = () => setActiveIndex(currentIndex + 1)
      }
    } else if (section === 'mitigationFormsValidation') {
      previousFn = () => setActiveIndex(0)
      hasPrevious = true
      if (mitigationFormsValidation) {
        hasNext = true
        nextFn = () => setActiveIndex(currentIndex + 2)
      }
    } else {
      if (generalDetailsFormValidation) {
        hasPrevious = false
        if (interventionType === 'Mitigation') {
          hasNext = true
          nextFn = () => setActiveIndex(currentIndex + 1)
        } else if (interventionType === 'Adaptation') {
          hasNext = true
          nextFn = () => setActiveIndex(currentIndex + 2)
        } else if (interventionType === 'Cross Cutting') {
          hasNext = true
          nextFn = () => setActiveIndex(currentIndex + 3)
        }
      }
    }

    return (
      <Grid container>
        <Grid item container xs={12}>
          <Button
            color="inherit"
            onClick={previousFn}
            disabled={!hasPrevious}
            style={{ minWidth: 152, margin: theme.spacing(1), marginLeft: 'auto' }}
            startIcon={<PreviousIcon size={18} />}
            disableElevation
            variant="contained"
          >
            Previous section
          </Button>
          <Button
            style={{ minWidth: 152, margin: theme.spacing(1), marginRight: 0 }}
            color="inherit"
            onClick={nextFn}
            endIcon={<NextIcon size={18} />}
            disableElevation
            variant="contained"
            disabled={!hasNext}
          >
            Next section
          </Button>
        </Grid>
      </Grid>
    )
  },
  (a, b) => {
    if (a.currentIndex !== b.currentIndex) return false
    if (a.interventionType !== b.interventionType) return false
    if (a.generalDetailsFormValidation !== b.generalDetailsFormValidation) return false
    if (a.mitigationFormsValidation !== b.mitigationFormsValidation) return false
    if (a.adaptationFormsValidation !== b.adaptationFormsValidation) return false
    return true
  }
)

export default ({ currentIndex, setActiveIndex }) => {
  const {
    generalDetailsFormValidation,
    mitigationFormsValidation,
    adaptationFormsValidation,
    generalDetailsForm,
  } = useContext(formContext)
  const { interventionType } = generalDetailsForm

  return (
    <Buttons
      currentIndex={currentIndex}
      setActiveIndex={setActiveIndex}
      interventionType={interventionType?.term}
      generalDetailsFormValidation={generalDetailsFormValidation.isComplete}
      mitigationFormsValidation={mitigationFormsValidation.isComplete}
      adaptationFormsValidation={adaptationFormsValidation.isComplete}
    />
  )
}
