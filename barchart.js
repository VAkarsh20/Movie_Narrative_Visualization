
// Overal Structure and Animation of bargraph was inspired by this link
// https://www.d3-graph-gallery.com/graph/barplot_basic.html

var barChartDiv = document.querySelector("#chart");

// Dimensions
var margin = {top: 10, right: 60, bottom: 160, left: 150},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Creating svg object
var svg = d3.select(barChartDiv)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


const DATA = d3.csv("movies.csv");
DATA.then(function(data) {

  // Data Filtering
  data =  data.filter(function(d){ return d.Lifetime_Gross >= 1000000000 })
  var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();

  // X and Y plus Axises
  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.Movie_Name}))
    .range([0, width])
    .padding(0.2);

  var y = d3.scaleLinear()
    .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
    .range([height,0])

  svg.append("g")
      .attr("transform", "translate(" + 0 + "," + (height) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

  svg.append("g")
    .call(d3.axisLeft(y));

  // Coloring Bars
  var labels = ["Walt Disney Studios", "NBCUniversal", "ViacomCBS", "WarnerMedia", "Sony Pictures", "Mini-majors", "Other"];

  // Color coding the values based on Studio Parent
  var color = d3.scaleOrdinal()
    .domain(labels)
    .range(d3.schemeTableau10)

  // Initializing Bars
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

  // Loading Bars with Animation
  svg.selectAll("rect")
    .transition()
    .duration(500)
    .attr("y", function(d) { return y(d.Lifetime_Gross); })
    .attr("height", function(d) { return height - y(d.Lifetime_Gross); })
    .delay(function(d,i) { return (i*100); });


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

          tooltip.html('<u>' + d.Movie_Name + '</u>'
                      + "<br>" + "Box Office Rank: "+ d.Rank
                      + "<br>" + "Lifetime Gross: $"+ grossToString(d.Lifetime_Gross)
                      + "<br>" + "Release Year: "+ d.Year
                      + "<br>" + "Director: "+ d.Director
                      + "<br>" + "Studio: "+ d.US_Distributor
                      + "<br>" + "MPAA: "+ d.MPAA
                      + "<br>" + "Run Time: "+ d.Running_Time)
            .style('top', (d3.event.pageY + 10) + 'px')
            .style('left', (d3.event.pageX + 10) + 'px');
          return;
        default:
          tooltip.style("opacity", 0);
      }
  }

  // Legend Code was inspired by the following link
  // https://www.d3-graph-gallery.com/graph/custom_legend.html
  // Creating Colors
  var size = 20
  svg.selectAll("dots")
    .data(labels)
    .enter()
    .append("rect")
      .attr("x", width * 0.85)
      .attr("y", function(d,i){ return height / 20 + i*(size+5)})
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d){ return color(d)})

  // Creating Text
  svg.selectAll("labels")
    .data(labels)
    .enter()
    .append("text")
      .attr("x", width * 0.85 + size * 1.2)
      .attr("y", function(d,i){ return height / 20 + i*(size+5) + (size * 0.5)})
      .style("fill", "black")
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")


  // Helper Function to find Studio Parent from distributor
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

  // Code to transfer numeral to money representation string inspired from the following link
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  function grossToString(value) {

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

});
