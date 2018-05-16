function HealthScore(model) {

  const $container = $('#zz-healthmap-map')
  const $closeButton = $('#zz-healthmap-graph-close')

  const w = 400;
  const h = 400;

  let
    businessId = 56,
    dataset,
    graphContainer

  var svg = d3
    .select("#zz-healthmap-graph")
    .append("svg")
    .attr("width", w + 100)
    .attr("height", h + 100)

  //var businessId = getParameterByName('businessId') || "31";

  $.getJSON("data/combined.json", function(data) {
    dataset = data
    drawGraph();
  });

  function drawGraph() {

    console.log('drawGraph businessId : ', businessId)

    if (graphContainer) {
      graphContainer.remove()
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
    businessId = bId
    drawGraph()
  })

  $closeButton.on('click', function() {
    close()
    businessId = undefined
    drawGraph()
  })

  function close() {
    $container.toggleClass('showgraph', false)
  }
}

export default HealthScore