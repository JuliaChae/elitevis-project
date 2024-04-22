<!-- App.svelte -->

<script>
  import LuxuryApartment from './LuxuryApartment.svelte';
  import SquareFootage from './SquareFootage.svelte';
  import Motivation from './Motivation.svelte';
</script>

<main>
    <div class="title-page">
        <h1>Understanding Boston's Speculative Investment Landscape</h1>
        <p class="team-name">VisTeam</p>
        <hr class="separator">
    </div>
  <div class="subtitle-page">
    <h1>Motivation</h1>
  </div>
  <Motivation />
  <div class="subtitle-page">
    <h1>Boston Housing Market Mini Games</h1>
  </div>
  <LuxuryApartment />
  <SquareFootage />
</main>

<style>
  /* Include global styles here if needed */
</style>
