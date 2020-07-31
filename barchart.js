
var barChartDiv = document.querySelector("#chart");
const ticks = [800000000, 900000000, 1000000000, 2000000000, 2500000000, 2800000000]

// var width = barChartDiv.clientWidth;
// var height = 700;


var height = 600;
var width = 1000;
var margin = 50;

// var margin = {top: 30, right: 30, bottom: 70, left: 60},
//     width = 800 - margin.left - margin.right,
//     height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(barChartDiv)
  .append("svg")
    .attr("width", width - 2 * margin)
    .attr("height", height + 2 * margin)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");


const DATA = d3.csv("movies.csv");


DATA.then(function(data) {

  data =  data.filter(function(d){ return d.Rank <= 100 })


  var distributors = d3.map(data, function(d){ return d.US_Distributor; }).keys();
  var boxOfficeList = d3.map(data, function(d){ return d.Lifetime_Gross; }).keys();

  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.Movie_Name}))
    .range([0, width])
    .padding(0.2);

  var max = d3.max(data, function(d) { return d.Lifetime_Gross; } );

  var y = d3.scaleLog()
    .domain([Math.min(...boxOfficeList) - 10000000, Math.max(...boxOfficeList)])
    .range([height,0])
    .base(10)

    svg.append("g")
      .attr("transform", "translate(" + 0 + "," + (height) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");



    svg.append("g")
      //.attr("transform","translate("+margin+","+margin+")")
      .call(d3.axisLeft(y).tickValues(ticks).tickFormat(d3.format("~s")));


  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Movie_Name); })
      .attr("y", function(d) { return height; })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return 0; })
      .attr("fill", "#69b3a2");


  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.Lifetime_Gross); })
    .attr("height", function(d) { return height - y(d.Lifetime_Gross); })
    .delay(function(d,i) { return (i*100); });

});
