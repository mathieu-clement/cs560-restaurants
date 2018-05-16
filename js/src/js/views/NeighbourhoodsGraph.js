const
  d3 = window.d3,
  $ = window.jQuery = window.jquery = window.$ = jQuery;

function NeighbourhoodsGraph() {

  const w = 500;
  const h = 380;

  var sanfrancisco = [-122.45, 37.78];

  var projection = d3.geoMercator()
    .center(sanfrancisco)
    .translate([w / 2, h / 2])
    .scale([160000]);

  var path = d3.geoPath()
    .projection(projection);

  var formatDecimals = d3.format(".3");

  var svg = d3
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

  d3.json("data/neighborhoods.json").then(function(json) {
    d3.json("data/neighborhood_average_scores.json").then(function(data) {
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
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("fill", "pink");
        })
        .on("mouseout", function(d) {
          g.transition().duration(duration).style("opacity", 0.0);
          d3.select(this)
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

export default NeighbourhoodsGraph