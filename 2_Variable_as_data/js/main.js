var data = [25, 20, 15, 10, 5];

var svg = d3.select("#chart-area").append("svg") .attr("width", 400) .attr("height", 400);
var rectangles = svg.selectAll("rect").data(data); 

rectangles.enter()
    .append("rect")
        .attr("height", (d,i) => {
            console.log("Rectangle data:"+d+" Index: "+i);
            return (d*(d/2));
        })
        .attr("width",40)
        .attr("x", (d,i) => {return (50 * i);} )
        .attr("y", 10)
        .attr("fill", "green");