let movieDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let canvas = d3.select("#canvas");

const drawTreeMap = (movieData) => {
  let hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node.children;
    })
    .sum((node) => {
      return node.value;
    })
    .sort((node1, node2) => {
      return node2.value - node1.value;
    });

  const createTreeMap = d3.treemap().size([1000, 600]);

  const tooltip = d3.select("#tooltip");

  createTreeMap(hierarchy);

  let movieTiles = hierarchy.leaves();
  console.log(movieTiles);

  let block = canvas
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie.x0 + ", " + movie.y0 + ")";
    });

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie.data.category;
      switch (category) {
        case "Action":
          return "orange";
        case "Drama":
          return "lightgreen";
        case "Adventure":
          return "coral";
        case "Family":
          return "lightblue";
        case "Animation":
          return "pink";
        case "Comedy":
          return "khaki";
        case "Biography":
          return "tan";
        default:
          "";
      }
    })
    .attr("data-name", (movie) => movie.data.name)
    .attr("data-category", (movie) => movie.data.category)
    .attr("data-value", (movie) => movie.data.value)
    .attr("width", (movie) => movie.x1 - movie.x0)
    .attr("height", (movie) => movie.y1 - movie.y0)
    .on("mouseover", (e, movie) => {
      tooltip.transition().style("visibility", "visible");
      let revenue = movie.data.value;
      tooltip.html(`
        Title: ${movie.data.name} <br>
        Category: ${movie.data.category} <br>
        Revenue: ${revenue}
        `);
      tooltip.attr("data-value", movie.data.value);
    })
    .on("mouseleave", (e, movie) => {
      tooltip.style("visibility", "hidden");
    });

  block
    .append("text")
    .text((movie) => {
      return movie.data.name;
    })
    .attr("x", 5)
    .attr("y", 20);
};

d3.json(movieDataUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    const movieData = data;
    drawTreeMap(movieData);
  }

  const legend = d3.select("#legend");

  const colors = [
    "orange",
    "lightgreen",
    "coral",
    "lightblue",
    "green",
    "khaki",
    "tan",
  ];

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", 10)
    .attr("y", (d, i) => {
      return i * 40;
    })
    .attr("height", 40)
    .attr("fill", (d) => d);
});
