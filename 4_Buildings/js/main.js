data = d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = +d.height;
    });
    console.log(data);

    var svg = d3.select("#chart-area").append("svg").attr("width", 1000).attr("height", 1500);
    var rectangles = svg.selectAll("rect").data(data)

    rectangles.enter()
        .append("rect")
        .attr("x", (data, i) => { return (70 * i); })
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", (data, i) => {
            console.log(data.height)
            return (data.height);
            
        })
        .attr("fill", () => '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'))
}).catch((error) => {
    console.log(error);
});
