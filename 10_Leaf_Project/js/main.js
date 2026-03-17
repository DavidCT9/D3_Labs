var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog()
    .domain([142, 150000])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]); 

var area = d3.scaleLinear()
    .domain([2000, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal()
    .range(d3.schemePastel1); 

	// Axes n Calls
var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat((d) => { return "$" + d; });

var yAxisCall = d3.axisLeft(y);

xAxisGroup.call(xAxisCall);
yAxisGroup.call(yAxisCall);

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita");

g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy (Years)");

	// Year (Dynamic)
var timeLabel = g.append("text")
    .attr("y", height - 250)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("Year");

var time = 0;
var formattedData;

d3.json("data/data.json").then(function (data) {
    
    // We preserve the year key
    formattedData = data.map((yearObj) => {
        return {
            year: yearObj.year,
            countries: yearObj["countries"].filter((country) => {
                var dataExists = (country.income && country.life_exp);
                return dataExists;
            }).map((country) => {
                country.income = +country.income;
                country.life_exp = +country.life_exp;
                country.population = +country.population;
                return country;
            })
        };
    });

    var continents = [...new Set(formattedData[0].countries.map(d => d.continent))];
    color.domain(continents);

    update(formattedData[0]);

    d3.interval(() => {
        // Increment time, loop back to 0
        time = (time < formattedData.length - 1) ? time + 1 : 0;
        update(formattedData[time]);
    }, 1000);

}).catch((error) => {
    console.log(error);
});

function update(dataForYear) {
    timeLabel.text(dataForYear.year);

    var circles = g.selectAll("circle")
        .data(dataForYear.countries, (d) => { return d.country; });

    circles.exit().remove();

    circles.enter()
        .append("circle")
        .attr("fill", (d) => { return color(d.continent); })

		.merge(circles)
        .transition().duration(100) 
        .attr("cy", (d) => { return y(d.life_exp); }) 
        .attr("cx", (d) => { return x(d.income); })   
        .attr("r", (d) => { return Math.sqrt(area(d.population) / Math.PI); });
}