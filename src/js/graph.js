require("component-responsive-frame/child");

var d3 = require('d3');
var Sankey = require('./lib/d3.chart.sankey');

var colors = {

      'santaclaracounty': '#6C7687',
      'sanfranciscocounty': '#64403E',
      'alamedacounty': '#CDC776',
      'sanmateocounty': '#97AAC9',

      'a2zdevelopment': '#C9CEBD',
      'adobe': '#B2BCAA',
      'apple': '#838E83',
      'cisco': '#6C6061',
      'deloitte': '#996B7D',
      'facebook': '#FDE8E9',
      'google': '#E3BAC6',
      'hclamerica': '#BC9EC1',
      'hclglobal': '#596475',
      'infosys': '#828FA3',
      'intuit': '#EEF0F2',
      'juniper': '#C6C7C4',
      'mindtree': '#A2999E',
      'mphasis': '#846A6A',
      'oracle': '#353B3C',
      'pwc': '#6F7D8C',
      'synopsys': '#7C7C7C',
      'tata': '#EEE5E9',
      'uber': '#383D3B',
      'wipro': '#9C8B9E',
      'zensar': '#A0B2A6',
      'nvidia': '#CBBFBB',
      'samsung': '#61988E',

      '<50k': '#493843',
      '100k-50k': '#A2999E',
      '150k-100k': '#996B7D',
      '>150k': '#838E83',

      'fallback': 'red'

    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

h1bData.forEach(function (d) {
  var pay_category = "";
  if (d.pay < 50000) {
    pay_category = "< 50K";
  } else if (d.pay >= 50000 && d.pay < 100000) {
    pay_category = "100K - 50K";
  } else if (d.pay >= 100000 && d.pay < 150000) {
    pay_category = "150K - 100K";
  } else {
    pay_category = "> 150K";
  }
  graph.nodes.push({ "name": d.source });
  graph.nodes.push({ "name": d.target });
  graph.nodes.push({ "name": pay_category });

  // graph.nodes.push({ "total": 10 });
  // graph.nodes.push({ "total": 10 });
  // graph.nodes.push({ "total": 10 });

  graph.links.push({ "source": d.source,
                     "target": d.target,
                     "value": +d.value });
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
  .nodePadding(10)
  .spread(true)
  .iterations(0)
  .draw(graph);

function label(node) {
  console.log(node.name);
  if (node.name == "SAN FRANCISCO COUNTY") {
    return node.name + "(1770)";
  } else if (node.name == "SANTA CLARA COUNTY") {
    return node.name + "(10465)"
  } else if (node.name == "SAN MATEO COUNTY") {
    return node.name + "(1681)"
  } else {
    return node.name;
  }
  //return [node.name + "(" node.total + ")"];
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
