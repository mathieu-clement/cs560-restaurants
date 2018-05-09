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

  var width = 800;
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
        label: "American (Traditional) | American (New)",
        tit: "american",
        color: "blue"
      },
      {
        label: "Cantonese | Chinese | Dim Sum | Shanghainese | Taiwanese | Szechuan",
        tit: "chinese",
        color: "red"
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
    ]

  let
    circles


  function drawGraph() {


    var titleLabels = d3.selectAll("title")
      .data(dataset)
      .selectAll("text");

    var xScale = d3.scaleLinear()
      .range([0, innerWidth])
      .domain([d3.min(dataset, function(d) {
        return d.score;
      }), d3.max(dataset, function(d) {
        return d.score;
      })]);


    var yScale = d3.scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(dataset, function(d) {
        return d.rate;
      })]);


    var graphSVG = d3.select("#zz-nations-graph").append("svg")
      .attr("width", width)
      .attr("height", height)

    graphSVG.append("text")
      .attr("transform",
        "translate(" + (700) + " ," +
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

    var g = graphSVG.append('g')
      .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
      .attr('width', innerWidth)
      .attr('height', innerHeight)

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .tickPadding(15);

    var yAxis = d3.axisLeft()
      .scale(yScale)
      .tickPadding(15);

    var xAxisG = g.append('g')
      .attr("transform", "translate(0," + innerHeight + ")");

    var yAxisG = g.append('g');

    var nationColor = d3.scaleOrdinal()
      .domain(dataset.map(nation => nation.title))
      .range(dataset.map(nation => nation.color))

    circles = g.selectAll('circle')
      .data(dataset)
      .enter().append('svg:circle')
      .attr('cx', function(d) {
        return xScale(d.score);
      })
      .attr('cy', function(d) {
        return yScale(d.rate);
      })
      .attr('r', 3)

    xAxisG.attr("class", "axis").call(xAxis);
    yAxisG.attr("class", "axis").call(yAxis);
  }

  function updateGraph() {

    circles
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
      .attr("width", width)
      .attr("height", height / 2)

    var ppmKeyCircle = keySVG.selectAll(".key-circle")
      .data([...nations, {
        label: "Show All",
        tit: undefined,
        color: 'white'
      }])
      .enter().append("g")
      .attr('transform', "translate(" + margin.left + ",0)")
      .attr("class", "key-circle")

    ppmKeyCircle
      .append("svg:circle")
      .attr("class", "key-circle-color")
      .attr("r", (d, i) => "10")
      .attr("fill", d => d.color)
      .attr('stroke', '#130C0E').attr('stroke-width', 1)
      .attr("transform", (d, i) => {
        if(d.label === 'Show All'){
          return `translate(${30 * i + 30},12)`
        }
        else{
          return `translate(${30 * i + 10},12)`
        }
      })


    ppmKeyCircle.on('click', (d, i) => {
      filterNation(d.tit)
    });

    ppmKeyCircle
      .append("text")
      .attr("transform", (d, i) => {
        if(d.label === 'Show All'){
          return `translate(${30 * i + 25}, 35) rotate(20)`
        }
        else{
          return `translate(${30 * i + 5}, 35) rotate(20)`
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
            color = "blue";
          }
          if (title == "Cantonese" || title == "Chinese" || title == "Dim Sum" || title == "Shanghainese" || title == "Taiwanese" || title == "Szechuan") {
            tit = "chinese";
            color = "red";
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

      //End for loop

      console.log(dataset);

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