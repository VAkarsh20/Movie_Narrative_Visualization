// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

// csv = "movies.csv";


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv";
  csv = "movies.csv";
  const DATA = d3.csv(csv)
  DATA.then(function(data) {

    var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
    var data = dataCleaner(data)

    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(data)

    // update bars
    u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", "#69b3a2")



      function dataCleaner(data) {

        var res = new Array(labels.length);

        for (var i = 0; i < labels.length; i++) {

          res[i] = {"group": labels[i], "var1": 0, "var2": 0}
        }

        for (var i = 0; i < data.length; i++) {

          studioParent = studioParentFinder(data[i]["US_Distributor"]);
          resIdx = labels.indexOf(studioParent)

          if (resIdx != -1) {

            res[resIdx]["var1"] += parseInt(data[i].Lifetime_Gross)
            res[resIdx]["var2"] += 1
          }
        }

        return res
      }



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





  })

}

// Initialize plot
update('var1')



// // set the dimensions and margins of the graph
// var margin = {top: 30, right: 30, bottom: 70, left: 60},
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
// // Initialize the X axis
// var x = d3.scaleBand()
//   .range([ 0, width ])
//   .padding(0.2);
// var xAxis = svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//
// // Initialize the Y axis
// var y = d3.scaleLinear()
//   .range([ height, 0]);
// var yAxis = svg.append("g")
//   .attr("class", "myYaxis")
//
//
// // csv = "movies.csv";
// csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv";
//
//
//
// // A function that create / update the plot for a given variable:
// function update(selectedVar) {
//
//   // Parse the Data
//
//   const DATA = d3.csv(csv)
//
//   // DATA.then(function(data) {
//   // d3.csv(csv, function(data) {
//
//
//   //     // X axis
//   //   x.domain(data.map(function(d) { return d.group; }))
//   //   xAxis.transition().duration(1000).call(d3.axisBottom(x))
//   //
//   //   // Add Y axis
//   //   y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
//   //   yAxis.transition().duration(1000).call(d3.axisLeft(y));
//   //
//   //   // variable u: map data to existing bars
//   //   var u = svg.selectAll("rect")
//   //     .data(data)
//   //
//   //   // update bars
//   //   u
//   //     .enter()
//   //     .append("rect")
//   //     .merge(u)
//   //     .transition()
//   //     .duration(1000)
//   //       .attr("x", function(d) { return x(d.group); })
//   //       .attr("y", function(d) { return y(d[selectedVar]); })
//   //       .attr("width", x.bandwidth())
//   //       .attr("height", function(d) { return height - y(d[selectedVar]); })
//   //       .attr("fill", "#69b3a2")
//   // })
//
//   d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv", function(data) {
//
//     // X axis
//     x.domain(data.map(function(d) { return d.group; }))
//     xAxis.transition().duration(1000).call(d3.axisBottom(x))
//
//     // Add Y axis
//     y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
//     yAxis.transition().duration(1000).call(d3.axisLeft(y));
//
//     // variable u: map data to existing bars
//     var u = svg.selectAll("rect")
//       .data(data)
//
//     // update bars
//     u
//       .enter()
//       .append("rect")
//       .merge(u)
//       .transition()
//       .duration(1000)
//         .attr("x", function(d) { return x(d.group); })
//         .attr("y", function(d) { return y(d[selectedVar]); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d[selectedVar]); })
//         .attr("fill", "#69b3a2")
//   })
//
// }
//
// // Initialize plot
// update('var1')





// var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];

// // // X axis
// x.domain(data.map(function(d) { return d.StudioParent; }))
// xAxis.transition().duration(1000).call(d3.axisBottom(x))
//
// // Add Y axis
// y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
// yAxis.transition().duration(1000).call(d3.axisLeft(y));
//
// // variable u: map data to existing bars
// var u = svg.selectAll("rect")
//   .data(data)
//
// // update bars
// u.enter()
//   .append("rect")
//   .merge(u)
//   .transition()
//   .duration(1000)
//     .attr("x", function(d) { return x(d.StudioParent); })
//     .attr("y", function(d) { return y(d[selectedVar]); })
//     .attr("width", x.bandwidth())
//     .attr("height", function(d) { return height - y(d[selectedVar]); })
//     .attr("fill", "#69b3a2")
//
//
//
// function dataCleaner(data) {
//
//   var res = new Array(labels.length);
//
//   for (var i = 0; i < labels.length; i++) {
//
//     res[i] = {"StudioParent": labels[i], "TotalLifetimeGross": 0, "Count": 0}
//   }
//
//   for (var i = 0; i < data.length; i++) {
//
//     studioParent = studioParentFinder(data[i]["US_Distributor"]);
//     resIdx = labels.indexOf(studioParent)
//
//     if (resIdx != -1) {
//
//       res[resIdx]["TotalLifetimeGross"] += parseInt(data[i].Lifetime_Gross)
//       res[resIdx]["Count"] += 1
//     }
//
//   }
//
//   return res
// }
//
//
//
// function studioParentFinder(distributor) {
//
//     var disney = ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
//     var universal = ["Universal Pictures", "Focus Features", "Gramercy Pictures (I)", "USA Films", "FilmDistrict"]
//     var viacom = ["Paramount Pictures", "Miramax"]
//     var warner = ["Warner Bros.", "New Line Cinema"]
//     var sony = ["Sony Pictures Releasing", "TriStar Pictures", "Screen Gems", "Columbia Pictures", "Sony Pictures Classics", "FUNimation Entertainment"]
//     var miniMajor = ["DreamWorks", "DreamWorks Distribution", "Lionsgate", "Summit Entertainment", "Artisan Entertainment", "Metro-Goldwyn-Mayer (MGM)", "Orion Pictures", "United Artists", "United Artists Releasing", "STX Entertainment"]
//
//     var groups = [disney, universal, viacom, warner, sony, miniMajor];
//
//     for (var i = 0; i < groups.length; i++) {
//
//       if (groups[i].includes(distributor)) { return labels[i]; }
//     }
//
//     return "Other";
// }
















//
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
// // Parse the Data
//
// csv = "movies.csv";
// // csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv";
//
// const DATA = d3.csv(csv);
//
//
// DATA.then(function(data) {
//
//
//
//   // create 2 data_set
//   var data1 = [
//      {group: "A", value: 4},
//      {group: "B", value: 16},
//      {group: "C", value: 8}
//   ];
//
//   var data2 = [
//      {group: "A", value: 7},
//      {group: "B", value: 1},
//      {group: "C", value: 20},
//      {group: "D", value: 10}
//   ];
//
//   // set the dimensions and margins of the graph
//   var margin = {top: 30, right: 30, bottom: 70, left: 60},
//       width = 460 - margin.left - margin.right,
//       height = 400 - margin.top - margin.bottom;
//
//   // append the svg object to the body of the page
//   var svg = d3.select("#chart")
//     .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");
//
//   // Initialize the X axis
//   var x = d3.scaleBand()
//     .range([ 0, width ])
//     .padding(0.2);
//   var xAxis = svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//
//   // Initialize the Y axis
//   var y = d3.scaleLinear()
//     .range([ height, 0]);
//   var yAxis = svg.append("g")
//     .attr("class", "myYaxis")
//
//   // Initialize the plot with the first dataset
//   update(data1);
//
//   // A function that create / update the plot for a given variable:
//   function update(data) {
//
//     // Update the X axis
//     x.domain(data.map(function(d) { return d.group; }))
//     xAxis.call(d3.axisBottom(x))
//
//     // Update the Y axis
//     y.domain([0, d3.max(data, function(d) { return d.value }) ]);
//     yAxis.transition().duration(1000).call(d3.axisLeft(y));
//
//     // Create the u variable
//     var u = svg.selectAll("rect")
//       .data(data)
//
//     u
//       .enter()
//       .append("rect") // Add a new rect for each new elements
//       .merge(u) // get the already existing elements as well
//       .transition() // and apply changes to all of them
//       .duration(1000)
//         .attr("x", function(d) { return x(d.group); })
//         .attr("y", function(d) { return y(d.value); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d.value); })
//         .attr("fill", "#69b3a2")
//
//     // If less group in the new dataset, I delete the ones not in use anymore
//     u
//       .exit()
//       .remove()
//   }
//
//
//
//   function studioParentFinder(distributor) {
//
//       var disney = ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
//       var universal = ["Universal Pictures", "Focus Features", "Gramercy Pictures (I)", "USA Films", "FilmDistrict"]
//       var viacom = ["Paramount Pictures", "Miramax"]
//       var warner = ["Warner Bros.", "New Line Cinema"]
//       var sony = ["Sony Pictures Releasing", "TriStar Pictures", "Screen Gems", "Columbia Pictures", "Sony Pictures Classics", "FUNimation Entertainment"]
//       // var miniMajor = ["DreamWorks", "DreamWorks Distribution", "Lionsgate", "Summit Entertainment", "Artisan Entertainment", "Metro-Goldwyn-Mayer (MGM)", "Orion Pictures", "United Artists", "United Artists Releasing", "STX Entertainment"]
//
//       var groups = [disney, universal, viacom, warner, sony];
//
//       for (var i = 0; i < groups.length; i++) {
//
//         if (groups[i].includes(distributor)) { return labels[i]; }
//       }
//
//       return "";
//   }
//
//
//   function grossArray(data) {
//
//
//     for (var i = 0; i < data.length; i++) {
//
//       data[i]["Studio_Parent"] = studioParentFinder(data[i]["US_Distributor"]);
//     }
//
//     var totalGross = new Array(labels.length).fill(0);
//
//     for (var i = 0; i < data.length; i++) {
//
//       studioParent = studioParentFinder(data[i]["US_Distributor"]);
//
//       arrIdx = labels.indexOf(studioParent)
//
//       totalGross[arrIdx] += parseInt(data[i].Lifetime_Gross)
//     }
//
//     return totalGross;
//
//   }
//
//
//   function dataCleaner(totalGross) {
//
//       var dataset = {};
//
//       for (var i = 0; i < labels.length; i++) {
//
//         dataset[labels[i]] = totalGross[i]
//       }
//
//       return dataset;
//   }
//
//
//
//   // List of subgroups = header of the csv files = soil condition here
//   var subgroups = data.columns.slice(1)
//
//   // List of groups = species here = value of the first column called group -> I show them on the X axis
//   var groups = d3.map(data, function(d){return(d.group)}).keys()
//
//   // Add X axis
//   var x = d3.scaleBand()
//       .domain(groups)
//       .range([0, width])
//       .padding([0.2])
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSizeOuter(0));
//
//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 60])
//     .range([ height, 0 ]);
//   svg.append("g")
//     .call(d3.axisLeft(y));
//
//   // color palette = one color per subgroup
//   var color = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(['#e41a1c','#377eb8','#4daf4a'])
//
//   //stack the data? --> stack per subgroup
//   var stackedData = d3.stack()
//     .keys(subgroups)
//     (data)
//
//   // Show the bars
//   svg.append("g")
//     .selectAll("g")
//     // Enter in the stack data = loop key per key = group per group
//     .data(stackedData)
//     .enter().append("g")
//       .attr("fill", function(d) { return color(d.key); })
//       .selectAll("rect")
//       // enter a second time = loop subgroup per subgroup to add all rectangles
//       .data(function(d) { return d; })
//       .enter().append("rect")
//         .attr("x", function(d) { return x(d.data.group); })
//         .attr("y", function(d) { return y(d[1]); })
//         .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//         .attr("width",x.bandwidth())
//
//
// });






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
// const DATA = d3.csv("movies.csv");
//
//
// DATA.then(function(data) {
//
//
//   var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
//
//   var grossArray = grossArray(data);
//   var data = dataCleaner(grossArray)
//
//   console.log(data)
//
//
//   // set the color scale
//   var color = d3.scaleOrdinal()
//     .domain(data)
//     .range(d3.schemeTableau10)
//
//   // Compute the position of each group on the pie:
//   var pie = d3.pie()
//     .value(function(d) {return d.value; })
//   var data_ready = pie(d3.entries(data))
//
//   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
//   svg
//     .selectAll('whatever')
//     .data(data_ready)
//     .enter()
//     .append('path')
//     .attr('d', d3.arc()
//       .innerRadius(100)         // This is the size of the donut hole
//       .outerRadius(radius)
//     )
//     .attr('fill', function(d){ return(color(d.data.key)) })
//     .attr("stroke", "black")
//     .style("stroke-width", "2px")
//     .style("opacity", 0.7)
//
//
//
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
//         return labels[labels.length - 1];
//     }
//
//
//     function grossArray(data) {
//
//
//       for (var i = 0; i < data.length; i++) {
//
//         data[i]["Studio_Parent"] = studioParentFinder(data[i]["US_Distributor"]);
//       }
//
//       var totalGross = new Array(labels.length).fill(0);
//
//       for (var i = 0; i < data.length; i++) {
//
//         studioParent = studioParentFinder(data[i]["US_Distributor"]);
//
//         arrIdx = labels.indexOf(studioParent)
//
//         totalGross[arrIdx] += parseInt(data[i].Lifetime_Gross)
//       }
//
//       return totalGross;
//
//     }
//
//
//     function dataCleaner(totalGross) {
//
//         var dataset = {};
//
//         for (var i = 0; i < labels.length; i++) {
//
//           dataset[labels[i]] = totalGross[i]
//         }
//
//         return dataset;
//     }
//
// });



// // set the dimensions and margins of the graph
// var margin = {top: 30, right: 30, bottom: 70, left: 60},
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
// // Initialize the X axis
// var x = d3.scaleBand()
//   .range([ 0, width ])
//   .padding(0.2);
// var xAxis = svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//
// // Initialize the Y axis
// var y = d3.scaleLinear()
//   .range([ height, 0]);
// var yAxis = svg.append("g")
//   .attr("class", "myYaxis")
//
// // csv = "movies.csv";
//
//
// // A function that create / update the plot for a given variable:
// function update(selectedVar) {
//
//   // Parse the Data
//   csv = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv";
//   // csv = "movies.csv";
//   const DATA = d3.csv(csv)
//   DATA.then(function(data) {
//
//   // d3.csv(csv, function(data) {
//
//     // X axis
//     x.domain(data.map(function(d) { return d.group; }))
//     xAxis.transition().duration(1000).call(d3.axisBottom(x))
//
//     // Add Y axis
//     y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
//     yAxis.transition().duration(1000).call(d3.axisLeft(y));
//
//     // variable u: map data to existing bars
//     var u = svg.selectAll("rect")
//       .data(data)
//
//     // update bars
//     u
//       .enter()
//       .append("rect")
//       .merge(u)
//       .transition()
//       .duration(1000)
//         .attr("x", function(d) { return x(d.group); })
//         .attr("y", function(d) { return y(d[selectedVar]); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d[selectedVar]); })
//         .attr("fill", "#69b3a2")
//   })
//
// }
//
// // Initialize plot
// update('var1')
