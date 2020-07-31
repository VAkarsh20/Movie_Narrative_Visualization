

// // set the dimensions and margins of the graph
// var margin = {top: 60, right: 230, bottom: 50, left: 50},
//   width = 660 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
// var svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// // csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
// csv = "movies.csv"
//
// // Parse the Data
// d3.csv(csv, function(data) {
//
//
//   ////////
//   // GENERAL //
//   ////////
//
//   // List of groups = header of the csv files
//   // var keys = data.columns.slice(1)
//   //
//   // // color palette
//   // var color = d3.scaleOrdinal()
//   //   .domain(keys)
//   //   .range(d3.schemeSet2);
//   //
//   // //stack the data?
//   // var stackedData = d3.stack()
//   //   .keys(keys)
//   //   (data)
//
//
//
//   ////////
//   // AXIS //
//   ////////
//
//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain(d3.extent(data, function(d) { return d.Year; }))
//     .range([0, width]);
//   var xAxis = svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).ticks(5))
//
//   // Add X axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width)
//       .attr("y", height+40 )
//       .text("Time (year)");
//
//   // Add Y axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", 0)
//       .attr("y", -20 )
//       .text("# of baby born")
//       .attr("text-anchor", "start")
//
//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 200000])
//     .range([ height, 0 ]);
//   svg.append("g")
//     .call(d3.axisLeft(y).ticks(5))
//
//
//
//   // //////
//   // // BRUSHING AND CHART //
//   // //////
//   //
//   // // Add a clipPath: everything out of this area won't be drawn.
//   // var clip = svg.append("defs").append("svg:clipPath")
//   //     .attr("id", "clip")
//   //     .append("svg:rect")
//   //     .attr("width", width )
//   //     .attr("height", height )
//   //     .attr("x", 0)
//   //     .attr("y", 0);
//   //
//   // // Add brushing
//   // var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
//   //     .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//   //     .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
//   //
//   // // Create the scatter variable: where both the circles and the brush take place
//   // var areaChart = svg.append('g')
//   //   .attr("clip-path", "url(#clip)")
//   //
//   // // Area generator
//   // var area = d3.area()
//   //   .x(function(d) { return x(d.data.year); })
//   //   .y0(function(d) { return y(d[0]); })
//   //   .y1(function(d) { return y(d[1]); })
//   //
//   // // Show the areas
//   // areaChart
//   //   .selectAll("mylayers")
//   //   .data(stackedData)
//   //   .enter()
//   //   .append("path")
//   //     .attr("class", function(d) { return "myArea " + d.key })
//   //     .style("fill", function(d) { return color(d.key); })
//   //     .attr("d", area)
//   //
//   // // Add the brushing
//   // areaChart
//   //   .append("g")
//   //     .attr("class", "brush")
//   //     .call(brush);
//   //
//   // var idleTimeout
//   // function idled() { idleTimeout = null; }
//
//   // A function that update the chart for given boundaries
//   // function updateChart() {
//   //
//   //   extent = d3.event.selection
//   //
//   //   // If no selection, back to initial coordinate. Otherwise, update X axis domain
//   //   if(!extent){
//   //     if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
//   //     x.domain(d3.extent(data, function(d) { return d.year; }))
//   //   }else{
//   //     x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
//   //     areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
//   //   }
//   //
//   //   // Update axis and area position
//   //   xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
//   //   areaChart
//   //     .selectAll("path")
//   //     .transition().duration(1000)
//   //     .attr("d", area)
//   //   }
//
//
//
//     //////////
//     // HIGHLIGHT GROUP //
//     //////////
//
//     // What to do when one group is hovered
//     // var highlight = function(d){
//     //   console.log(d)
//     //   // reduce opacity of all groups
//     //   d3.selectAll(".myArea").style("opacity", .1)
//     //   // expect the one that is hovered
//     //   d3.select("."+d).style("opacity", 1)
//     // }
//     //
//     // // And when it is not hovered anymore
//     // var noHighlight = function(d){
//     //   d3.selectAll(".myArea").style("opacity", 1)
//     // }
//     //
//     //
//     //
//     // //////////
//     // // LEGEND //
//     // //////////
//     //
//     // // Add one dot in the legend for each name.
//     // var size = 20
//     // svg.selectAll("myrect")
//     //   .data(keys)
//     //   .enter()
//     //   .append("rect")
//     //     .attr("x", 400)
//     //     .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//     //     .attr("width", size)
//     //     .attr("height", size)
//     //     .style("fill", function(d){ return color(d)})
//     //     .on("mouseover", highlight)
//     //     .on("mouseleave", noHighlight)
//     //
//     // // Add one dot in the legend for each name.
//     // svg.selectAll("mylabels")
//     //   .data(keys)
//     //   .enter()
//     //   .append("text")
//     //     .attr("x", 400 + size*1.2)
//     //     .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//     //     .style("fill", function(d){ return color(d)})
//     //     .text(function(d){ return d})
//     //     .attr("text-anchor", "left")
//     //     .style("alignment-baseline", "middle")
//     //     .on("mouseover", highlight)
//     //     .on("mouseleave", noHighlight)
//
// })


// Major:
//
// Walt Disney Studios: Walt Disney Studios Motion Pictures, Twentieth Century Fox, Fox Searchlight Pictures, UTV Motion Pictures
//
// NBCUniversal: Universal Pictures, Focus Features, Gramercy Pictures (I), USA Films, FilmDistrict
//
// ViacomCBS: Paramount Pictures, Miramax
//
// WarnerMedia: Warner Bros., New Line Cinema
//
// Sony Pictures: Sony Pictures Releasing, TriStar Pictures, Screen Gems, Columbia Pictures, Sony Pictures Classics, FUNimation Entertainment,
//
//
//
// Mini-Major:
//
// The Amblin Group: DreamWorks, DreamWorks Distribution,
//
// Lionsgate Motion Picture Group: Lionsgate, Summit Entertainment, Artisan Entertainment
//
// MGM Holdings: Metro-Goldwyn-Mayer (MGM), Orion Pictures, United Artists, United Artists Releasing
//
// STX Entertainment: STX Entertainment
//
//
//
// Other: The Weinstein Company, The H Collective, Well Go USA Entertainment, CMC Pictures, Newmarket Films, FilmRise, "", IFC Films, China Lion Film Distribution, Dimension Films,  Revolution Studios, RKO Radio Pictures, Neon, Great India Films, Relativity Media, Vestron Pictures, Magnolia Pictures, AMC Theaters, GKIDS





var lineChartDiv = document.querySelector("#chart");

// var width = barChartDiv.clientWidth;
// var height = 700;

var height = 460;
var width = 460;
var margin = 50;



var svg = d3.select(lineChartDiv)
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");


const DATA = d3.csv("movies.csv");


DATA.then(function(data) {

  var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
  var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();

  console.log(d3.sum(boxOfficeList))

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.sum(boxOfficeList)])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))




    var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width ]);


  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))





// Grouping was determined by the following: https://en.wikipedia.org/wiki/Major_film_studios
  function studioGrouping(distributor) {

    var disney = ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
    var universal = ["Universal Pictures", "Focus Features", "Gramercy Pictures (I)", "USA Films", "FilmDistrict"]
    var viacom = ["Paramount Pictures", "Miramax"]
    var warner = ["Warner Bros.", "New Line Cinema"]
    var sony = ["Sony Pictures Releasing", "TriStar Pictures", "Screen Gems", "Columbia Pictures", "Sony Pictures Classics", "FUNimation Entertainment"]
    var miniMajor = ["DreamWorks", "DreamWorks Distribution", "Lionsgate", "Summit Entertainment", "Artisan Entertainment", "Metro-Goldwyn-Mayer (MGM)", "Orion Pictures", "United Artists", "United Artists Releasing", "STX Entertainment"]

    var groups = [disney, universal, viacom, warner, sony, miniMajor];
    var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"]

    for (var i = 0; i < groups.length; i++) {

      if (groups[i].includes(distributor)) { return labels[i]; }
    }

    return labels[labels.length - 1];
  }

});






  // var data = dataCleaner(data)
  //
  // var boxOfficeList = d3.map(data, function(d){ return d.TotalLifetimeGross; }).keys();
  //
  // var r = d3.scaleLinear()
  //   .domain([Math.min(...boxOfficeList), Math.max(...boxOfficeList)])
  //   .range([7,55])
  //
  // var color = d3.scaleOrdinal()
  //   .domain(["6+", "5", "4", "3", "2", "1"])
  //   .range(d3.schemeTableau10);
  //
  // var simulation = d3.forceSimulation()
  //     .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
  //     .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
  //     .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (r(d.TotalLifetimeGross)+3) }).iterations(1)) // Force that avoids circle overlapping
  //
  //
  // var tooltip = d3.select("#chart")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("background-color", "white")
  //   .style("border", "solid")
  //   .style("border-width", "2px")
  //   .style("border-radius", "5px")
  //   .style("padding", "5px");
  //
  // var node = svg.append("g")
  //   .selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //     .attr("class", "node")
  //     .attr("r", function(d){ return r(d.TotalLifetimeGross); })
  //     .attr("cx", width / 2)
  //     .attr("cy", height / 2)
  //     .style("fill", function(d){ return color(colorCoder(d.Films)); } )
  //     .style("fill-opacity", 0.8)
  //     .attr("stroke", "black")
  //     .style("stroke-width", 1)
  //     .on("mouseover", function (d) { tooltipFunction(d, "over"); } )
  //     .on("mousemove", function (d) { tooltipFunction(d, "move"); } )
  //     .on("mouseleave", function (d) { tooltipFunction(d, "leave"); } )
  //     .call(d3.drag()
  //          .on("start", function (d) {dragFunction(d, "start")} )
  //          .on("drag", function (d) {dragFunction(d, "current")})
  //          .on("end", function (d) {dragFunction(d, "end")}));
  //
  // simulation
  //     .nodes(data)
  //     .on("tick", function(d){
  //       node
  //           .attr("cx", function(d){ return d.x; })
  //           .attr("cy", function(d){ return d.y; })
  //     });
  //
  // function dataCleaner(data) {
  //
  //   var directors = d3.map();
  //   for (var i = 0; i < data.length; i++) {
  //
  //     movie = data[i]
  //     gross = movie.Lifetime_Gross;
  //     movieName = movie.Movie_Name;
  //
  //     if (directors.has(movie.Director) == false){
  //
  //       directors.set(movie.Director, {TotalLifetimeGross: gross, BestRank: movie.Rank, Films: [movieName]})
  //     } else {
  //
  //       director = directors.get(movie.Director)
  //       director.TotalLifetimeGross = d3.sum([director.TotalLifetimeGross, gross])
  //       director.Films.push(movieName);
  //     }
  //   }
  //
  //   var data = [];
  //   for (var i = 0; i < directors.keys().length; i++) {
  //
  //     key = directors.keys()[i]
  //     value = directors.get(key)
  //     data.push({Director: key, TotalLifetimeGross: value.TotalLifetimeGross, BestRank: value.BestRank, Films: value.Films})
  //   }
  //
  //   return data;
  // }
  //
  // function colorCoder(point){
  //
  //   films = point.length;
  //   return (films >= 6) ? "6+" : films.toString();
  // };
  //
  // function tooltipFunction(d, action) {
  //
  //   switch (action) {
  //     case "over":
  //       tooltip.style("opacity", 1);
  //       return;
  //     case "move":
  //     tooltip.html('<u>' + d.Director + '</u>' + "<br>" + d.Films + " Films")
  //       .style("left", (d3.mouse(this)[0]+20) + "px")
  //       .style("top", (d3.mouse(this)[1]) + "px")
  //       return;
  //     default:
  //       tooltip.style("opacity", 0);
  //   }
  // }
  //
  // function dragFunction(d, action) {
  //
  //   switch (action) {
  //     case "start":
  //       if (!d3.event.active) { simulation.alphaTarget(.03).restart(); }
  //       d.fx = d.x;
  //       d.fy = d.y;
  //       return;
  //     case "end":
  //       if (!d3.event.active) { simulation.alphaTarget(.03); }
  //       d.fx = null;
  //       d.fy = null;
  //       return;
  //     default:
  //       d.fx = d3.event.x;
  //       d.fy = d3.event.y;
  //   }
  // }
