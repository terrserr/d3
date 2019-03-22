var svgWidth =960;
var svgHeight = 500;

var margin = {
    top:20,
    right:40, 
    bottom:60,
    left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight- margin.top - margin.bottom;
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv")
    .then(function(censusData){
        console.log(censusData)
        censusData.forEach(function(data){
            data.healthcare =+ data.healthcare;
            data.poverty =+ data.poverty;  
        });

        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(censusData, d=> d.poverty)])  
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(censusData, d=> d.healthcare)])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate (0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d=> xLinearScale(d.poverty))
            .attr("cy", d=> yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "lightblue")
            .attr("opacity", "1");

           

      chartGroup.selectAll("text")
            .exit()
            .data(censusData)
            .enter()
            .append("text")
            .text(function(d) { return d.abbr; })
            .attr("x", d=> xLinearScale(d.poverty))
            .attr("y", d=> yLinearScale(d.healthcare))
            .style("fill", "white")
            .attr("text-anchor","middle");

        var toolTip = d3.tip()
            .attr("class", "toolTip")
            .offset([80, -60])
            .style("fill", "black")
            .html(function(d){
                return(`Poverty : ${d.poverty}<br> Healthcare: ${d.healthcare}`);
            });
        
        chartGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data){
            toolTip.show(data,this);
        })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0-margin.left+40)
            .attr("x", 0-(height/2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)"); 

        chartGroup.append("text")
            .attr("transform", `translate(${width/2}, ${height+margin.top+30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

    });
