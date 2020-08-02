
// https://www.d3-graph-gallery.com/graph/pie_changeData.html
// https://bl.ocks.org/cflavs/ff1c6005fd7edad32641



// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 50

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + 3 * margin)
    .attr("height", height + 3 * margin)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var disney =  ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
var data1 = {"Walt Disney Studios Motion Pictures": 83299918370, "Twentieth Century Fox" : 52795884688, "Fox Searchlight Pictures":1930977401, "UTV Motion Pictures":303723636}
var data2 = {"Walt Disney Studios Motion Pictures": 151, "Twentieth Century Fox" : 132, "Fox Searchlight Pictures": 8, "UTV Motion Pictures": 1}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(disney)
  .range(d3.schemeDark2);


// var tooltip = d3.select("#chart")
//   .append("div")
//   .style("opacity", 0)
//   .attr("class", "tooltip")
//   .style("background-color", "blue")
//   .style("border", "solid")
//   .style("border-width", "2px")
//   .style("border-radius", "5px")
//   .style("padding", "5px")
//   .append('div')
//     .attr('class', 'label')
//     .attr('class', 'count');


var tooltip = d3.select('#chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip');                                    // NEW


          tooltip.append('div')                                           // NEW
            .attr('class', 'label');                                      // NEW

          tooltip.append('div')                                           // NEW
            .attr('class', 'count');                                      // NEW                                 // NEW



// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(100)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  u
    .on('mouseover', function(d) {

      tooltipFunction(d, "over")})
  u
    .on('mousemove', function(d) { tooltipFunction(d, "move")})
  u
    .on('mouseout', function(d) { tooltipFunction(d, "out") });



  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * color.domain().length / 2;
              var horz = -2 * legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + (5 * margin + horz) + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });



            // u.on('mouseover', function(d) {                            // NEW
            //           // var total = d3.sum(dataset.map(function(d) {                // NEW
            //           //   return d.count;                                           // NEW
            //           // }));                                                        // NEW
            //           // var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
            //
            //           console.log(d.data.key)
            //           console.log(d.data.value)
            //
            //           tooltip.select('.label').html(d.data.key);                // NEW
            //           tooltip.select('.count').html(d.data.value);                // NEW
            //           // tooltip.select('.percent').html(percent + '%');             // NEW
            //           tooltip.style('display', 'block');                          // NEW
            //         });                                                           // NEW
            //
            // u.on('mouseout', function() {                              // NEW
            //   tooltip.style('display', 'none');                           // NEW
            // });
            // u.on('mousemove', function(d) {                            // NEW
            //         tooltip.style('top', (d3.event.pageY + 10) + 'px')          // NEW
            //           .style('left', (d3.event.pageX + 10) + 'px');             // NEW
            //       });



  // remove the group that is not present anymore
  u
    .exit()
    .remove()

}

function tooltipFunction(d, action) {

  switch (action) {
    case "over":

      tooltip.style("display", "block");
      return;
    case "move":
      tooltip.select('.label').html(d.data.key);
      tooltip.select('.count').html(d.data.value);
      tooltip.style('top', (d3.event.pageY + 10) + 'px')
              .style('left', (d3.event.pageX + 10) + 'px');
      return;
    default:
      tooltip.style("display", "none");
  }
}



// Initialize the plot with the first dataset
update(data1);










// // set the dimensions and margins of the graph
// var width = 450
//     height = 450
//     margin = 40
//
// // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
// var radius = Math.min(width, height) / 2 - margin
//
// // append the svg object to the div called 'my_dataviz'
// var svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//
// // A function that create / update the plot for a given variable:
// function update(selectedVar) {
//
//   // Parse the Data
//   csv = "movies.csv";
//   const DATA = d3.csv(csv)
//   DATA.then(function(data) {
//
//     var disney =  ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
//     var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
//     var data = dataCleaner(data)
//
//     var data1 = data[0];
//     var data2 = data[1];
//
//     // var data1 = {"Walt Disney Studios Motion Pictures": 83299918370, "Twentieth Century Fox" : 52795884688, "Fox Searchlight Pictures":1930977401, "UTV Motion Pictures":303723636}
//     // var data2 = {"Walt Disney Studios Motion Pictures": 151, "Twentieth Century Fox" : 132, "Fox Searchlight Pictures": 8, "UTV Motion Pictures": 1}
//
//
//     console.log(typeof selectedVar)
//
//     var data = selectedVar === "data1" ? data1 : data2;
//
//
//     // set the color scale
//     var color = d3.scaleOrdinal()
//       .domain(disney)
//       .range(d3.schemeDark2);
//
//
//     // Compute the position of each group on the pie:
//     var pie = d3.pie()
//       .value(function(d) {return d.value; })
//       .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
//     var data_ready = pie(d3.entries(data))
//
//     // map to data
//     var u = svg.selectAll("path")
//       .data(data_ready)
//
//     // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
//     u
//       .enter()
//       .append('path')
//       .merge(u)
//       .transition()
//       .duration(1000)
//       .attr('d', d3.arc()
//         .innerRadius(100)
//         .outerRadius(radius)
//       )
//       .attr('fill', function(d){ return(color(d.data.key)) })
//       .attr("stroke", "white")
//       .style("stroke-width", "2px")
//       .style("opacity", 1)
//
//     // remove the group that is not present anymore
//     u
//       .exit()
//       .remove()
//
//
//
//
//
//
//
//     function dataCleaner(data) {
//
//       // var res = new Array(labels.length);
//
//       var data = data.filter(function(d){return (d.US_Distributor == disney[0]) || (d.US_Distributor == disney[1]) || (d.US_Distributor == disney[2]) || (d.US_Distributor == disney[3])})
//
//
//       var gross = {}
//       var count = {}
//
//       for (var i = 0; i < disney.length; i++) {
//
//         gross[disney[i]] = 0;
//         count[disney[i]] = 0;
//       }
//
//
//
//       for (var i = 0; i < data.length; i++) {
//
//         resIdx = disney.indexOf(data[i]["US_Distributor"])
//
//         gross[disney[resIdx]] += parseInt(data[i].Lifetime_Gross)
//         count[disney[resIdx]] += 1
//
//       }
//
//       return [gross, count]
//     }
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
//   })
// }
//
// // Initialize plot
// update('data1')
