const DUMMY_DATA = [
	{id: "d1", value: 10, region: "USA"},
	{id: "d2", value: 11, region: "FRA"},
	{id: "d3", value: 6, region: "CIN"},
	{id: "d4", value: 12, region: "GER"},
];

const container = d3.select("svg")
	.classed("container", true);

const xScale = d3
	.scaleBand()
	.domain(DUMMY_DATA.map(dat => dat.region))
	.rangeRound([0,250])
	.padding(0.1);
const yScale = d3
	.scaleLinear()
	.domain([0,15])
	.range([200,0]);

const bars = container
	.selectAll(".bar")
	.data(DUMMY_DATA)
	.enter()
	.append("rect")
	.classed("bar", true)
	.attr("width", xScale.bandwidth())
	.attr("height", dat => 200 - yScale(dat.value))
	.attr("x", dat => xScale(dat.region))
	.attr("y", dat => yScale(dat.value));

setTimeout(() => {
	bars
		.data(DUMMY_DATA.slice(0,2))
		.exit()
		.remove();
}, 2000);
