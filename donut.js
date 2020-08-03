
// https://www.d3-graph-gallery.com/graph/pie_changeData.html
// https://bl.ocks.org/cflavs/ff1c6005fd7edad32641

// Overall Structure and animation taken from the following links
// https://www.d3-graph-gallery.com/graph/pie_changeData.html

// Dimensions
var width = 1200
    height = 500
    margin = 50

// Radius
var radius = Math.min(width, height) / 2 - margin

// Creating svg object
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Data and Labels (Tried to parse data but failed so hard coded)
var disney =  ["Walt Disney Studios Motion Pictures", "Twentieth Century Fox", "Fox Searchlight Pictures", "UTV Motion Pictures"];
var data1 = {"Walt Disney Studios Motion Pictures": 83299918370, "Twentieth Century Fox" : 52795884688, "Fox Searchlight Pictures":1930977401, "UTV Motion Pictures":303723636}
var data2 = {"Walt Disney Studios Motion Pictures": 151, "Twentieth Century Fox" : 132, "Fox Searchlight Pictures": 8, "UTV Motion Pictures": 1}

// Finding Totals for the data
var data1_total = 0
var data2_total = 0

for (var i = 0; i < disney.length; i++) {

  data1_total += data1[disney[i]];
  data2_total += data2[disney[i]];
}


// Color Coding based on Disney Studio
var color = d3.scaleOrdinal()
  .domain(disney)
  .range(["#4e79a7", "Turquoise", "Aqua", "Teal"]);

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



// Create and update the bars
function update(data) {

  // Creating Pie
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} )
  var data_ready = pie(d3.entries(data))

  // Maping Data to arcs
  var u = svg.selectAll("path")
    .data(data_ready)

  // Creating Donut chart with arcs
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
    .style("opacity", 0.5)

  u
    .on('mouseover', function(d) { this.style.opacity = 1; tooltipFunction(d, "over")})
  u
    .on('mousemove', function(d) { tooltipFunction(d, "move")})
  u
    .on('mouseout', function(d) { this.style.opacity = 0.5; tooltipFunction(d, "out") });



  // Legend Code was inspired by the following link
  // https://www.d3-graph-gallery.com/graph/custom_legend.html
  // Creating Colors
  var size = 20
  svg.selectAll("dots")
    .data(disney)
    .enter()
    .append("rect")
      .attr("x", width * 0.25)
      .attr("y", function(d,i){ return height * 0.00000001 + i*(size+5)})
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d){ return color(d)})

  // Creating Text
  svg.selectAll("labels")
    .data(disney)
    .enter()
    .append("text")
      .attr("x", width * 0.25 + size * 1.2)
      .attr("y", function(d,i){ return height * 0.00000001 + i*(size+5) + (size * 0.5)})
      .style("fill", "black")
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")


  // Getting rid of groups not there anymore
  u
    .exit()
    .remove()

}

// Tooltip helper function
function tooltipFunction(d, action) {

  switch (action) {
    case "over":

      tooltip.style("opacity", 1);
      return;
    case "move":

      if (d.data.value > 200) {
        tooltip.html('<u>' + d.data.key + '</u>'
                      + "<br>" + "Studio Total Lifetime Gross: $"+ grossToString(d.data.value)
                      + "<br>" + "Disney Total Lifetime Gross: $"+ grossToString(data1_total)
                      + "<br>" + "Percentage: "+ Math.round(1000 * d.data.value / data1_total) / 10);
      } else {

        tooltip.html('<u>' + d.data.key + '</u>'
                      + "<br>" + "Studio Movie Count:  " + d.data.value
                      + "<br>" + "Disney Movie Count: "+ data2_total
                      + "<br>" + "Percentage: "+ Math.round(1000 * d.data.value / data2_total) / 10 + "%");
      }



      tooltip.style('top', (d3.event.pageY + 10) + 'px')
              .style('left', (d3.event.pageX + 10) + 'px');
      return;
    default:
      tooltip.style("opacity", 0);
  }
}

// Code to transfer numeral to money representation string inspired from the following link
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function grossToString(value) {

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Plot initalization
update(data1);
