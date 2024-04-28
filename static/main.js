/**
 * Load data from CSV file asynchronously and render scatter plot
 */
console.log("WE ARE IN MAIN.JS")
let data, scrollerVis;
d3.csv('data/vancouver_trails.csv').then(_data => {
  data = _data;
  data.forEach(d => {
    d.distance = +d.distance;
  });

  // Update text on the web page based on the loaded dataset
  d3.select('#hikes-count').text(data.length);
  d3.select('#easy-hikes-count').text(data.filter(d => d.difficulty == 'Easy').length);
  d3.select('#difficult-hikes-count').text(data.filter(d => d.difficulty == 'Difficult').length);

  const longestHike = [...data].sort((a,b) => b.time - a.time)[0];
  d3.select('#max-duration').text(longestHike.time);
  d3.select('#max-duration-trail').text(longestHike.trail);

  // Initialize visualization
  scrollerVis = new ScrollerVis({ parentElement: '#vis'}, data); // this is where the vis element is created.
  
  // Create a waypoint for each `step` container
  const waypoints = d3.selectAll('.step').each( function(d, stepIndex) {
    return new Waypoint({
      // `this` contains the current HTML element
      element: this,
      handler: function(direction) {
        // Check if the user is scrolling up or down
        const nextStep = direction === 'down' ? stepIndex : Math.max(0, stepIndex - 1)
        
        // Update visualization based on the current step
        scrollerVis.goToStep(nextStep);
      },
      // Trigger scroll event halfway up. Depending on the text length, 75% might be even better
      offset: '50%',
    });
  });
})
.catch(error => console.error(error));
