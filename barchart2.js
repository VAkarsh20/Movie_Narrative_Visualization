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

// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  csv = "movies.csv";
  const DATA = d3.csv(csv)
  DATA.then(function(data) {

    var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];
    var data = dataCleaner(data)

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
      .domain(labels)
      .range(d3.schemeTableau10)

    // X axis
    x.domain(data.map(function(d) { return d["Studio Parent"]; }))
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
        .attr("x", function(d) { return x(d["Studio Parent"]); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", function (d) { return color(d["Studio Parent"]); })
        .attr("opacity", 1);





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
update('Total Lifetime Gross')
