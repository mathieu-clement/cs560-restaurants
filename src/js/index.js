import NeighbourhoodsMap from './views/NeighbourhoodsMap';
import NeighbourhoodsGraph from './views/NeighbourhoodsGraph';
import HealthScore from './views/HealthScore'
import Nations from './views/Nations'


function MapModel() {

  const handlers = []
  let businessId

  function notify() {
    handlers.forEach(h => h(businessId))
  }

  return {

    setBusinessId(id) {
      businessId = id
      notify()
    },

    getBusinessId() {
      return businessId
    },

    registerHandler(handler) {
      handlers.push(handler)
    }
  }
}


const
  d3 = window.d3,
  $ = window.jQuery = window.jquery = window.$ = jQuery,

  mapModel = MapModel();

$(document).ready(() => {

  console.log('document ready')

  NeighbourhoodsMap(mapModel);
  HealthScore(mapModel);
  
  NeighbourhoodsGraph();
  
  Nations();

})