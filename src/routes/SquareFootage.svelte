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
    const city = selectedCity; // No need to parse as an integer
    const scale = 20; // Scaling factor for better visualization
    const size = squareFootage[city] * scale; /* each square foot is represented by 20 units in the SVG. */
    const xPosition = 325;
    const house = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    house.setAttribute('d', `M 325 10
                              L ${xPosition - size} 50
                              L ${xPosition + size} 50
                              Z
                              M ${xPosition - size * 0.6} 50
                              L ${xPosition - size * 0.6} ${xPosition + size * 0.6}
                              L ${xPosition + size * 0.6} ${xPosition + size * 0.6}
                              L ${xPosition + size * 0.6} 50
                              Z`);
    house.setAttribute('fill', 'lightgoldenrodyellow');
    svg.appendChild(house);
  }
</script>

<main>
<div class="container" id="minigame">
  <h1>How many square ft is equivalent to 500 sq ft. in Boston?</h1>
  <div class="box">
    <select bind:value={selectedCity}>
      <option value="">Select City</option>
      {#each citys as city}
        <option value={city}>{city}</option>
      {/each}
    </select>
    <button on:click={drawHouse}>Draw House</button>
    <svg id="svg-container" width="5000" height="200"></svg>
    {#if selectedCity}
      <p>{squareFootage[selectedCity] * 100} sqft in {selectedCity}.</p>
    {/if}
  </div>
  <div class="blurb">
    *we represent each sq ft with 20 units in the svg. data are from: https://homebay.com/price-per-square-foot-2023/*
  </div>
</div>
</main>

<style>
</style>
