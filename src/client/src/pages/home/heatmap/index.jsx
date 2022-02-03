import { useContext, useEffect, useState, useMemo } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import { context as layoutContext } from '../../../contexts/layout'
import MapProvider, { context as mapContext } from '../../../components/ol-react'
import baseLayer from '../../../components/ol-react/layers/terrestris-base-map'
import { context as dataContext } from '../context'
import heatMap from '../../../components/visualizations/heat-map'
import Fade from '@mui/material/Fade'
import { parse } from 'wkt'
import { Div } from '../../../components/html-tags'
import ScrollButton_ from '../../../components/fancy-buttons/scroll-button'
import debounce from '../../../lib/debounce'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import { alpha, useTheme } from '@mui/material/styles'

const fadeLayer = ({ layer, start = 0, end = 1 }) => {
  if (start >= end) return
  const newOpacity = layer.get('opacity') + 0.05
  layer.set('opacity', newOpacity)
  setTimeout(() => fadeLayer({ layer, start: newOpacity, end }), 15)
}

const ScrollButton = ({ contentRef }) => {
  const [pageScrolled, setPageScrolled] = useState(false)

  const onScroll = debounce(() => {
    const _pageScrolled = window.scrollY > 0
    if (pageScrolled != _pageScrolled) {
      setPageScrolled(_pageScrolled)
    }
  })

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <Fade timeout={500} key="scroll-button" in={!pageScrolled}>
      <ScrollButton_
        onClick={() =>
          window.scrollTo({ top: contentRef.current.offsetTop, left: 0, behavior: 'smooth' })
        }
        sx={{ bottom: 96, position: 'relative', zIndex: 101 }}
      />
    </Fade>
  )
}

const HeatMap = ({ zoom }) => {
  const [interventionType, setInterventionType] = useState(null)
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    region: { geometry },
  } = useContext(clientContext)

  useEffect(() => {
    let layer
    if (data) {
      layer = heatMap({
        data,
        opacity: 0,
        zoom,
        gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
        filter: ({ intervention }) => {
          if (interventionType === null) {
            return true
          } else {
            return intervention === interventionType
          }
        },
      })
      map.addLayer(layer)
      fadeLayer({ layer })
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [data, geometry, interventionType, map, zoom])

  return (
    <Hidden smDown>
      <Div
        sx={{
          zIndex: 999,
          position: 'absolute',
          top: 0,
          right: 0,
          mr: theme => theme.spacing(1),
          mt: theme => theme.spacing(1),
        }}
      >
        <Button
          sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
          variant="contained"
          color={interventionType === null ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType(null)}
        >
          All
        </Button>
        <Button
          sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
          variant="contained"
          color={interventionType === 'Adaptation' ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType('Adaptation')}
        >
          Adaptation
        </Button>
        <Button
          sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
          variant="contained"
          color={interventionType === 'Mitigation' ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType('Mitigation')}
        >
          Mitigation
        </Button>
        <Button
          onClick={() => setInterventionType('Cross cutting')}
          variant="contained"
          color={interventionType === 'Cross cutting' ? 'primary' : 'inherit'}
          size="small"
        >
          Cross cutting
        </Button>
      </Div>
    </Hidden>
  )
}

export default ({ children, contentRef, toolbarRef }) => {
  const { headerRef } = useContext(layoutContext)
  const {
    region: { centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))

  const [x, y] = parse(centroid).coordinates
  const zoom = isDefaultTenant ? 6.5 : 7.5

  const offsetHeight = useMemo(
    () => (headerRef?.offsetHeight || 0) + (toolbarRef?.offsetHeight || 0),
    [headerRef, toolbarRef]
  )

  return (
    <Div sx={{ height: `calc(100vh - ${offsetHeight}px)`, width: '100%', position: 'relative' }}>
      {children}
      <Fade timeout={2000} key="map" in={true}>
        <Div
          sx={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 99,
            opacity: 1,
            backgroundColor: theme => alpha(theme.palette.common.black, 0.2),
            backgroundImage: theme =>
              `linear-gradient(${alpha(
                theme.palette.primary.main,
                0.05
              )} 0.7000000000000001px, transparent 0.7000000000000001px)`,
            backgroundSize: '10px 10px',
          }}
        />
      </Fade>

      <MapProvider
        view={{
          zoom,
          center: [x, y],
        }}
        interactions={[]}
        controls={[]}
        layers={[baseLayer()]}
      >
        <HeatMap zoom={zoom} />
        <ScrollButton contentRef={contentRef} />
        <Typography
          variant="caption"
          sx={{
            fontStyle: 'italic',
            color: theme => alpha(theme.palette.common.white, 0.9),
            position: 'absolute',
            right: 0,
            [smDown ? 'top' : 'bottom']: 0,
            mr: theme => theme.spacing(1),
            mb: theme => theme.spacing(0.5),
          }}
        >
          Project location distribution (excluding national projects)
        </Typography>
      </MapProvider>
    </Div>
  )
}
