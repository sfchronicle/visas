// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
//var d3 = require("d3/d3.js");

// var d3 = require('d3');
// var Sankey = require('d3.chart.sankey');
//
// var g = d3.select('svg').append('g');
// var chart = new Sankey(g);

var colors = {
      'environment':         '#edbd00',
      'social':              '#367d85',
      'animals':             '#97ba4c',
      'health':              '#f5662b',
      'research_ingredient': '#3f3e47',
      'fallback':            '#9f9fa3'
    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

h1bData.forEach(function (d) {
  var pay_category = "";
  if (d.pay < 50000) {
    pay_category = "<50K";
  } else if (d.pay >= 50000 && d.pay < 100000) {
    pay_category = "between 50K and 100K";
  } else if (d.pay >= 100000 && d.pay < 150000) {
    pay_category = "between 100K and 150K";
  } else {
    pay_category = ">150K";
  }
  graph.nodes.push({ "name": d.source });
  graph.nodes.push({ "name": d.target });
  graph.links.push({ "source": d.source,
                     "target": d.target,
                     "value": +d.value });
   graph.nodes.push({ "name": pay_category });
   graph.links.push({ "source": d.target,
                      "target": pay_category,
                      "value": +d.value });
 });

 // return only the distinct / unique nodes
 graph.nodes = d3.keys(d3.nest()
   .key(function (d) { return d.name; })
   .map(graph.nodes));

 // loop through each link replacing the text with its index from node
 graph.links.forEach(function (d, i) {
   graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
   graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
 });

 //now loop through each nodes to make nodes an array of objects
 // rather than an array of strings
 graph.nodes.forEach(function (d, i) {
   graph.nodes[i] = { "name": d };
 });

 console.log("graph is:");
 console.log(graph);

var chart = d3.select("#sankey-graph").append("svg").chart("Sankey.Path");
chart
  .name(label)
  .colorNodes(function(name, node) {
    return color(node, 1) || colors.fallback;
  })
  .colorLinks(function(link) {
    return color(link.source, 4) || color(link.target, 1) || colors.fallback;
  })
  .nodeWidth(15)
  .nodePadding(10)
  .spread(true)
  .iterations(0)
  .draw(graph);

function label(node) {
  return node.name.replace(/\s*\(.*?\)$/, '');
}

function color(node, depth) {
  console.log(node);
  // var id = node.id.replace(/(_score)?(_\d+)?$/, '');
  // if (colors[id]) {
  //   return colors[id];
  // } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
  //   return color(node.targetLinks[0].source, depth-1);
  // } else {
    return null;
  // }
}
