var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

data = d3.json("data/revenues.json").then((data) => {
    data.forEach(d => {
        d.revenue = +d.revenue;
    });
    console.log(data);

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([height, 0]);

    var color = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range(["#ff0000", "#fffb00"]);

    var bottomAxis = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height) + ")")
        .call(bottomAxis)
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

    var yAxisCall = d3.axisLeft(y).ticks(11).tickFormat((d) => { return "$" + d/1000 + "K"; });
    g.append("g").attr("class", "left axis").call(yAxisCall)

    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", (width / 2))
        .attr("y", height + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text("Month");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("fill", "white")
        .text("Revenue (dlls.)");

    var rectangles = g.selectAll("rect").data(data);
    rectangles.enter()
        .append("rect")
        .attr("x", (d) => x(d.month))
        .attr("y", (d) => y(d.revenue))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.revenue))
        .attr("fill", (d,i) => color(i))

}).catch((error) => {
    console.log(error);
});
