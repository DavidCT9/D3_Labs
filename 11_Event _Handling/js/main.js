var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html((d) => {
        var text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
        text += "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
        text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
        text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
        return text;
    });
g.call(tip);

var x = d3.scaleLog().domain([142, 150000]).range([0, width]);
var y = d3.scaleLinear().domain([0, 90]).range([height, 0]);
var area = d3.scaleLinear().domain([2000, 1400000000]).range([25 * Math.PI, 1500 * Math.PI]);
var color = d3.scaleOrdinal().range(d3.schemePastel1);

var xAxisGroup = g.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");
var yAxisGroup = g.append("g").attr("class", "y axis");

var xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat((d) => { return "$" + d; });
var yAxisCall = d3.axisLeft(y);

xAxisGroup.call(xAxisCall);
yAxisGroup.call(yAxisCall);

g.append("text").attr("class", "x axis-label").attr("x", (width / 2)).attr("y", height + 50).attr("font-size", "20px").attr("text-anchor", "middle").text("GDP Per Capita");
g.append("text").attr("class", "y axis-label").attr("x", - (height / 2)).attr("y", -50).attr("font-size", "20px").attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Life Expectancy (Years)");

var timeLabel = g.append("text").attr("y", height - 250).attr("x", width - 40).attr("font-size", "40px").attr("opacity", "0.4").attr("text-anchor", "middle").text("Year");

var time = 0;
var formattedData;
var interval; 
var isPlaying = true;

d3.json("data/data.json").then(function (data) {

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

    interval = setInterval(step, 1000);


    $("#play-button").on("click", function () {
        if (isPlaying) {
            clearInterval(interval); 
            $(this).text("Play");
        } else {
            interval = setInterval(step, 1000);
            $(this).text("Pause");
        }
        isPlaying = !isPlaying; // Flip the state boolean
    });

    $("#reset-button").on("click", function () {
        time = 0; 
        update(formattedData[0]); 
        $("#date-slider").slider("value", 0);
    });

    $("#continent-select").on("change", function () {
        update(formattedData[time]);
    });

    $("#date-slider").slider({
        min: 0,
        max: formattedData.length - 1,
        step: 1,
        slide: function (event, ui) {
            time = ui.value; 
            update(formattedData[time]); 
        }
    });

}).catch((error) => {
    console.log(error);
});

function step() {
    time = (time < formattedData.length - 1) ? time + 1 : 0;
    update(formattedData[time]);

    $("#date-slider").slider("value", time);
}

function update(dataForYear) {
    timeLabel.text(dataForYear.year);

    var continentSelection = $("#continent-select").val();

    var filteredData = dataForYear.countries.filter((d) => {
        if (continentSelection == "all") {
            return true;
        } else {
            return d.continent == continentSelection; 
        }
    });

    console.log(dataForYear);

    var circles = g.selectAll("circle")
        .data(filteredData, (d) => { return d.country; });

    circles.exit().remove();

    circles.enter()
        .append("circle")
        .attr("fill", (d) => { return color(d.continent); })

        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition().duration(100)
        .attr("cy", (d) => { return y(d.life_exp); })
        .attr("cx", (d) => { return x(d.income); })
        .attr("r", (d) => { return Math.sqrt(area(d.population) / Math.PI); });
}