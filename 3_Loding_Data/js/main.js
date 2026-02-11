data = d3.json("data/ages.json").then((data) => {
    data.forEach((d) => {
        d.age = +d.age;
    });
    console.log(data);

    colors = ["red", "green", "blue", "pink", "black"]
    var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);
    var circles = svg.selectAll("circle").data(data)

    circles.enter()
        .append("circle")
        .attr("cy", 100)
        .attr("cx", (data, i) => { return (50 * i) + 25; })
        .attr("r", (data) => {
            return (data.age);
        })
        .attr("fill", (d,i) => {return colors[i]})


}).catch((error) =>{
    console.log(error);
});