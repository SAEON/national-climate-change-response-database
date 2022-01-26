import Map from '../../../../../components/ol-react'
import Stamen from 'ol/source/Stamen'
import baseLayer from '../../../../../components/ol-react/layers/terrestris-base-map'
import { Div } from '../../../../../components/html-tags'
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer'

const fallback = new TileLayer({
  source: new Stamen({
    layer: 'toner',
  }),
})

export default () => {
  return (
    <Div sx={{ height: 'calc(100vh - 220px)' }}>
      <Map baseLayer={[fallback, baseLayer()]} />
    </Div>
  )
}
