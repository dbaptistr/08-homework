import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let radius = 100

let radiusScale = d3
  .scaleLinear()
  .domain([0, 120])
  .range([0, radius])

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.2)

var colorScale = d3
  .scaleLinear()
  .domain([0, 120])
  .range(['#b3cde3', '#fbb4b9'])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.data.low_temp))
  .outerRadius(d => radiusScale(d.data.high_temp))

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // console.log(nested)

  var cities = datapoints.map(d => d.city)

  xPositionScale.domain(cities)

  svg
    .selectAll('.small-charts')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'small-charts')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)}, 100)`
    })
    .each(function(d) {
      let svg = d3.select(this)

      svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

      svg
        .selectAll('.temp-bar')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.high_temp))
      svg
        .append('circle')
        .attr('r', 2)
        .attr('cx', 0)
        .attr('cy', 0)
      svg
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('y', 120)
    })
}
