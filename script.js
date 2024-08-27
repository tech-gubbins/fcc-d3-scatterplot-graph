// Fetch and process data
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data => {
    const width = 800;
    const height = 400;
    const padding = 40;

    const xScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Year - 1, 0)), d3.max(data, d => new Date(d.Year + 1, 0))])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
        .range([height - padding, padding]);

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add axes
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

    // Add dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(new Date(d.Year, 0)))
        .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(d.Seconds * 1000))
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("#tooltip")
                .style("opacity", 0.9)
                .html(`Year: ${d.Year}<br>Time: ${d.Time}`)
                .attr("data-year", d.Year)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("opacity", 0);
        });

    // Add the tooltip (initially hidden)
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);
});