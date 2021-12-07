import { useContext, memo } from 'react'
import { context as formContext } from '../../context'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import PreviousIcon from 'mdi-react/ChevronLeftIcon'
import NextIcon from 'mdi-react/ChevronRightIcon'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'

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

    const scrollFn = fn => () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      fn()
    }

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
        <Grid item container xs={12} justifyContent="flex-end">
          <Toolbar
            variant="dense"
            disableGutters
            style={{ backgroundColor: theme.palette.grey[100], flex: 1 }}
          >
            <Button
              style={{ marginLeft: theme.spacing(1) }}
              onClick={scrollFn(previousFn)}
              disabled={!hasPrevious}
              startIcon={<PreviousIcon size={18} />}
              disableElevation
              variant="text"
              size="small"
            >
              Previous section
            </Button>
            <div style={{ marginLeft: 'auto' }} />
            <Button
              style={{ marginRight: theme.spacing(1) }}
              size="small"
              onClick={scrollFn(nextFn)}
              endIcon={<NextIcon size={18} />}
              disableElevation
              variant="text"
              disabled={!hasNext}
            >
              Next section
            </Button>
          </Toolbar>
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
