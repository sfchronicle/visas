require("component-responsive-frame/child");

var d3 = require('d3');
var Sankey = require('./lib/d3.chart.sankey');

var colors = {

      'santaclara': '#6C85A5',
      'sanfrancisco': '#D13D59',
      //'alamedacounty': '#D04B61',
      'sanmateo': '#889C6B',

      'amazon': '#996B7D',
      'adobe': '#A89170',
      'apple': '#61988E',
      'cisco': '#6E7B8E',
      'deloitte': '#80A9D0',
      'facebook': '#FFE599',
      'google': '#FFCC32',
      'hclamerica': '#99B4CF',
      'hclglobal': '#99B4CF',
      'infosys': '#E89EAC',
      'intuit': '#9FA7B3',
      'juniper': '#E59FA6',
      'mindtree': '#61988E',
      'mphasis': '#846A6A',
      'oracle': '#EB8F6A',
      'pwc': '#6F7D8C',
      'synopsys': '#DE8067',
      'tata': '#667A96',
      'uber': '#FFE599',
      'wipro': '#9C8B9E',
      'zensar': '#D04B61',
      'nvidia': '#996B7D',
      'samsung': '#DE8067',

      '<$50k': '#493843',
      '$50-100k': '#80A9D0',
      '$100-$150k': '#DE8067',
      '>$150k': '#FFE599',

      'fallback': 'red'

    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

h1bData.forEach(function (d) {
  graph.nodes.push({ "name": d.source });
  graph.nodes.push({ "name": d.target });
  graph.nodes.push({ "name": d.pay_category });

  graph.links.push({ "source": d.source,
                     "target": d.target,
                     "value": +d.value });
   graph.links.push({ "source": d.target,
                      "target": d.pay_category,
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

var chart = d3.select("#sankey-graph").append("svg").chart("Sankey.Path");
chart
  .name(label)
  .colorNodes(function(name, node) {
    return color(node, 1) || colors.fallback;
  })
  .colorLinks(function(link) {
    return color(link.source, 4) || color(link.target, 1) || colors.fallback;
  })
  .nodeWidth(20)
  .nodePadding(5)
  .spread(true)
  .iterations(0)
  .draw(graph);

function label(node) {
  if (node.name == "SAN FRANCISCO") {
    return node.name + " (11K)";
  } else if (node.name == "SANTA CLARA") {
    return node.name + " (46K)"
  } else if (node.name == "SAN MATEO") {
    return node.name + " (6K)"
  } else {
    return node.name;
  }
}

function color(node, depth) {
  var id = node.name.toLowerCase().split(" ").join("");
  if (colors[id]) {
    return colors[id];
  } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
    return color(node.targetLinks[0].source, depth-1);
  } else {
    return null;
  }
}
