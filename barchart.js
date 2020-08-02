// http://bl.ocks.org/AndrewStaroscik/5222370
// https://www.linkedin.com/learning/d3-js-essential-training-for-data-scientists/making-your-graphic-responsive?u=43607124
// https://www.d3-graph-gallery.com/graph/custom_legend.html
var barChartDiv = document.querySelector("#chart");
const ticks = [800000000, 900000000, 1000000000, 2000000000, 2500000000, 2800000000]

// var width = barChartDiv.clientWidth;
// var height = 700;


// var height = 600;
// var width = 1000;
// var margin = 50;

var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = 350;
var margin = 50;

// var margin = {top: 30, right: 30, bottom: 70, left: 60},
//     width = 800 - margin.left - margin.right,
//     height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(barChartDiv)
  .append("svg")
    .attr("width", width - 2 * margin)
    .attr("height", height + 2 * margin)
    // .attr("border",1)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");


const DATA = d3.csv("movies.csv");


DATA.then(function(data) {

  data =  data.filter(function(d){ return d.Lifetime_Gross >= 1000000000 })


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


  var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
  var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();

  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.Movie_Name}))
    .range([0, width])
    .padding(0.2);

  var max = d3.max(data, function(d) { return d.Lifetime_Gross; } );

  var y = d3.scaleLinear()
    .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
    .range([height,0])
    // .base(10)

  var xAxis = svg.append("g")
      .attr("transform", "translate(" + 0 + "," + (height) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");



    svg.append("g")
      //.attr("transform","translate("+margin+","+margin+")")
      // .call(d3.axisLeft(y).tickValues(ticks).tickFormat(d3.format("~s")));
      .call(d3.axisLeft(y));

var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];

// Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
  .domain(labels)
  .range(d3.schemeTableau10)



  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Movie_Name); })
      .attr("y", function(d) { return height; })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return 0; })
      .attr("fill", function (d) { return color(studioParentFinder(d.US_Distributor)); })
      .attr("opacity", 0.5);


  svg.selectAll("rect")
    .transition()
    .duration(500)
    .attr("y", function(d) { return y(d.Lifetime_Gross); })
    .attr("height", function(d) { return height - y(d.Lifetime_Gross); })
    .delay(function(d,i) { return (i*100); });

  svg.selectAll("rect")
    .on("mouseover", function(d) { this.style.opacity = 1; tooltipFunction(d, "over");})
    .on("mousemove", function(d) { tooltipFunction(d, "move");})
    .on("mouseout", function(d) { this.style.opacity = 0.5; tooltipFunction(d, "out");})


    function tooltipFunction(d, action) {

      switch (action) {
        case "over":
          tooltip.style("opacity", 1);
          return;
        case "move":

        //  Rank, Movie_Name,Director,Year,US_Distributor,Lifetime_Gross,MPAA,Running_Time

        tooltip.html('<u>' + d.Movie_Name + '</u>'
                      + "<br>" + "Box Office Rank: "+ d.Rank
                      + "<br>" + "Lifetime Gross: $"+ grossToString(d.Lifetime_Gross)
                      + "<br>" + "Release Year: "+ d.Year
                      + "<br>" + "Director: "+ d.Director
                      + "<br>" + "Studio: "+ d.US_Distributor
                      + "<br>" + "MPAA: "+ d.MPAA
                      + "<br>" + "Run Time: "+ d.Running_Time)
          // .style("left", (d3.mouse(this)[0]+20) + "px")
          // .style("top", (d3.mouse(this)[1]) + "px")
          // .style("left", ((width / 2) + "px"))
          // .style("top", ((height / 2) + "px"))
            .style('top', (d3.event.pageY + 10) + 'px')
            .style('left', (d3.event.pageX + 10) + 'px');
          return;
        default:
          tooltip.style("opacity", 0);
      }
    }

    // var legendRectSize = 18;
    // var legendSpacing = 4;
    // var legend = svg.selectAll('.legend')
    //           .data(color.domain())
    //           .enter()
    //           .append('g')
    //           .attr('class', 'legend')
    //           .attr('transform', function(d, i) {
    //             var height = legendRectSize + legendSpacing;
    //             var offset =  height * color.domain().length / 2;
    //             var horz = -2 * legendRectSize;
    //             var vert = i * height - offset;
    //             return 'translate(' + (5 * margin + horz) + ',' + vert + ')';
    //           });
    //
    //         legend.append('rect')
    //           .attr('width', legendRectSize)
    //           .attr('height', legendRectSize)
    //           .style('fill', color)
    //           .style('stroke', color);
    //
    //         legend.append('text')
    //           .attr('x', legendRectSize + legendSpacing)
    //           .attr('y', legendRectSize - legendSpacing)
    //           .text(function(d) { return d; });



    // Add one dot in the legend for each name.
  var size = 20
  svg.selectAll("dots")
    .data(labels)
    .enter()
    .append("rect")
      .attr("x", width / 2)
      .attr("y", function(d,i){ return height / 8 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  svg.selectAll("labels")
    .data(labels)
    .enter()
    .append("text")
      .attr("x", width / 2 + size*1.2)
      .attr("y", function(d,i){ return height / 8 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", "black")
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")


  function studioParentFinder(distributor) {

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

      return "Other";
  }

  function grossToString(value) {

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


});



//
// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
// var Svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// csv = "movies.csv"
// // csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
//
// const DATA = d3.csv(csv);
// DATA.then(function(data) {
// //Read the data
//
//
//   data =  data.filter(function(d){ return d.Rank <= 50 })
//
//
//   var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
//   var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();
//
//   var ranks = d3.map(data, function(d){ return d.Rank; }).keys();
//
//
//   var x = d3.scaleLinear()
//     .domain([Math.min(...ranks), Math.max(...ranks)])
//     .range([0, width]);
//
//   var y = d3.scaleLog()
//     .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
//     .range([height,0])
//     .base(10)
//
//
//
//   var xAxis = Svg.append("g")
//     .attr("transform", "translate(" + 0 + "," + (height) + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");
//
//   Svg.append("g")
//     //.attr("transform","translate("+margin+","+margin+")")
//     .call(d3.axisLeft(y));
//
// //tickValues(ticks).tickFormat(d3.format("~s")));
//
//   // Add a clipPath: everything out of this area won't be drawn.
//   var clip = Svg.append("defs").append("svg:clipPath")
//       .attr("id", "clip")
//       .append("svg:rect")
//       .attr("width", width )
//       .attr("height", height )
//       .attr("x", 0)
//       .attr("y", 0);
//
//
// var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
//
// // Color scale: give me a specie name, I return a color
// var color = d3.scaleOrdinal()
//   .domain(labels)
//   .range(d3.schemeTableau10)
//
//
// // Add brushing
// var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
//     .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//     .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
//
// // Create the scatter variable: where both the circles and the brush take place
// var barchart = Svg.append('g')
//   .attr("clip-path", "url(#clip)")
//
//
// barchart.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//       .attr("x", function(d) { return x(d.Rank); })
//       .attr("y", function(d) { return y(d.Lifetime_Gross); })
//       .attr("width", (width / data.length) - 1)
//       .attr("height", function(d) { return height - y(d.Lifetime_Gross); })
//       .attr("fill", function (d) { return color(studioParentFinder(d.US_Distributor)); });
//
// // Add the brushing
// barchart
//   .append("g")
//     .attr("class", "brush")
//     .call(brush);
//
// // A function that set idleTimeOut to null
// var idleTimeout
// function idled() { idleTimeout = null; }
//
// // A function that update the chart for given boundaries
// function updateChart() {
//
//   extent = d3.event.selection
//
//   // If no selection, back to initial coordinate. Otherwise, update X axis domain
//   if(!extent){
//     if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
//     x.domain([ 4,8])
//   }else{
//     x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
//     barchart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
//   }
//
//   // Update axis and circle position
//   xAxis.transition().duration(1000).call(d3.axisBottom(x))
//   barchart
//     .selectAll("rect")
//     .transition().duration(1000)
//     .attr("x", function(d) { return x(d.Rank); })
//     .attr("y", function(d) { return y(d.Lifetime_Gross); })
//     .attr("width", (width / data.length) - 1)
//     .attr("height", function(d) { return height - y(d.Lifetime_Gross); })
//
//   }
//
//     function studioParentFinder(distributor) {
//
//         var disney = ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
//         var universal = ["Universal Pictures", "Focus Features", "Gramercy Pictures (I)", "USA Films", "FilmDistrict"]
//         var viacom = ["Paramount Pictures", "Miramax"]
//         var warner = ["Warner Bros.", "New Line Cinema"]
//         var sony = ["Sony Pictures Releasing", "TriStar Pictures", "Screen Gems", "Columbia Pictures", "Sony Pictures Classics", "FUNimation Entertainment"]
//         var miniMajor = ["DreamWorks", "DreamWorks Distribution", "Lionsgate", "Summit Entertainment", "Artisan Entertainment", "Metro-Goldwyn-Mayer (MGM)", "Orion Pictures", "United Artists", "United Artists Releasing", "STX Entertainment"]
//
//         var groups = [disney, universal, viacom, warner, sony, miniMajor];
//
//         for (var i = 0; i < groups.length; i++) {
//
//           if (groups[i].includes(distributor)) { return labels[i]; }
//         }
//
//         return "Other";
//     }
//
//
//
// })


//
// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 10, bottom: 100, left: 40},
//     margin2 = {top: 430, right: 10, bottom: 20, left: 40},
//     width = 750 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom,
//     height2 = 500 - margin2.top - margin2.bottom;
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
// csv = "movies.csv"
// // csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
//
// const DATA = d3.csv(csv);
// DATA.then(function(data) {
// //Read the data
//
//
//   data =  data.filter(function(d){ return d.Rank <= 50 })
//
//
//   var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
//   var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();
//
//   var ranks = d3.map(data, function(d){ return d.Rank; }).keys();
//
//
//   var x = d3.scaleBand()
//     .domain(data.map(function(d) { return d.Rank}))
//     .range([0, width])
//     .padding(0.2);
//
//   var x2 = d3.scaleBand()
//     .domain(data.map(function(d) { return d.Rank}))
//     .range([0, width])
//     .padding(0.2);
//
//
//   var y = d3.scaleLinear()
//     .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
//     .range([height,0])
//
//   var y2 = d3.scaleLinear()
//     .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
//     .range([height,0])
//
//   var xAxis = svg.append("g")
//     .attr("transform", "translate(" + 0 + "," + (height) + ")")
//     .call(d3.axisBottom(x))
//
//   var xAxis2 = svg.append("g")
//     .attr("transform", "translate(" + 0 + "," + (height) + ")")
//     .call(d3.axisBottom(x).tickValues([]))
//
//   var yAxis = svg.append("g")
//     //.attr("transform","translate("+margin+","+margin+")")
//     .call(d3.axisLeft(y));
//
//   var focus = svg.append("g")
//       .attr("class", "focus")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//   var context = svg.append("g")
//       .attr("class", "context")
//       .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
//
//   // focus.append("g")
//   //     .attr("class", "x axis")
//   //     .attr("transform", "translate(0," + height + ")")
//   //     .call(xAxis);
//   //
//   // focus.append("g")
//   //     .attr("class", "y axis")
//   //     .call(yAxis);
//
//   enter(data)
//   updateScale(data)
//
//   var subBars = context.selectAll('.subBar')
//                                   	.data(data)
//
//
//   subBars.enter().append("rect")
// 		  .classed('subBar', true)
// 			.attr(
//     	{
//         height: function (d)
//         {
//           return height2 - y2(d.Lifetime_Gross);
//         },
//         width: function(d){ return x.rangeBand()},
//         x: function(d) {
//
//           return x2(d.Rank);
//         },
//         y: function(d)
//         {
//           return y2(d.Lifetime_Gross)
//         }
//       })
//
//
//   context.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height2 + ")")
//       .call(xAxis2);
//
//   context.append("g")
//       .attr("class", "x brush")
//       .call(brush)
//     .selectAll("rect")
//       .attr("y", -6)
//       .attr("height", height2 + 7);
//
//   function brushed() {
//       var selected = null;
//         selected =  x2.domain()
//                   .filter(function(d){
//                    		return (brush.extent()[0] <= x2(d)) && (x2(d) <= brush.extent()[1]);
//   							});
//
//       var start;
//       var end;
//
//     	if(brush.extent()[0] != brush.extent()[1])
//         {
//           start = selected[0];
//   		  	end = selected[selected.length - 1] + 1;
//         } else {
//   				start = 0;
//   				end = data.length;
//         }
//
//       var updatedData = data.slice(start, end);
//
//       update(updatedData);
//       enter(updatedData);
//       exit(updatedData);
//     	updateScale(updatedData)
//
//
//   }
//
//   function updateScale(data)
//   {
//         var tickScale = d3.scale.pow().range([data.length / 10, 0]).domain([data.length, 0]).exponent(.5)
//
//     var brushValue = brush.extent()[1] - brush.extent()[0];
//     if(brushValue === 0){
//       brushValue = width;
//     }
//
//     var tickValueMultiplier = Math.ceil(Math.abs(tickScale(brushValue)));
//     var filteredTickValues = data.filter(function(d, i){return i % tickValueMultiplier === 0}).map(function(d){ return d.Rank})
//
//     focus.select(".x.axis").call(xAxis.tickValues(filteredTickValues));
//     focus.select(".y.axis").call(yAxis);
//   }
//
//   function update(data)
//   {
//       x.domain(data.map(function(d){ return d.Rank}));
//       y.domain([0, d3.max(data, function(d) { return d.Lifetime_Gross;})]);
//
//       var bars =  focus.selectAll('.bar')
//           .data(data)
//       bars
//         .attr(
//         {
//           height: function (d, i)
//           {
//             return height - y(d.Lifetime_Gross);
//           },
//           width: function(d){
//             return x.bandwidth()
//           },
//           x: function(d) {
//
//             return x(d.Rank);
//           },
//           y: function(d)
//           {
//             return y(d.Lifetime_Gross)
//           }
//         })
//
//   }
//
//   function exit(data)
//   {
//     var bars =  focus.selectAll('.bar').data(data)
//     bars.exit().remove()
//   }
//
//   function enter(data)
//   {
//       x.domain(data.map(function(d){ return d.Rank}));
//       y.domain([0, d3.max(data, function(d) { return d.Lifetime_Gross;})]);
//
//       var bars =  focus.selectAll('.bar')
//           .data(data)
//       bars.enter().append("rect")
//         .classed('bar', true)
//         .attr(
//         {
//           height: function (d, i)
//           {
//             return height - y(d.Lifetime_Gross);
//           },
//           width: function(d){
//             return x.bandWidth()
//           },
//           x: function(d) {
//
//             return x(d.Rank);
//           },
//           y: function(d)
//           {
//             return y(d.Lifetime_Gross)
//           }
//         })
//   }
// });
