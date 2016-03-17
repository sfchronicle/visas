// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var d3 = require("d3/d3.min.js");

var diameter = 500,
    dropdown = document.querySelector("select");

var svg = d3.select(".bubbles").append('svg')
  .attr('width', diameter)
  .attr('height', diameter)

var bubble = d3.layout.pack()
    //.sort(null)
    .sort(function(a, b) {
      return -(a.value - b.value);
    })
    .size([diameter, diameter])
    .padding(1.5)
    .value(d => d.Visas);

// show tooltip
var tooltip = document.querySelector(".tooltip");
var looping = true;

var showTooltip = function(d, target) {
  if (!looping) {
    svg.selectAll('.node').selectAll("circle")
      .style("fill", function(d) {
        if (d.Continent == "Europe") {
          return "#AA3939"
        } else if (d.Continent == "Asia") {
          return "#669999"
        } else if (d.Continent == "North America"){
          return "#226666"
        } else if (d.Continent == "South America"){
          return "#55AA55"
        } else if (d.Continent == "Oceania"){
          return "#D46A6A"
        }
      } )
    d3.select(target.querySelector("circle"))
        .style("fill", function(d) {
          if (d.Continent == "Europe") {
          return "#912020"
        } else if (d.Continent == "Asia") {
          return "#4D8080"
        } else if (d.Continent == "North America"){
          return "#094D4D"
        } else if (d.Continent == "South America"){
          return "#3C913C"
        } else if (d.Continent == "Oceania"){
          return "#BB5151"
        }
      })

    tooltip.classList.add("show");
    tooltip.innerHTML = `
      <div>Country: ${d.Geography}</div>
      <div>Visas issued: ${d.Visas}</div>
    `;
  }
}

var hideTooltip = function(d, target) {
  if (!looping) {
    svg.selectAll('.node').selectAll("circle")
      .style("fill", function(d) {
        if (d.Continent == "Europe") {
          return "#AA3939"
        } else if (d.Continent == "Asia") {
          return "#669999"
        } else if (d.Continent == "North America"){
          return "#226666"
        } else if (d.Continent == "South America"){
          return "#55AA55"
        } else if (d.Continent == "Oceania"){
          return "#D46A6A"
        }
      })
    tooltip.classList.remove("show");
  }
}

// draw bubbles
var drawBubbles = function(selectedYear) {

  // transition time
  var duration = 700;

  // look at data for a specific year
  var yearData = visaData.filter(function(Geography) { return Geography.Year == selectedYear });

  // adding the nodes to the chart (automatically generate attributes)
  var nodes = bubble.nodes({children: yearData})
    .filter(d => !d.children); // filter out the outer bubble

  var node = svg.selectAll('.node')
    .data(nodes, d => d.Geography);

  // initializing the bubbles
  var entering = node.enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('class', 'node')
    .on("mouseenter", function(d) {
      showTooltip(d, this);
    })
    .on("mouseleave", function(d) {
      hideTooltip(d, this);
      tooltip.classList.remove("show");
    });

  // bubble attributes on rendering
  entering.append("circle")
    .attr("r", d => 0)
    .style('opacity', 1)
    .style("fill", function(d) {
      if (d.Continent == "Europe") {
        return "#AA3939"
      } else if (d.Continent == "Asia") {
        return "#669999"
      } else if (d.Continent == "North America"){
        return "#226666"
      } else if (d.Continent == "South America"){
        return "#55AA55"
      } else if (d.Continent == "Oceania"){
        return "#D46A6A"
      }
    });

  // text for bubbles
  entering.append("text")
    .style("opacity", 0)
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size", "10px")
    .text(function(d) { if (d.Geography) { return d.Geography.substring(0, d.r); } });

  // transition for bubble translation
  var transition = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })

  transition.select("circle").attr("r", d => d.r);
  transition.select("text").style("opacity", 1);

  var exiting = node.exit()
    .transition()
    .duration(duration);

  exiting.select("circle").attr("r", d => 0);
  exiting.select("text").style("opacity", 0);
  exiting.remove();
}

// fills in HTML for year as years toggle
var updateInfo = function(year) {
  document.querySelector(".info").innerHTML = `<strong>${year}</strong>`;
};

// if user picks the year, we update the selected mode and stop looping
dropdown.addEventListener("change", function() {
  document.querySelector(".start").classList.remove("selected");
  document.querySelector(".pause").classList.add("selected");
  looping = false;
  document.querySelector(".chart").classList.add("clickable");
  clearTimeout(loop);
  drawBubbles(dropdown.value);
  updateInfo(dropdown.value);
});

document.querySelector(".start").addEventListener("click", function(e) {
  if (looping) { return }
  document.querySelector(".start").classList.add("selected");
  document.querySelector(".pause").classList.remove("selected");
  looping = true;
  document.querySelector(".chart").classList.remove("clickable");
  dropdown.value = "--";
  tick();
})
document.querySelector(".pause").addEventListener("click", function(e) {
  if (!looping) { return }
  document.querySelector(".start").classList.remove("selected");
  document.querySelector(".pause").classList.add("selected");
  looping = false;
  document.querySelector(".chart").classList.add("clickable");
  clearTimeout(loop);
})

var years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];
//var years = [1997, 2005, 2010, 2014];
var i = 0;

var loop = null;
var tick = function() {
  drawBubbles(years[i]);
  updateInfo(years[i]);
  i = (i + 1) % years.length;
  loop = setTimeout(tick, i == 0 ? 1500 : 1000);
};

tick();

// get tooltip to move with cursor
document.querySelector(".bubbles").addEventListener("mousemove", function(e) {
  var bounds = this.getBoundingClientRect();
  var x = e.clientX - bounds.left;
  var y = e.clientY - bounds.top;
  tooltip.style.left = x + 10 + "px";
  tooltip.style.top = y + 10 + "px";

  tooltip.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
});
