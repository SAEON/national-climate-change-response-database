import { createContext, useRef, useLayoutEffect, useMemo } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import LayerGroup from 'ol/layer/Group'
import { defaults as defaultControls } from 'ol/control'
import baseLayer from './layers/terrestris-base-map'
export { default as GeometryLayer } from './_geometry-layer'

export const context = createContext()

export default ({ children }) => {
  const mapDomRef = useRef(null)

  const map = useMemo(() => {
    return new Map({
      layers: new LayerGroup({
        layers: [baseLayer()],
      }),
      controls: defaultControls({
        zoom: false,
        rotateOptions: false,
        rotate: false,
        attribution: false,
      }).extend([]),
      view: new View({
        center: [23, -29],
        zoom: 5.5,
        projection: 'EPSG:4326',
      }),
    })
  }, [])

  useLayoutEffect(() => {
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
