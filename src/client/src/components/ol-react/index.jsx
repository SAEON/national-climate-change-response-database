import { createContext, useRef, useEffect, useMemo } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import LayerGroup from 'ol/layer/Group'
import { defaults as defaultControls } from 'ol/control'
import osm from './layers/osm'
export { default as GeometryLayer } from './_geometry-layer'
import MousePosition from 'ol/control/MousePosition'
import { createStringXY } from 'ol/coordinate'

export const context = createContext()

export default ({ children = [], baseLayer = [osm()] }) => {
  const mapDomRef = useRef(null)

  const mousePositionControl = useMemo(
    () =>
      new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'map-mouse-position',
        undefinedHTML: '&nbsp;',
      }),
    []
  )

  const map = useMemo(() => {
    return new Map({
      layers: new LayerGroup({
        layers: [...baseLayer],
      }),
      controls: defaultControls({
        zoom: false,
        rotateOptions: false,
        rotate: false,
        attribution: false,
      }).extend([mousePositionControl]),
      view: new View({
        center: [23, -29],
        zoom: 5.5,
        projection: 'EPSG:4326',
      }),
    })
  }, [mousePositionControl])

  useEffect(() => {
    map.setTarget(mapDomRef.current)

    return () => {
      map.dispose()
    }
  }, [map])

  return (
    <context.Provider value={{ map }}>
      <>
        <div ref={mapDomRef} style={{ width: '100%', height: '100%' }} />
        {children}
      </>
    </context.Provider>
  )
}
