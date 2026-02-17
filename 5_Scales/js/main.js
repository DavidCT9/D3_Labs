data = d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = +d.height;
    });
    console.log(data);

    var svg = d3.select("#chart-area").append("svg").attr("width", 500).attr("height", 500);
    var rectangles = svg.selectAll("rect").data(data)

    var domainY = d3.extent(data, (d) => { return d.height; });

    var sb = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3);


    var sl = d3.scaleLinear()
        .domain(domainY)
        .range([0, 400]);

    var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeSet3);

    rectangles.enter()
        .append("rect")
        .attr("x", (d) => sb(d.name))
        .attr("y", 0)
        .attr("width", sb.bandwidth())
        .attr("height", (d) => sl(d.height))
        .attr("fill", (d) => color(d.name))
}).catch((error) => {
    console.log(error);
});
