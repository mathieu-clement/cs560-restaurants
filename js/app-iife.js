(function () {
   'use strict';

   const
      $$1 = window.jQuery = window.jquery = window.$ = jQuery;

    let $lineChartLink;

    function NeighbourhoodsMap(model) {

      const $container = $$1('#zz-healthmap-map');

      window.filters = [];
      window.filtersById = {};

      function showLineChart(businessId) {

         model.setBusinessId(businessId);
         $container.toggleClass('showgraph', true);

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
        var select = $$1(selectId);

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
        $$1('#num-results').html("" + markers.length + " matches.");
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
          $$1(selectId).change(function() {
            var newVal = $$1(selectId).val();
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
          $$1(selectId).change(function() {
            var newVal = $$1(selectId).val();
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

        $$1.each(dataset, function(business_id, data) {
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
          $$1.each(data.inspections, function(i, inspection) {

            contentString +=
              '<li>Score of <span id="score">' +
              inspection.score + '</span> on ' + inspection.date +
              (inspection.violations.length > 0 ? ':' : '') +
              '<ul>';

            $$1.each(inspection.violations, function(j, violation) {
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

              $lineChartLink = $$1('.lineChartLink');
              console.log('$lineChartLink : ', $lineChartLink);

              $lineChartLink.on('click', function(e) {
                showLineChart($$1(e.currentTarget).data().businessid);
                console.log('lineChartLink');
                console.log('lineChartLink.data : ', $$1(e.currentTarget).data().businessid);
              });
            });

            infowindow.open(map, marker);
          });
          markers.push(marker);
        });

        return markers;
      }

      function initMap() {

        console.log('initMap');

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

        $$1.getJSON("data/combined.json", function(dataset) {
          console.log(dataset[31]);
          window.dataset = dataset;

          $$1().ready(function() {
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
            $$1('#loading').remove();
          });

          var markers = getMarkers(dataset);

          var markerClusterer = new MarkerClusterer(map, markers, {
            imagePath: './images/m',
            maxZoom: 17
          });
          window.markerClusterer = markerClusterer;
        });
      }

      $$1().ready(function() {
        initMap();
      });
    }

   const
     d3$1 = window.d3,
     $$2 = window.jQuery = window.jquery = window.$ = jQuery;

   function NeighbourhoodsGraph() {

     const w = 500;
     const h = 380;

     var sanfrancisco = [-122.45, 37.78];

     var projection = d3$1.geoMercator()
       .center(sanfrancisco)
       .translate([w / 2, h / 2])
       .scale([160000]);

     var path = d3$1.geoPath()
       .projection(projection);

     var formatDecimals = d3$1.format(".3");

     var svg = d3$1
       .select("#zz-neighbourhoods-graph")
       .append("svg")
       .attr("width", w + 100)
       .attr("height", h + 100);

     var g = svg.append("g")
       .style("opacity", 0.0);

     var rect = g.append("rect")
       .attr("x", 20)
       .attr("y", 10)
       .attr("width", 300)
       .attr("height", 30)
       .attr("fill", "white")
       .attr("stroke", "black");

     var nhoodText = g.append("text")
       .attr("class", "neighborhood-name")
       .attr("x", 30)
       .attr("y", 30);

     // Our custom scale for scores, according to the SF Health Department
     var lessThan71 = "rgb(215,25,28)"; // red
     var lessThan86 = "rgb(253,174,97)"; // orange
     var lessThan90 = "rgb(255,255,191)"; // pale yellow/cream
     var moreThan90 = "rgb(166,217,106)"; // light green

     var colorScale = function(score) {
       if (score < 71) return lessThan71;
       if (score < 86) return lessThan86;
       if (score < 90) return lessThan90;
       return moreThan90;
     };

     d3$1.json("data/neighborhoods.json").then(function(json) {
       d3$1.json("data/neighborhood_average_scores.json").then(function(data) {
         for (var i in json.features) {
           var feature = json.features[i];
           var nhood = feature.properties['nhood'];
           feature.properties.average = data[nhood];
         }

         const duration = 400;

         svg
           .selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("fill", d => colorScale(d.properties.average))
           .on("mouseover", function(d) {
             g.transition().duration(duration).style("opacity", 1.0);
             nhoodText.text(d.properties.nhood);
             // nhoodText.text(d.properties.nhood + " (" + formatDecimals(d.properties.average) + ")");
             d3$1.select(this)
               .transition()
               .duration(duration)
               .attr("fill", "pink");
           })
           .on("mouseout", function(d) {
             g.transition().duration(duration).style("opacity", 0.0);
             d3$1.select(this)
               .transition()
               .duration(duration)
               .attr("fill", colorScale(d.properties.average));
           });

         svg
           .selectAll(".label")
           .data(json.features)
           .enter()
           .append("text")
           .attr("class", "label")
           .attr("x", function(d) {
             return path.centroid(d)[0];
           })
           .attr("y", function(d) {
             return path.centroid(d)[1];
           })
           .text(function(d) {
             return formatDecimals(d.properties.average);
           });

       }); // d3.json avg scores
     }); // d3.json neighborhoods geoson

   }

   function HealthScore(model) {

     const $container = $('#zz-healthmap-map');
     const $closeButton = $('#zz-healthmap-graph-close');

     const w = 400;
     const h = 400;

     let
       businessId = 56,
       dataset,
       graphContainer;

     var svg = d3
       .select("#zz-healthmap-graph")
       .append("svg")
       .attr("width", w + 100)
       .attr("height", h + 100);

     //var businessId = getParameterByName('businessId') || "31";

     $.getJSON("data/combined.json", function(data) {
       dataset = data;
       drawGraph();
     });

     function drawGraph() {

       console.log('drawGraph businessId : ', businessId);

       if (graphContainer) {
         graphContainer.remove();
       }

       if (!businessId) {
         return
       }

       var restaurant = dataset[businessId];
       var name = restaurant.name;
       var inspections = restaurant.inspections;
       console.log(inspections);
       var timeParser = d3.timeParse("%Y-%m-%d");
       for (var i in inspections) {
         var inspection = inspections[i];
         inspection.date = timeParser(inspection.date);
       }

       var dates = inspections.map(insp => insp.date);

       graphContainer = svg.append("g")
         .attr("class", '.graph-container')
         .attr("transform", "translate(" + 80 + "," + 50 + ")"); // margins

       graphContainer.append("text")
         .attr("x", w / 2)
         .attr("y", -30)
         .attr("dy", ".35em")
         .attr("font-size", 18)
         .attr("font-weight", "bold")
         .attr("fill", "black")
         .style("text-anchor", "middle")
         .text(restaurant.name);
       // window.document.title = restaurant.name;

       const xScale = d3.scaleTime()
         .domain(d3.extent(dates))
         .range([0, w]);

       const yScale = d3.scaleLinear()
         .domain([40, 100])
         .range([h, 0]);

       const monthFormat = d3.timeFormat("%b");
       const yearFormat = d3.timeFormat("%Y");
       const usFormat = d3.timeFormat("%-m/%-d/%y");
       const xAxis = d3.axisBottom(xScale)
         .ticks(d3.timeMonth, 2)
         .tickFormat(function(d) {
           //return monthFormat(d);
           if (d.getMonth() == 0)
             return yearFormat(d);
           else
             return monthFormat(d);
         });
       const yAxis = d3.axisLeft(yScale);

       // X axis path+ticks
       graphContainer.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0, " + h + ")")
         .call(xAxis);

       // X axis legend
       graphContainer.append("g")
         .append("text")
         .attr("class", "label")
         .attr("x", w)
         .attr("y", h + 40)
         .attr("font-size", 12)
         .attr("font-style", "italic")
         .style("text-anchor", "end")
         .text("Inspection date");

       // Y axis path+ticks
       graphContainer.append("g")
         .attr("class", "y axis")
         .call(yAxis);

       // Y axis label
       graphContainer.append("g")
         .append("text")
         .attr("class", "label")
         .attr("x", 0)
         .attr("y", -50)
         .attr("transform", "rotate(-90)")
         .attr("font-size", 12)
         .attr("font-style", "italic")
         .style("text-anchor", "end")
         .text("Inspection score");

       // Lines
       var line = d3.line()
         .x(d => xScale(d.date))
         .y(d => yScale(d.score));

       graphContainer.append("g")
         .append("path")
         .datum(inspections)
         .attr("fill", "none")
         .attr("stroke", "orange")
         .attr("stroke-width", 2)
         .attr("d", line);

       // Data points
       graphContainer.append("g")
         .selectAll(".dot")
         .data(inspections)
         .enter()
         .append("circle")
         .attr("r", 3)
         .attr("cx", d => xScale(d.date))
         .attr("cy", d => yScale(d.score));

       var g = graphContainer.append("g")
         .selectAll("text")
         .data(inspections)
         .enter()
         .append("g");

       g.append("rect")
         .attr("x", d => xScale(d.date) - 15)
         .attr("y", d => yScale(d.score) - 15)
         .attr("width", 30)
         .attr("height", 30)
         .attr("opacity", 0)
         .on("mouseover", function(d) {
           d3.selectAll(".label")
             .filter(e => d == e)
             .transition()
             .attr("opacity", 1);
         })
         .on("mouseout", function(d) {
           d3.selectAll(".label")
             .filter(e => d == e)
             .transition()
             .attr("opacity", 0);
         });

       g.append("text")
         .attr("class", "label")
         .attr("x", d => xScale(d.date))
         .attr("y", d => yScale(d.score) - 10)
         .attr("dy", ".35em")
         .attr("font-size", 12)
         .attr("font-weight", "bold")
         .attr("fill", "black")
         .attr("opacity", 0)
         .style("text-anchor", "middle")
         .text(d => "" + d.score);

       g.append("text")
         .attr("class", "label")
         .attr("x", d => xScale(d.date))
         .attr("y", d => yScale(d.score) - 25)
         .attr("dy", ".35em")
         .attr("font-size", 10)
         .attr("font-weight", "normal")
         .attr("fill", "black")
         .attr("opacity", 0)
         .style("text-anchor", "middle")
         .text(d => usFormat(d.date));

     }

     model.registerHandler((bId) => {
       businessId = bId;
       drawGraph();
     });

     $closeButton.on('click', function() {
       close();
       businessId = undefined;
       drawGraph();
     });

     function close() {
       $container.toggleClass('showgraph', false);
     }
   }

   function Model() {

     let nation;

     const state = {

       setNation(newNation) {
         nation = newNation;
       },

       getNation() {
         return nation
       }
     };

     return state
   }

   function Nations() {

     var width = 650;
     var height = 500;
     var margin = {
       left: 40,
       right: 40,
       top: 40,
       bottom: 80
     };
     var innerWidth = width - margin.left - margin.right;
     var innerHeight = height - margin.top - margin.bottom;

     var model = Model();

     //later
     //   var colorMap = {"american": ,"chinese":};

     const
       dataset = [],
       nations = [{
           label: "American",
           tit: "american",
           color: "#a6cee3"
         },
         {
           label: "Chinese",
           tit: "chinese",
           color: "#1f78b4"
         },
         {
           label: "French",
           tit: "french",
           color: "grey"
         },
         {
           label: "Indian",
           tit: "indian",
           color: "yellow"
         },
         {
           label: "Italian",
           tit: "italian",
           color: "green"
         },
         {
           label: "Japanese",
           tit: "japanese",
           color: "steelblue"
         },
         {
           label: "Korean",
           tit: "korean",
           color: "black"
         },
         {
           label: "Latin American | Mexican",
           tit: "latin",
           color: "purple"
         },
         {
           label: "Vietnamese",
           tit: "viet",
           color: "crimson"
         },
         {
           label: "Thai",
           tit: "thai",
           color: "darkgreen"
         },
         {
           label: "Mediterranean",
           tit: "medi",
           color: "brown"
         }
       ];

     let
       graphGroup,
       reducedDataNations,
       reducedDataAll,
       xScale,
       yScale;


     function drawGraph() {


       var titleLabels = d3.selectAll("title")
         .data(dataset)
         .selectAll("text");

       xScale = d3.scaleLinear()
         .range([0, innerWidth])
         .domain([d3.min(dataset, function(d) {
           return d.score;
         }), d3.max(dataset, function(d) {
           return d.score;
         })]);


       yScale = d3.scaleLinear()
         .range([innerHeight, 0])
         .domain([0, d3.max(dataset, function(d) {
           return d.rate;
         })]);


       var graphSVG = d3.select("#zz-nations-graph").append("svg")
         .attr("width", width)
         .attr("height", height);

       graphSVG.append("text")
         .attr("transform",
           "translate(" + (500) + " ," +
           (400) + ")")
         .style("text-anchor", "middle")
         .style("font-size", "13px")
         .text("inspection score");
       // text label for the y axis
       graphSVG.append("text")
         .attr("transform",
           "translate(" + (60) + " ," +
           (20) + ")")
         .attr("dy", "1em")
         .style("font-size", "13px")
         .style("text-anchor", "middle")
         .text("rating");
       graphSVG.append("text")
         .attr("x", (width / 2) - 100)
         .attr("y", 30 - (margin.top / 2))
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .style("text-decoration", "underline")
         .text("rating vs inspection score for different restaurants categories");

       graphGroup = graphSVG.append('g')
         .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
         .attr('width', innerWidth)
         .attr('height', innerHeight);

       var xAxis = d3.axisBottom()
         .scale(xScale)
         .tickPadding(15);

       var yAxis = d3.axisLeft()
         .scale(yScale)
         .tickPadding(15);

       var xAxisG = graphGroup.append('g')
         .attr("transform", "translate(0," + innerHeight + ")");

       var yAxisG = graphGroup.append('g');

       var nationColor = d3.scaleOrdinal()
         .domain(dataset.map(nation => nation.title))
         .range(dataset.map(nation => nation.color));

       xAxisG.attr("class", "axis").call(xAxis);
       yAxisG.attr("class", "axis").call(yAxis);
     }

     function updateGraph() {

       graphGroup.selectAll('circle').remove();

       graphGroup.selectAll('circle')
         .data(model.getNation() ? reducedDataNations : reducedDataAll)
         .enter().append('svg:circle')
         .attr('cx', function(d) {
           return xScale(d.score);
         })
         .attr('cy', function(d) {
           return yScale(d.rate);
         })
         .attr('r', function(d) {
           return 3 + (0.2 * d.count)
         })
         .attr("fill-opacity", d => {
           let selectedNation = model.getNation();
           if (selectedNation && selectedNation !== d.title) {
             return "0"
           }
           else {
             return "1"
           }
         })
         .attr("fill", function(d) {
           return d.color
         });
     }

     function drawKey() {

       var keySVG = d3.select("#zz-nations-key").append("svg")
         .attr("width", 200)
         .attr("height", height);

       var KeyCircle = keySVG.selectAll(".key-circle")
         .data([...nations, {
           label: "Show All",
           tit: undefined,
           color: '#CCC'
         }])
         .enter().append("g")
         .attr('transform', "translate(0," + margin.top + ")")
         .attr("class", "key-circle");

       KeyCircle
         .append("svg:circle")
         .attr("class", "key-circle-color")
         .attr("r", (d, i) => "10")
         .attr("fill", d => d.color)
         .attr('stroke', '#130C0E').attr('stroke-width', 1)
         .attr("transform", (d, i) => {
           if (d.label === 'Show All') {
             return `translate(12, ${30 * i + 30})`
           }
           else {
             return `translate(12, ${30 * i + 10})`
           }
         });


       KeyCircle.on('click', (d, i) => {
         filterNation(d.tit);
       });

       KeyCircle
         .append("text")
         .attr("transform", (d, i) => {
           if (d.label === 'Show All') {
             return `translate(25, ${30 * i + 32})`
           }
           else {
             return `translate(25, ${30 * i + 12})`
           }
         })
         .attr("width", (d, i) => 200)
         .attr("class", "ppm-key-block-label")
         .attr("text-anchor", "left")
         .text(d => `${d.label}`);
     }

     function filterNation(nation) {
       model.setNation(nation);
       updateGraph();
     }

     d3.json("data/combined.json").then(function(data) {

         // console.log(data);
         for (var key in data) {
           var id = data[key].id;
           // console.log(id);
           var rating = data[key].rating;
           var score = data[key].inspections[0].score;
           var neighborhood = data[key].neighborhood;
           var price = data[key].price;
           var zip = data[key].search.zip_code;
           var tit, color;
           // var data[key].categories[0].title);
           for (var i in data[key].categories) {
             var title = data[key].categories[i].title;
             if (title == "American (Traditional)" || title == "American (New)") {
               tit = "american";
               color = "#a6cee3";
             }
             if (title == "Cantonese" || title == "Chinese" || title == "Dim Sum" || title == "Shanghainese" || title == "Taiwanese" || title == "Szechuan") {
               tit = "chinese";
               color = "#1f78b4";
             }
             if (title == "French") {
               tit = "french";
               color = "grey";
             }
             if (title == "Indian") {
               tit = "indian";
               color = "yellow";
             }
             if (title == "Italian") {
               tit = "italian";
               color = "green";
             }
             if (title == "Japanese") {
               tit = "japanese";
               color = "steelblue";
             }
             if (title == "Korean") {
               tit = "korean";
               color = "black";
             }
             if (title == "Latin American" || title == "Mexican") {
               tit = "latin";
               color = "purple";
             }
             if (title == "Vietnamese") {
               tit = "viet";
               color = "crimson";
             }
             if (title == "Thai") {
               tit = "thai";
               color = "darkgreen";
             }
             if (title == "Mediterranean") {
               tit = "medi";
               color = "brown";
             }
           }

           dataset.push({
             id: id,
             rate: parseFloat(rating),
             score: parseFloat(score),
             title: tit,
             color: color,
             neighborhood: neighborhood,
             price: price,
             zip: zip
           });
         }


         reducedDataNations = dataset.reduce((r, i) => {

           let existingMatch = r.find(e => e.rate === i.rate && e.score === i.score && e.title === i.title);

           if (existingMatch) {
             existingMatch.count += 1;
           }
           else {

             r.push({
               ...i,
               count: 1
             });

           }

           return r

         }, []);

         console.log('reducedDataNations : ', reducedDataNations);


         reducedDataAll = reducedDataNations.reduce((r, i) => {

           let existingMatch = r.find(e => e.rate === i.rate && e.score === i.score);

           if (existingMatch) {
             existingMatch.count += 1;
             existingMatch.title = existingMatch.title === i.title ? e.title : 'mixed';
           }
           else {
             r.push({
               ...i,
               count: 1,
               color: "#CCC"
             });
           }

           return r;

         }, []);

         console.log('reducedDataAll : ', reducedDataAll);

         //End for loop

         console.log('dataset : ', dataset);

         drawGraph();
         updateGraph();

         drawKey();

         // data.forEach(function(d) {
         //     console.log(d);
         //     // dataset.push({data.inspections[0].score});
         // });
       })
       .catch(function(error) {
         console.log('nations combined error : ', error);
       });
   }

   function MapModel() {

     const handlers = [];
     let businessId;

     function notify() {
       handlers.forEach(h => h(businessId));
     }

     return {

       setBusinessId(id) {
         businessId = id;
         notify();
       },

       getBusinessId() {
         return businessId
       },

       registerHandler(handler) {
         handlers.push(handler);
       }
     }
   }


   const
     d3$2 = window.d3,
     $$3 = window.jQuery = window.jquery = window.$ = jQuery,

     mapModel = MapModel();

   $$3(document).ready(() => {

     console.log('document ready');

     NeighbourhoodsMap(mapModel);
     HealthScore(mapModel);
     
     NeighbourhoodsGraph();
     
     Nations();

   });

}());
