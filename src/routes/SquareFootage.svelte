<!-- SquareFootage.svelte -->

<script>
  let selectedCity = "";
  const citys = ["Boston", "Cleveland", "Pittsburgh", "NYC", "Los Angeles", "Charlotte"];
  const squareFootage = {
    "Boston": 5,
    "Cleveland": 13,
    "Pittsburgh": 12,
    "NYC": 4,
    "Los Angeles": 3,
    "Charlotte": 8
  };

  function drawHouse() {
    const svg = document.getElementById('svg-container');
    svg.innerHTML = ''; // Clear previous drawings

    const city = selectedCity;
    const scale = 20; // Scaling factor for better visualization
    const size = squareFootage[city] * scale; // Selected city's house size
    const bostonSize = squareFootage["Boston"] * scale; // Boston's house size

    // Draw the selected city's house
    const xPositionCity = 250;
    const houseCity = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    houseCity.setAttribute('d', `M ${xPositionCity} 10
                                 L ${xPositionCity - size} 50
                                 L ${xPositionCity + size} 50
                                 Z
                                 M ${xPositionCity - size * 0.6} 50
                                 L ${xPositionCity - size * 0.6} ${xPositionCity + size * 0.6}
                                 L ${xPositionCity + size * 0.6} ${xPositionCity + size * 0.6}
                                 L ${xPositionCity + size * 0.6} 50
                                 Z`);
    houseCity.setAttribute('fill', 'lightgoldenrodyellow');
    svg.appendChild(houseCity);

    // Draw Boston's house for comparison
    const xPositionBoston = 700;
    const houseBoston = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    houseBoston.setAttribute('d', `M ${xPositionBoston} 10
                                   L ${xPositionBoston - bostonSize} 50
                                   L ${xPositionBoston + bostonSize} 50
                                   Z
                                   M ${xPositionBoston - bostonSize * 0.6} 50
                                   L ${xPositionBoston - bostonSize * 0.6} ${xPositionBoston + bostonSize * 0.6}
                                   L ${xPositionBoston + bostonSize * 0.6} ${xPositionBoston + bostonSize * 0.6}
                                   L ${xPositionBoston + bostonSize * 0.6} 50
                                   Z`);
    houseBoston.setAttribute('fill', 'lightgoldenrodyellow');
    svg.appendChild(houseBoston);
  }
</script>

<div class="container">
  <h1>how many square ft is equivalent to 500 sq ft. in Boston?</h1>
  <select bind:value={selectedCity}>
    {#each citys as city}
      <option value={city}>{city}</option>
    {/each}
  </select>
  <button on:click={drawHouse}>Draw House</button>
  <svg id="svg-container" width="5000" height="200"></svg>
  {#if selectedCity}
    <p><span style="margin-left: 100px;">{squareFootage[selectedCity] * 100} sqft in {selectedCity}  <span style="margin-left: 400px;"> 500 sqft in Boston</span></p>
  {/if}

	<div class="blurb">
    *we represent each sqft with 20 units in the SVG (data from: https://homebay.com/price-per-square-foot-2023/)*
  </div>
</div>

<style>
</style>
