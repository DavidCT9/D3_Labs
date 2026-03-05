var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var flag = true;
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);

var xAxisGroup = g.append("g").attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")");
var yAxisGroup = g.append("g").attr("class", "y-axis");

var xAxisCall = d3.axisBottom(x);
var yAxisCall = d3.axisLeft(y).ticks(11).tickFormat((d) => { return "$" + d / 1000 + "K"; });

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");

data = d3.json("data/revenues.json").then((data) => {
    data.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });
    console.log(data);

    d3.interval(() => {
        update(data);
        flag = !flag;
    }, 1000);
    update(data);
}).catch((error) => {
    console.log(error);
});

count = 0;

function update(data) {
    var value = flag ? "revenue" : "profit";
    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);

    x.domain(data.map((d) => { return d.month; }));
    y.domain([0, d3.max(data, function (d) { return d[value] })])

    var color = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range(["#ff0000", "#fffb00"]);

    xAxisGroup.call(xAxisCall);
    yAxisGroup.call(yAxisCall);

    var bars = g.selectAll("rect").data(data);
    bars.exit().remove();
    bars.attr("x", (d) => { return x(d.month); })
        .attr("y", (d) => { return y(d[value]); })
        .attr("width", x.bandwidth)
        .attr("height", (d) => { return height - y(d[value])});

    bars.enter().append("rect")
        .attr("x", (d) => { return x(d.month); })
        .attr("y", (d) => { return y(d[value]); })
        .attr("width", x.bandwidth)
        .attr("height", (d) => { return height - y(d[value]);})
        .attr("fill", (d, i) => color(i));

}