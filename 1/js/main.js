var svg = d3.select("#chart-area").append("svg").attr("width",400).attr("height",400);
var circle = svg.append("circle").attr("cx", 100).attr("cy",250).attr("r",70).attr("fill","blue");
var rect = svg.append("rect").attr("x",20).attr("y",20).attr("width",20).attr("height",20).attr("fill","red");

var elipse = svg.append("ellipse").attr("cx",100).attr("cy",300).attr("rx",30).attr("ry",55).attr("fill","green");


