function Model() {

  let nation

  const state = {

    setNation(newNation) {
      nation = newNation
    },

    getNation() {
      return nation
    }
  }

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

  var model = Model()

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
           color: "#b2df8a"
         },
         {
           label: "Indian",
           tit: "indian",
           color: "#33a02c"
         },
         {
           label: "Italian",
           tit: "italian",
           color: "#fb9a99"
         },
         {
           label: "Japanese",
           tit: "japanese",
           color: "#e31a1c"
         },
         {
           label: "Korean",
           tit: "korean",
           color: "#fdbf6f"
         },
         {
           label: "Latin American | Mexican",
           tit: "latin",
           color: "#ff7f00"
         },
         {
           label: "Vietnamese",
           tit: "viet",
           color: "#cab2d6"
         },
         {
           label: "Thai",
           tit: "thai",
           color: "#6a3d9a"
         },
         {
           label: "Mediterranean",
           tit: "medi",
           color: "#ffff99"
         }
       ];

  let
    graphGroup,
    reducedDataNations,
    reducedDataAll,
    xScale,
    yScale


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
      .attr("height", height)

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
      .attr('height', innerHeight)

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
      .range(dataset.map(nation => nation.color))

    xAxisG.attr("class", "axis").call(xAxis);
    yAxisG.attr("class", "axis").call(yAxis);
  }

  function updateGraph() {

    graphGroup.selectAll('circle').remove()

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
        let selectedNation = model.getNation()
        if (selectedNation && selectedNation !== d.title) {
          return "0"
        }
        else {
          return "1"
        }
      })
      .attr("fill", function(d) {
        return d.color
      })
  }

  function drawKey() {

    var keySVG = d3.select("#zz-nations-key").append("svg")
      .attr("width", 200)
      .attr("height", height)

    var keyCircle = keySVG.selectAll(".key-circle")
      .data([...nations, {
        label: "Show All",
        tit: undefined,
        color: '#CCC'
      }])
      .enter().append("g")
      .attr('transform', "translate(0," + margin.top + ")")
      .attr("class", "key-circle")

    keyCircle
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
      })


    keyCircle.on('click', (d, i) => {
      filterNation(d.tit)
    });

    keyCircle
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
      .text(d => `${d.label}`)
  }

  function filterNation(nation) {
    model.setNation(nation)
    updateGraph()
  }

  d3.json("data/combined.json").then(function(data) {

      // console.log(data);
      for (var key in data) {
        var bool = 0;
        var id = data[key].id;
        // console.log(id);
        var rating = data[key].rating;
        var score = data[key].inspections[0].score;
        var neighborhood = data[key].neighborhood;
        var price = data[key].price;
        var zip = data[key].search.zip_code;
        var tit, color
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
               color = "#b2df8a";
             }
             if (title == "Indian") {
               tit = "indian";
               color = "#33a02c";
             }
             if (title == "Italian") {
               tit = "italian";
               color = "#fb9a99";
             }
             if (title == "Japanese") {
               tit = "japanese";
               color = "#e31a1c";
             }
             if (title == "Korean") {
               tit = "korean";
               color = "#fdbf6f";
             }
             if (title == "Latin American" || title == "Mexican") {
               tit = "latin";
               color = "#ff7f00";
             }
             if (title == "Vietnamese") {
               tit = "viet";
               color = "#cab2d6";
             }
             if (title == "Thai") {
               tit = "thai";
               color = "#6a3d9a";
             }
             if (title == "Mediterranean") {
               tit = "medi";
               color = "#ffff99";
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
          })

        }

        return r

      }, [])

      console.log('reducedDataNations : ', reducedDataNations)


      reducedDataAll = reducedDataNations.reduce((r, i) => {

        let existingMatch = r.find(e => e.rate === i.rate && e.score === i.score)

        if (existingMatch) {
          existingMatch.count += 1;
          existingMatch.title = existingMatch.title === i.title ? e.title : 'mixed';
        }
        else {
          r.push({
            ...i,
            count: 1,
            color: "#CCC"
          })
        }

        return r;

      }, [])

      console.log('reducedDataAll : ', reducedDataAll)

      //End for loop

      console.log('dataset : ', dataset);

      drawGraph()
      updateGraph()

      drawKey()

      // data.forEach(function(d) {
      //     console.log(d);
      //     // dataset.push({data.inspections[0].score});
      // });
    })
    .catch(function(error) {
      console.log('nations combined error : ', error)
    })
}

export default Nations
