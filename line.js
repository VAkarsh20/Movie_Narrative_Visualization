

// // // set the dimensions and margins of the graph
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
// csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
// // csv = "movies.csv"
//
// // Parse the Data
// d3.csv(csv, function(data) {
//
//   console.log(data)
//
//   //////
//   // GENERAL //
//   //////
//
//   // List of groups = header of the csv files
//   var keys = data.columns.slice(1)
//
//   // color palette
//   var color = d3.scaleOrdinal()
//     .domain(keys)
//     .range(d3.schemeSet2);
//
//   //stack the data?
//   var stackedData = d3.stack()
//     .keys(keys)
//     (data)
//
//
//
//   //////
//   // AXIS //
//   //////
//
//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain(d3.extent(data, function(d) { return d.year; }))
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
//   //////
//   // BRUSHING AND CHART //
//   //////
//
//   // Add a clipPath: everything out of this area won't be drawn.
//   var clip = svg.append("defs").append("svg:clipPath")
//       .attr("id", "clip")
//       .append("svg:rect")
//       .attr("width", width )
//       .attr("height", height )
//       .attr("x", 0)
//       .attr("y", 0);
//
//   // Add brushing
//   var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
//       .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//       .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
//
//   // Create the scatter variable: where both the circles and the brush take place
//   var areaChart = svg.append('g')
//     .attr("clip-path", "url(#clip)")
//
//   // Area generator
//   var area = d3.area()
//     .x(function(d) { return x(d.data.year); })
//     .y0(function(d) {
//
//       console.log(d)
//
//       return y(d[0]); })
//     .y1(function(d) { return y(d[1]); })
//
//   // Show the areas
//   areaChart
//     .selectAll("mylayers")
//     .data(stackedData)
//     .enter()
//     .append("path")
//       .attr("class", function(d) { return "myArea " + d.key })
//       .style("fill", function(d) { return color(d.key); })
//       .attr("d", area)
//
//   // Add the brushing
//   areaChart
//     .append("g")
//       .attr("class", "brush")
//       .call(brush);
//
//   var idleTimeout
//   function idled() { idleTimeout = null; }
//
//   // // A function that update the chart for given boundaries
//   function updateChart() {
//
//     extent = d3.event.selection
//
//     // If no selection, back to initial coordinate. Otherwise, update X axis domain
//     if(!extent){
//       if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
//       x.domain(d3.extent(data, function(d) { return d.year; }))
//     }else{
//       x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
//       areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
//     }
//
//     // Update axis and area position
//     xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
//     areaChart
//       .selectAll("path")
//       .transition().duration(1000)
//       .attr("d", area)
//     }
//
//
//
//     ////////
//   // HIGHLIGHT GROUP //
//     ////////
//
//     // What to do when one group is hovered
//     var highlight = function(d){
//       console.log(d)
//       // reduce opacity of all groups
//       d3.selectAll(".myArea").style("opacity", .1)
//       // expect the one that is hovered
//       d3.select("."+d).style("opacity", 1)
//     }
//
//     // And when it is not hovered anymore
//     var noHighlight = function(d){
//       d3.selectAll(".myArea").style("opacity", 1)
//     }
//
//
//
//     //////////
//     // LEGEND //
//     //////////
//
//     // Add one dot in the legend for each name.
//     var size = 20
//     svg.selectAll("myrect")
//       .data(keys)
//       .enter()
//       .append("rect")
//         .attr("x", 400)
//         .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .attr("width", size)
//         .attr("height", size)
//         .style("fill", function(d){ return color(d)})
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//
//     // Add one dot in the legend for each name.
//     svg.selectAll("mylabels")
//       .data(keys)
//       .enter()
//       .append("text")
//         .attr("x", 400 + size*1.2)
//         .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .style("fill", function(d){ return color(d)})
//         .text(function(d){ return d})
//         .attr("text-anchor", "left")
//         .style("alignment-baseline", "middle")
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//
// })







// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
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
// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {
//
//   // group the data: I want to draw one line per group
//
//   console.log(data)
//
//   var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
//     .key(function(d) { return d.name;})
//     .entries(data);
//
//   // Add X axis --> it is a date format
//   var x = d3.scaleLinear()
//     .domain(d3.extent(data, function(d) { return d.year; }))
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).ticks(5));
//
//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, d3.max(data, function(d) { return +d.n; })])
//     .range([ height, 0 ]);
//   svg.append("g")
//     .call(d3.axisLeft(y));
//
//   // color palette
//   var res = sumstat.map(function(d){ return d.key }) // list of group names
//   var color = d3.scaleOrdinal()
//     .domain(res)
//     .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
//
//   console.log(sumstat)
//
//   // Draw the line
//   svg.selectAll(".line")
//       .data(sumstat)
//       .enter()
//       .append("path")
//         .attr("fill", "none")
//         .attr("stroke", function(d){ return color(d.key) })
//         .attr("stroke-width", 1.5)
//         .attr("d", function(d){
//           return d3.line()
//             .x(function(d) { return x(d.year); })
//             .y(function(d) { return y(+d.n); })
//             (d.values)
//         })
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





//
// // // set the dimensions and margins of the graph
var margin = 100,
  width = 660,
  height = 400;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + 2 * 100)
    .attr("height", height + 2 * 100)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");

const DATA = d3.csv("movies.csv");
// csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
csv = "movies.csv"

// Parse the Data
// DATA.then(function(data) {
d3.csv(csv, function(data) {

  var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];

  var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
  var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();
  var years = d3.map(data, function(d){ return d.Year; }).keys().sort();

  var data = dataCleaner(data)

  console.log(d3.map(data, function(d){ return d.Movie_ID; }))


  var data = studioParentYearGross(data);

  console.log(data)

  var nes = d3.nest()
    .key(function(d) { d.Studio_Parent})
    .entries(data)



  // Add X axis
  var x = d3.scaleLinear()
    .domain(Math.min(...years), Math.max(...years))
    .range([0, width]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))

  // Add Y axis
  var y = d3.scaleLog()
    .domain([100000000, d3.sum(boxOfficeList)])
    .range([ height, 0 ])
    .base(2);

  // const ticks = ["1,000,000,000", "10,000,000,000", "100,000,000,000", "200,000,000,000", "200,000,000,000", "290,000,000,000"]
  const ticks = [1000000000, 10000000000, 100000000000, 200000000000, 200000000000, 290000000000]


  svg.append("g")
    .call(d3.axisLeft(y).tickValues(ticks))

  var color = d3.scaleOrdinal()
    .domain(labels)
    .range(d3.schemeSet2);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return }))


  function dataCleaner(data) {

    for (var i = 0; i < data.length; i++) {

      data[i]["Studio_Parent"] = studioParent(data[i]["US_Distributor"]);
    }

    return data;
  }

  // Grouping was determined by the following: https://en.wikipedia.org/wiki/Major_film_studios
  function studioParent(distributor) {

    var disney = ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
    var universal = ["Universal Pictures", "Focus Features", "Gramercy Pictures (I)", "USA Films", "FilmDistrict"]
    var viacom = ["Paramount Pictures", "Miramax"]
    var warner = ["Warner Bros.", "New Line Cinema"]
    var sony = ["Sony Pictures Releasing", "TriStar Pictures", "Screen Gems", "Columbia Pictures", "Sony Pictures Classics", "FUNimation Entertainment"]
    var miniMajor = ["DreamWorks", "DreamWorks Distribution", "Lionsgate", "Summit Entertainment", "Artisan Entertainment", "Metro-Goldwyn-Mayer (MGM)", "Orion Pictures", "United Artists", "United Artists Releasing", "STX Entertainment"]

    var groups = [disney, universal, viacom, warner, sony, miniMajor];

    for (var i = 0; i < groups.length; i++) {

      if (groups[i].includes(distributor)) { return labels[i]; }
    }

    return labels[labels.length - 1];
  }

  function studioParentYearGross(data) {

    for (var i = 0; i < data.length; i++) {

      data[i]["Studio_Parent"] = studioParent(data[i]["US_Distributor"]);
    }

    var yearGrouping = {}
    for (var i = 0; i < data.length; i++) {

      movie = data[i];
      if (!(movie.Year in yearGrouping)) {

        var yearDict = {};
        for (var j = 0; j < labels.length; j++) {

          if (movie.Studio_Parent == labels[j]) { yearDict[labels[j]] = parseInt(movie.Lifetime_Gross); }
          else { yearDict[labels[j]] = 0; }

          yearGrouping[movie.Year] = yearDict;
        }
      } else { yearGrouping[movie.Year][movie.Studio_Parent] += parseInt(movie.Lifetime_Gross); }
    }

    var beforeStartYear = new Array(labels.length).fill(0);

    var data;
    var rowLength;
    var i = 0;

    for (i; i < years.length; i++) {

      yearDict = yearGrouping[years[i]];
      if (years[i] == "1977") {

        var rowLength = years.length - (i++);
        var data = new Array(rowLength);
        data[0] = { "Year" : "1977"};

        for (var j = 0; j < labels.length; j++) { data[0][labels[j]] = beforeStartYear[j] + yearDict[labels[j]]; }
        break;
      } else {
        for (var j = 0; j < labels.length; j++) { beforeStartYear[j] += yearDict[labels[j]]; }
      }
    }

    var row = 0;

    for (i; i < years.length; i++) {

      yearDict = yearGrouping[years[i]]
      pastYear = data[row];
      thisYear = new Array(labels.length).fill(0);

      data[++row] = { "Year" : years[i]};
      for (var j = 0; j < labels.length; j++) { data[row][labels[j]] = yearDict[labels[j]] + pastYear[labels[j]]; }
    }

    var res = new Array(data.length * labels.length)

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < labels.length; j++) {

        res[i*j + j] = {"Year": data[i]["Year"], "Studio_Parent": labels[j], "Lifetime_Gross_To_Date": data[i][labels[j]]}
      }
    }

    console.log(res)


  }

});
