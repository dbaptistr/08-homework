import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 300

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

let colorScale1 = d3.scaleSequential(d3.interpolateBlues)
let colorScale2 = d3.scaleSequential(d3.interpolateOranges)

var line = d3
  .radialArea()
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.time))

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  let hours = datapoints.map(d => d.time)
  angleScale.domain(hours)

  let total = datapoints.map(d => +d.total)
  let totMean = d3.mean(total)
  line.innerRadius(radiusScale(totMean))

  colorScale1.domain([55000, 25000])
  colorScale2.domain([14000, d3.max(total)])

  var container = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  var times = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ]

  container
    .selectAll('.hour-text')
    .data(times)
    .enter()
    .append('text')
    .text(d => {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('class', 'hour-text')
    .attr('fill', 'gray')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('transform', d => {
      let r = radiusScale(55000)
      let a = angleScale(d)

      let xPosition = Math.sin(a) * r
      let yPosition = Math.cos(a) * r * -1
      let rotation = (a / Math.PI) * 180
      return `translate(${xPosition}, ${yPosition})rotate(${rotation})`
    })

  container
    .selectAll('.hour-circle')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('fill', 'darkgray')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .attr('class', 'hour-circle')
    .attr('transform', d => {
      let r = radiusScale(60000)
      let a = angleScale(d)

      let xPosition = Math.sin(a) * r
      let yPosition = Math.cos(a) * r * -1
      let rotation = (a / Math.PI) * 180
      return `translate(${xPosition}, ${yPosition})rotate(${rotation})`
    })

  container
    .append('circle')
    .attr('r', radiusScale(60000))
    .attr('stroke', 'darkgray')
    .attr('stroke-width', 1)
    .attr('fill', 'none')
    .lower()

  container
    .datum(datapoints)
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .attr('fill', 'white')
    .attr('d', line)

  let bands = d3.range(90000, 0, -1400)
  // console.log(bands)
  container
    .selectAll('.color-bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('class', 'color-bands')
    .attr('r', d => radiusScale(d))
    .attr('fill', d => {
      if (d >= totMean) {
        return colorScale2(d)
      } else {
        return colorScale1(d)
      }
    })
    .attr('mask', 'url(#births)')

  container
    .append('text')
    .text('EVERYONE!')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('dy', -15)
    .attr('font-size', 25)
    .attr('font-weight', 'bold')

  container
    .append('text')
    .text('is born at 8 a.m.')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('dy', 5)
    .attr('font-size', 20)
    .attr('font-weight', 'bold')
}
