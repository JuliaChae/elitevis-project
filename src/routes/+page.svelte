<!-- App.svelte -->

<script>
  import LuxuryApartment from './LuxuryApartment.svelte';
  import SquareFootage from './SquareFootage.svelte';
  import Motivation from './Motivation.svelte';
  import HomeBuyers from './HomeBuyersGuide.svelte';
  import Transition1 from './Minigame2Transition.svelte';
  import Transition2 from './DataComicTransition.svelte';

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Perform further operations with the selected file
      console.log("Selected file:", file);
    }
  }
</script>

<main>
    <div class="title-page">
        <h1>Understanding Boston's Speculative Investment Landscape</h1>
        <p class="team-name">EliteVisTeam</p>
        <hr class="separator">
    </div>
  <Motivation />
  <SquareFootage />
  <Transition1 />
  <LuxuryApartment />
  <Transition2 />
  <HomeBuyers />
</main>

<style>
  /* Include global styles here if needed */
</style>
