import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 150

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3
  .scaleOrdinal()
  .range(['#7fc97f', '#beaed4', '#fdc086', '#ffff99'])

var xPositionScale = d3.scaleOrdinal().rangePoints([0, width])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  var projects = datapoints.map(d => d.project)

  xPositionScale.domain(projects)

  var container = svg.append('g').attr('transform', 'translate(200,200)')

  container
    .selectAll('path')
    .data(pie(nested))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.task))
}
