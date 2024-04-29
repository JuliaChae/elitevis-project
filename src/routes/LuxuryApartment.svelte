<!-- routes/+page.svelte -->

<script>
  let selectedApartment = "";
  let userGuess = 0; // Initialize user's guess
  let answered = false; // Initialize the answered state
  const luxuryApartments = ["One Dalton", "Mandarin Oriental", "Millenium Tower",
													 "50 Liberty", "Pier 4"];
	const numofstuds = {
    "One Dalton": 18,
    "Mandarin Oriental": 15,   
    "Millenium Tower": 19,
		"50 Liberty": 7,
		"Pier 4": 8
  };
	
  const apartmentStickFigures = {
    "One Dalton": "👨‍🎓".repeat(19), // Stick figure representation for One Dalton
    "Mandarin Oriental": "👨‍🎓".repeat(15),   
    "Millenium Tower": "👨‍🎓".repeat(19),
		"50 Liberty": "👨‍🎓".repeat(7),
		"Pier 4": "👨‍🎓".repeat(8)
  };

  function updateSelectedApartment(event) {
    selectedApartment = event.target.value;
    answered = false; // Reset answered state when apartment is changed
  }

  function updateUserGuess(event) {
    userGuess = parseInt(event.target.value);
  }

  function calculateDifference(apartment) {
    const actualCount = numofstuds[apartment];
    return Math.abs(actualCount - userGuess);
  }

  function submitGuess() {
    answered = true; // Set answered state to true after user submits guess
  }
</script>

<style>
</style>

<main>
  <div class="container" id="minigame">
    <h1>How many grad students do you think one luxury unit can support?</h1>

    <select on:change={updateSelectedApartment}>
      <option value="">Select Luxury Apartment</option>
      {#each luxuryApartments as apartment}
        <option value={apartment}>{apartment}</option>
      {/each}
    </select>

    {#if selectedApartment}
      {#if !answered}
        <input type="number" placeholder="Your guess (in hundreds)" on:input={updateUserGuess}>
        <button on:click={submitGuess}>Submit</button>
      {:else}
        <div class="stick-figure">
          {@html apartmentStickFigures[selectedApartment]}
        </div>
        <p>You were off by {calculateDifference(selectedApartment)} hundred grad students!</p>
        <p>The sale price for 1 condo here can pay for {numofstuds[selectedApartment]} hundred grad students' yearly rent!</p>
      {/if}
    {:else}
      <p>Please select a luxury apartment from the dropdown.</p>
    {/if}

    <div class="blurb">
      * We used the average yearly rent for a graduate student living in MIT graduate housing, which was $18,000.
    </div>
  </div>
</main>
