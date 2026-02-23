var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

data = d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = +d.height;
    });
    console.log(data);

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeSet3);

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

    var yAxisCall = d3.axisLeft(y).ticks(5).tickFormat((d) => { return d + "m"; });
    g.append("g").attr("class", "left axis").call(yAxisCall)

    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", (width / 2))
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .text("The word's tallest buildings");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("fill", "black")
        .text("Height (m)");

    var rectangles = g.selectAll("rect").data(data);
    rectangles.enter()
        .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.height))
        .attr("fill", (d) => color(d.name))

}).catch((error) => {
    console.log(error);
});
