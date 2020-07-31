var circlePackingDiv = document.querySelector("#chart");

// var width = barChartDiv.clientWidth;
// var height = 700;

var height = 460;
var width = 760;
var margin = 50;



var svg = d3.select(circlePackingDiv)
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");


const DATA = d3.csv("movies.csv");


DATA.then(function(data) {

  var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();

  var data = dataCleaner(data)

  var boxOfficeList = d3.map(data, function(d){ return d.TotalLifetimeGross; }).keys();

  var r = d3.scaleLinear()
    .domain([Math.min(...boxOfficeList), Math.max(...boxOfficeList)])
    .range([7,55])

  var color = d3.scaleOrdinal()
    .domain(["6+", "5", "4", "3", "2", "1"])
    .range(d3.schemeTableau10);

  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (r(d.TotalLifetimeGross)+3) }).iterations(1)) // Force that avoids circle overlapping


  var tooltip = d3.select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return r(d.TotalLifetimeGross); })
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(colorCoder(d.Films)); } )
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", function (d) { tooltipFunction(d, "over"); } )
      .on("mousemove", function (d) { tooltipFunction(d, "move"); } )
      .on("mouseleave", function (d) { tooltipFunction(d, "leave"); } )
      .call(d3.drag()
           .on("start", function (d) {dragFunction(d, "start")} )
           .on("drag", function (d) {dragFunction(d, "current")})
           .on("end", function (d) {dragFunction(d, "end")}));

  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  function dataCleaner(data) {

    var directors = d3.map();
    for (var i = 0; i < data.length; i++) {

      movie = data[i]
      gross = movie.Lifetime_Gross;
      movieName = movie.Movie_Name;

      if (directors.has(movie.Director) == false){

        directors.set(movie.Director, {TotalLifetimeGross: gross, BestRank: movie.Rank, Films: [movieName]})
      } else {

        director = directors.get(movie.Director)
        director.TotalLifetimeGross = d3.sum([director.TotalLifetimeGross, gross])
        director.Films.push(movieName);
      }
    }

    var data = [];
    for (var i = 0; i < directors.keys().length; i++) {

      key = directors.keys()[i]
      value = directors.get(key)
      data.push({Director: key, TotalLifetimeGross: value.TotalLifetimeGross, BestRank: value.BestRank, Films: value.Films})
    }

    return data;
  }

  function colorCoder(point){

    films = point.length;
    return (films >= 6) ? "6+" : films.toString();
  };

  function tooltipFunction(d, action) {

    switch (action) {
      case "over":
        tooltip.style("opacity", 1);
        return;
      case "move":
      tooltip.html('<u>' + d.Director + '</u>' + "<br>" + d.Films + " Films")
        .style("left", (d3.mouse(this)[0]+20) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
        return;
      default:
        tooltip.style("opacity", 0);
    }
  }

  function dragFunction(d, action) {

    switch (action) {
      case "start":
        if (!d3.event.active) { simulation.alphaTarget(.03).restart(); }
        d.fx = d.x;
        d.fy = d.y;
        return;
      case "end":
        if (!d3.event.active) { simulation.alphaTarget(.03); }
        d.fx = null;
        d.fy = null;
        return;
      default:
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
  }
});
// .catch( function(d) { console.log("Error")});
