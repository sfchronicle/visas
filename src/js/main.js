// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var d3 = require("d3/d3.min.js");

if (screen.width > 768) {
  var diameter = 500,
      dropdown = document.querySelector("select");
  var margin = {
    right: 15,
    left: 15
  }
  var topbuffer = 20;
} else if (screen.width <= 768 && screen.width > 480) {
  var diameter = 500,
      dropdown = document.querySelector("select");
  var margin = {
    right: 15,
    left: 15
  }
  var topbuffer = 20;
} else if (screen.width <= 480) {
  var diameter = 360,
      dropdown = document.querySelector("select");
  var margin = {
    right: 5,
    left: 5
  }
  var topbuffer = 20;
}

var width = diameter-margin.left-margin.right;
var height = diameter-topbuffer; //because the bubbles aren't arranged so they're square

var svg = d3.select(".bubbles").append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + 0 + ")"); // giving the bubbles some padding, so that the text won't get cut off on the right and left margins

var bubble = d3.layout.pack()
    //.sort(null)
    .sort(function(a, b) {
      return -(a.value - b.value);
    }) // sorting from biggest to smallest
    .size([width, height])
    .padding(2)
    .value(d => d.Visas);

// show tooltip
var tooltip = document.querySelector(".tooltip");
var looping = true;

var showTooltip = function(d, target) {
  if (!looping) {
    svg.selectAll('.node').selectAll("circle")

      .style("fill", function(d) {
        if (d.Continent == "Europe") {
          return "#F79980"//"#99D4B5"
        } else if (d.Continent == "Asia") {
          return '#869FBF'//"#97BAB2"
        } else if (d.Continent == "North America"){
          return '#A2B685'//"#CAFFB9"
        } else if (d.Continent == "South America"){
          return '#FFE64C'//"#94C661"
        } else if (d.Continent == "Oceania"){
          return '#9C8B9E'//"#C0D461"
        }
      } )
    d3.select(target.querySelector("circle")) //darker colors on hover
        .style("fill", function(d) {
          if (d.Continent == "Europe") {
            return "#DE8067"//"#99D4B5"
          } else if (d.Continent == "Asia") {
            return '#6D86A6'//"#97BAB2"
          } else if (d.Continent == "North America"){
            return '#899D6C'//"#CAFFB9"
          } else if (d.Continent == "South America"){
            return '#E6CD33'//"#94C661"
          } else if (d.Continent == "Oceania"){
            return '#837285'//"#C0D461"
          }
      })

    // tooltip info
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
          return "#F79980"//"#99D4B5"
        } else if (d.Continent == "Asia") {
          return '#869FBF'//"#97BAB2"
        } else if (d.Continent == "North America"){
          return '#A2B685'//"#CAFFB9"
        } else if (d.Continent == "South America"){
          return '#FFE64C'//"#94C661"
        } else if (d.Continent == "Oceania"){
          return '#9C8B9E'//"#C0D461"
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
        return "#F79980"//"#99D4B5"
      } else if (d.Continent == "Asia") {
        return '#869FBF'//"#97BAB2"
      } else if (d.Continent == "North America"){
        return '#A2B685'//"#CAFFB9"
      } else if (d.Continent == "South America"){
        return '#FFE64C'//"#94C661"
      } else if (d.Continent == "Oceania"){
        return '#9C8B9E'//"#C0D461"
      }
    });

  // text for bubbles
  entering.append("text")
    .style("opacity", 0)
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size", "12px")
    .text(function(d) {
      if (d.Geography && (d.Geography.length*4 < d.r)) {
        return d.Geography.substring(0, d.r);
      } else if (d.Geography) {
        return d.Abbreviation;
      }
    });
    //.text(function(d) { if (d.Geography) { return d.Geography.substring(0, d.r); } });

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
  loop = setTimeout(tick, i == 0 ? 1700 : 1000);
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
