
// Overall Structure, dragging, and force simulation taken from the following links
// https://www.d3-graph-gallery.com/graph/circularpacking_template.html

var circlePackingDiv = document.querySelector("#chart");

// Dimensions
var margin = {top: 50, right: 60, bottom: 160, left: 150},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var svg = d3.select(circlePackingDiv)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");




const DATA = d3.csv("movies.csv");
DATA.then(function(data) {

  // Data Filtering
  var data = dataCleaner(data)
  var boxOfficeList = d3.map(data, function(d){ return d.TotalLifetimeGross; }).keys();

  // Radius
  var r = d3.scaleLinear()
    .domain([Math.min(...boxOfficeList), Math.max(...boxOfficeList)])
    .range([7,55])

  // Color coding the values based on Number of films in the data
  var labels = ["6+", "5", "4", "3", "2", "1"]
  var color = d3.scaleOrdinal()
    .domain(labels)
    .range(d3.schemeSet2);


  // Simulation
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("charge", d3.forceManyBody().strength(.1))
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (r(d.TotalLifetimeGross)+3) }).iterations(1))


  // Tooltip code was inspired from the following links
  // https://www.d3-graph-gallery.com/graph/circularpacking_template.html
  // https://www.linkedin.com/learning/d3-js-essential-training-for-data-scientists/making-your-graphic-responsive?u=43607124
  var tooltip = d3.select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Creating Circles
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


  // Legend Code was inspired by the following link
  // https://www.d3-graph-gallery.com/graph/custom_legend.html
  // Creating Colors
  var size = 20
  svg.selectAll("dots")
    .data(labels)
    .enter()
    .append("rect")
      .attr("x", width * 0.85)
      .attr("y", function(d,i){ return height / 8 + i*(size+5)})
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d){ return color(d)})

  // Creating Text
  svg.selectAll("labels")
    .data(labels)
    .enter()
    .append("text")
      .attr("x", width * 0.85 + size*1.2)
      .attr("y", function(d,i){ return height / 8 + i*(size+5) + (size/2)})
      .style("fill", "black")
      .text(function(d){ return (d + " Films"); })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

  // Helper Function to Clean Data
  function dataCleaner(data) {

    var disney =  ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
    var data = data.filter(function(d){return (d.US_Distributor == disney[0]) || (d.US_Distributor == disney[1]) || (d.US_Distributor == disney[2]) || (d.US_Distributor == disney[3])})


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

  // Color Coder Function
  function colorCoder(point){

    films = point.length;
    return (films >= 6) ? "6+" : films.toString();
  };

  // Tooltip helper function
  function tooltipFunction(d, action) {

    switch (action) {
      case "over":
        tooltip.style("opacity", 1);
        return;
      case "move":

        movies = ""

        for (var i = 0; i < d.Films.length; i++) {

          if (i != (d.Films.length - 1)) { movies += d.Films[i] + ", "; }
          else { movies += d.Films[i]; }
        }

        tooltip.html('<u>' + d.Director + '</u>' + "<br>" + "Disney Films: " + movies)
          .style('top', (d3.event.pageY + 10) + 'px')
          .style('left', (d3.event.pageX + 10) + 'px');
        return;
      default:
        tooltip.style("opacity", 0);
    }
  }

  // Dragging Function
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
