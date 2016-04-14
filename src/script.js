var data;

var margin = { top: 20, right: 150, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, height]);

// fix labels
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5)
    .tickFormat(d3.time.format('%M:%S'))

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);

var chart = d3.select('.chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('class', 'container')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var div = d3.select('body')
    .append('div')
    .attr('class', 'info')
    .style('opacity', 0)
    .style('left', 600 + 'px')
    .style('top', (height / 2 + 100) + 'px')
    .style('width', 300 + 'px')

d3.json('cyclist-data.json', function(error, json) {
    if (error) return console.warn(error);

    data = json;

    var fastest = d3.min(data, function(d) {
        var time = d.Time.split(':');
        return new Date(null, null, null, null, time[0], time[1])
    })

    x.domain([(d3.max(data, function(d) {
        var time = d.Time.split(':');
        return new Date(null, null, null, null, time[0], time[1])
    }) - fastest) + 4000, 0]);
    y.domain([0, d3.max(data, function(d) { return d.Place }) + 1]);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      .append('text')
        .attr('x', width - 10)
        .attr('y', -6)
        .attr('dx', '.71em')
        .style('text-anchor', 'end')
        .text('Minutes and seconds behind the fastest time')

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Ranking');

    chart.append('g')
        .attr('class', 'title')
      .append('text')
        .attr('y', 20)
        .attr('x', width / 2)
        .style('text-anchor', 'middle')
        .text('Doping Allegations in International Cycling');

    var rider = chart.selectAll('.data')
        .data(data)
      .enter().append('g')
        .attr('class', 'data')
        .on('mouseover', function(d) {
            div.transition()
                .duration(0)
                .style('opacity', .9);
            div .html(function() {
                var info;
                var text = '<span>' + d.Name + ', ' + d.Nationality + ' (' + d.Year + ')</span><br>' +
                        'Place: ' + d.Place + ', Time: ' + d.Time + '<br>'
                if (d.Doping !== '') {
                    text += '<p>' + d.Doping + '</p>'
                }
                return text;
            })
        })
        .on('mouseout', function(d) {
            div.transition()
                .duration(0)
                .style('opacity', 0)
        })

    var circle = rider.append('circle')
        .attr('cx', function(d) {
            var time = d.Time.split(':');
            var behind = new Date(null, null, null, null, time[0], time[1]) - fastest
            return x(behind);
        })
        .attr('cy', function(d) { return y(d.Place); })
        .attr('r', 5)
        .style('fill', function(d) {
            if (d.Doping == "") {
                return '#066217'
            } else {
                return '#952020'
            }
        })

    var name = rider.append('text')
        .attr('x', function(d) {
            var time = d.Time.split(':');
            var behind = new Date(null, null, null, null, time[0], time[1]) - fastest
            return x(behind) + 12;
        })
        .attr('y', function(d) { return y(d.Place) + 4})
        .attr('class', 'name')
        .text(function(d) { return d.Name })
    })
