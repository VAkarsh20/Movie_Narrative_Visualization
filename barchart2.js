
// Overal Structure, Animation, and Buttons of bargraph was inspired by this link
// https://www.d3-graph-gallery.com/graph/barplot_button_data_simple.html

// Dimensions
var margin = {top: 10, right: 60, bottom: 160, left: 150},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Creating svg object
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X and Y plus Axises
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

// Create and update the bars
function update(selectedVar) {

  // Data parser
  csv = "movies.csv";
  const DATA = d3.csv(csv)
  DATA.then(function(data) {

    // Labels and data cleanup
    var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
    var data = dataCleaner(data)

    // Color coding based on labels
    var color = d3.scaleOrdinal()
      .domain(labels)
      .range(d3.schemeTableau10)

    // X axis for data
    x.domain(data.map(function(d) { return d["Studio Parent"]; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Y axis for data
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Map data to existing bars
    var u = svg.selectAll("rect")
      .data(data)

    // Update bars
    u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d["Studio Parent"]); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", function (d) { return color(d["Studio Parent"]); })
        .attr("opacity", 1);


      // Helper function to clean up data
      function dataCleaner(data) {

        var res = new Array(labels.length);

        for (var i = 0; i < labels.length; i++) {

          res[i] = {"Studio Parent": labels[i], "Total Lifetime Gross": 0, "Count": 0}
        }

        for (var i = 0; i < data.length; i++) {

          studioParent = studioParentFinder(data[i]["US_Distributor"]);
          resIdx = labels.indexOf(studioParent)
          if (resIdx != -1) {

            res[resIdx]["Total Lifetime Gross"] += parseInt(data[i].Lifetime_Gross)
            res[resIdx]["Count"] += 1
          }
        }

        return res
      }

      // Find parent studio based on distributor
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

// Plot initalization
update('Total Lifetime Gross')
