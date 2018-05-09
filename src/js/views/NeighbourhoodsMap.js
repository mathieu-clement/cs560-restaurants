 const
   $ = window.jQuery = window.jquery = window.$ = jQuery;

 let $lineChartLink

 function NeighbourhoodsMap(model) {

   const $container = $('#zz-healthmap-map')

   window.filters = [];
   window.filtersById = {};

   function showLineChart(businessId) {

      model.setBusinessId(businessId)
      $container.toggleClass('showgraph', true)

     /*newwindow = window.open("health-score-over-time.html?businessId=" + businessId,
       "h" + businessId, 'height=420,width=520');
     if (window.focus) {
       newwindow.focus();
     }
     return false;*/
   }

   function arrayJoin(parts, sep) {
     var separator = sep || ', ';
     var replace = new RegExp(separator + '{1,}', 'g');
     return parts.join(separator).replace(replace, separator);
   }

   function onlyUnique(value, index, self) {
     return self.indexOf(value) === index;
   }

   function findAllUniqueValues(dataset, fieldAccessor, flat, arrayAccessor) {
     // If flat, must unwrap all values from fieldAccessor
     // as it returned an array
     var values = [];
     var arrays = dataset
       .map(function(el) {
         return fieldAccessor(el);
       });
     if (flat) {
       for (var i in arrays) {
         var arr = arrays[i];
         for (var j in arr) {
           var val = arr[j];
           values.push(arrayAccessor(val));
         }
       }
     }
     else {
       values = arrays;
     }
     values = values.filter(onlyUnique);
     values.sort();
     return values;
   }

   function fillValues(selectId, values) {
     var select = $(selectId);

     select.append('<option value="any">Any</option>');

     for (var i in values) {
       var value = values[i];
       if (typeof value == "undefined") continue;
       select.append('<option value="' + value + '">' +
         value + '</option>');
     }
   }

   function andFilters(filters) {
     return function(d) {
       for (var i in filters) {
         var filter = filters[i];
         if (!filter(d)) {
           return false;
         }
       }
       return true;
     };
   }

   function resetMarkers(dataset, filters) {
     window.markerClusterer.clearMarkers();
     var markers = getMarkers(dataset, andFilters(filters));
     window.markerClusterer.addMarkers(markers);
     $('#num-results').html("" + markers.length + " matches.");
   }


   function addFilter(selectId, dataset, fieldAccessor, flat, arrayAccessor, comparator) {
     var flat = flat || false;
     var comparator = comparator || function(filterVal, datasetVal) {
       return filterVal == datasetVal;
     };
     var values = findAllUniqueValues(Object.values(dataset),
       fieldAccessor,
       flat,
       arrayAccessor);
     fillValues(selectId, values);

     if (flat) {
       // includes
       $(selectId).change(function() {
         var newVal = $(selectId).val();
         console.log("New value for " + selectId, newVal);
         var id = filters.indexOf(filtersById[selectId]);
         if (id !== -1) filters.splice(id, 1);

         var filter2 = function(el) {
           var arr = fieldAccessor(el);
           for (var i in arr) {
             var val = arrayAccessor(arr[i]);
             if (comparator(newVal, val)) return true;
           }
           return false;
         };
         if (newVal != "any") {
           filters.push(filter2);
         }
         filtersById[selectId] = filter2;
         resetMarkers(dataset, filters);
       });
     }
     else {
       // equals
       $(selectId).change(function() {
         var newVal = $(selectId).val();
         console.log("New value for " + selectId, newVal);
         var id = filters.indexOf(filtersById[selectId]);
         if (id !== -1) filters.splice(id, 1);
         var filter2 = function(el) {
           return comparator(newVal, fieldAccessor(el));
         };
         if (newVal != "any") {
           filters.push(filter2);
         }
         filtersById[selectId] = filter2;
         resetMarkers(dataset, filters);
       });
     }
   }

   var lessThan71 = "images/pinpoint-red.png";
   var lessThan86 = "images/pinpoint-orange.png";
   var lessThan90 = "images/pinpoint-cream.png";
   var lessThan98 = "images/pinpoint-lightgreen.png";
   var moreThan98 = "images/pinpoint-darkgreen.png";

   class RestaurantIcon extends google.maps.MarkerImage {

     constructor(score) {
       super();
       this.score = score;
       this.labelOrigin = new google.maps.Point(score == 100 ? 15 : 16, 16);
       this.url = this.getIconUrl(score);
     }

     getIconUrl(score) {
       if (score < 71) return lessThan71;
       if (score < 86) return lessThan86;
       if (score < 90) return lessThan90;
       if (score < 98) return lessThan98;
       return moreThan98;
     }

   }


   function getIcon(score) {
     return new RestaurantIcon(score);
   }


   function getMarkers(dataset, filter) {
     var markers = [];
     var filter = filter || function(el) {
       return true;
     };

     $.each(dataset, function(business_id, data) {
       if (!filter(data)) return;
       var contentString =
         '<div id="content">' +
         '<h2 id="firstHeading">' + data.name + '</h2>' +
         '<div id="bodyContent">' +
         '<p>' + arrayJoin(data.location.display_address) + '</p>' +
         '<p>' + arrayJoin(data.categories.map(c => c.title)) + '</p>' +
         '<p>Rating: ' + data.rating + ' (' + data.review_count + ' review' + (data.review_count > 1 ? 's' : '') + ' on <a href="' + data.url + '">Yelp</a>) </p>' +
         '<h3>Inspections ' + (data.inspections.length > 1 ? '<span class="lineChartLink" data-businessId="' + business_id + '">(graph)</span>' : '') + '</h3>' +
         '<div id="inspectionContent"' +
         '<ul>';
       $.each(data.inspections, function(i, inspection) {

         contentString +=
           '<li>Score of <span id="score">' +
           inspection.score + '</span> on ' + inspection.date +
           (inspection.violations.length > 0 ? ':' : '') +
           '<ul>';

         $.each(inspection.violations, function(j, violation) {
           var riskClass = "low-risk-violation";
           if (violation.risk == "High Risk")
             riskClass = "high-risk-violation";
           else if (violation.risk == "Moderate Risk")
             riskClass = "moderate-risk-violation";

           contentString += '<li class="' + riskClass + '">' +
             violation.description + '</li>';
         });

         contentString +=
           '</ul>' +
           '</li>';
       });
       contentString +=
         '</ul>' +
         '</div>' +
         '</div>' +
         '</div>';

       var infowindow = new google.maps.InfoWindow({
         content: contentString
       });

       var latLng = new google.maps.LatLng(
         data.coordinates.latitude,
         data.coordinates.longitude);

       var marker = new google.maps.Marker({
         position: latLng,
         map: map,
         title: data.name,
         icon: getIcon(data.inspections[0].score),
         label: '' + data.inspections[0].score
       });
       marker.addListener('click', function() {
         lastOpenedInfoWindow.close();

         // Toggle visibility if same marker is clicked
         if (infowindow == lastOpenedInfoWindow) {
           lastOpenedInfoWindow = new google.maps.InfoWindow();
           return;
         }

         lastOpenedInfoWindow = infowindow;

         lastOpenedInfoWindow.addListener('domready', () => {

           $lineChartLink = $('.lineChartLink')
           console.log('$lineChartLink : ', $lineChartLink)

           $lineChartLink.on('click', function(e) {
             showLineChart($(e.currentTarget).data().businessid)
             console.log('lineChartLink')
             console.log('lineChartLink.data : ', $(e.currentTarget).data().businessid)
           })
         })

         infowindow.open(map, marker);
       });
       markers.push(marker);
     });

     return markers;
   }

   function initMap() {

     console.log('initMap')

     var sanfrancisco = {
       lat: 37.773972,
       lng: -122.431297
     };
     var map = new google.maps.Map(document.getElementById('zz-healthmap-map-map'), {
       zoom: 12,
       center: sanfrancisco,
       styles: [{
         featureType: "poi",
         elementType: "labels",
         stylers: [{
           visibility: "off"
         }]
       }]
     });
     window.map = map;

     var lastOpenedInfoWindow = new google.maps.InfoWindow();
     window.lastOpenedInfoWindow = lastOpenedInfoWindow;

     $.getJSON("data/combined.json", function(dataset) {
       console.log(dataset[31]);
       window.dataset = dataset;

       $().ready(function() {
         addFilter('#price-range', dataset, function(el) {
           return el['price'];
         });
         addFilter('#cuisine', dataset,
           function(el) {
             return el['categories'];
           },
           true,
           function(item) {
             return item['title'];
           });
         addFilter('#min-score', dataset, function(el) {
           return el['inspections'][0]['score'];
         }, false, null, function(filterVal, datasetVal) {
           return datasetVal >= parseInt(filterVal);
         });
         addFilter('#max-score', dataset, function(el) {
           return el['inspections'][0]['score'];
         }, false, null, function(filterVal, datasetVal) {
           return datasetVal <= parseInt(filterVal);
         });
         addFilter('#min-rating', dataset, function(el) {
           return el.rating;
         }, false, null, function(filterVal, datasetVal) {
           return datasetVal >= parseFloat(filterVal);
         });
         addFilter('#max-rating', dataset, function(el) {
           return el.rating;
         }, false, null, function(filterVal, datasetVal) {
           return datasetVal <= parseFloat(filterVal);
         });
         $('#loading').remove();
       });

       var markers = getMarkers(dataset);

       var markerClusterer = new MarkerClusterer(map, markers, {
         imagePath: './images/m',
         maxZoom: 17
       });
       window.markerClusterer = markerClusterer;
     });
   }

   $().ready(function() {
     initMap();
   });
 }

 export default NeighbourhoodsMap