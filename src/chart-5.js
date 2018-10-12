import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 80

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([30, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.3)

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  var cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // console.log(nested)

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('y', 30)
    .attr('x', width / 2)
    .attr('font-weight', '600')

  svg
    .append('text')
    .text('in cities around the world')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('y', 55)
    .attr('x', width / 2)

  svg
    .selectAll('.small-charts')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'small-charts')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', d => {
      return `translate(${xPositionScale(d.key)}, ${height / 2})`
    })
    .each(function(d) {
      let svg = d3.select(this)
      var datapoints = d.values
      datapoints.push(datapoints[0])

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'red')
        .attr('stroke', 'none')
        .attr('opacity', 0.5)

      let bands = [20, 40, 60, 80, 100]
      let bandsShown = [20, 60, 100]

      svg
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      svg
        .selectAll('.scale-text')
        .data(bandsShown)
        .enter()
        .append('text')
        .attr('class', 'scale-text')
        .text(d => d + '°')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -2)
        .attr('font-size', 7)

      svg
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('y', 0)
        .attr('font-weight', '600')
    })
}
