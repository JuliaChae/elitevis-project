<!-- App.svelte -->

<script>
  import LuxuryApartment from './LuxuryApartment.svelte';
  import SquareFootage from './SquareFootage.svelte';
  import HomeBuyers from './HomeBuyersGuide.svelte';
  import PredictiveTool from './PredictiveTool.svelte';
</script>

<main>
  <div class="title-page">
      <h1>Understanding Boston's<br>Speculative Investment Landscape</h1>
      <p class="team-name">EliteVisTeam</p>
      <p class="team-name">Jenny, Shelley, Kimia, Julia</p>
      <hr class="separator">
  </div>
  <div class="text-container">
    <h1>Are you interested in buying in Boston?</h1>
    <p>Welcome! As one of the oldest cities in America, Boston is a charming city with over 300 years of history. The city is home to 
    beautiful cobblestone streets, historic sites, world-clas educational institutions, as well as over 20 distinct neighborhoods, each 
    with its own characteristics and charm. In this web page, we will help you gain a better understanding of the Boston housing market,
    with a specific dive into the spculative investor activites across the city. </p>
  </div>

  <div class="text-container" id="caption">
    <p>Check out this game to see how Boston compares to other metropolitan cities in the US!</p>
  </div>

  <SquareFootage />
  
  <div class="text-container">
    <p>As you probably noticed from above, unfortunately Boston is not the most affordable city to live in for an 
    average American. Although new buildings are homes are being added to the city, many high-rises that are being built in are not 
    affordable for those in need of housing. As highlighted by the Boston Globe, Boston is experiencing a housing crisis simultaneously with the luxury building boom.  </p>
  </div>
  <div class="text-container" id="caption">
    <p>Curious about the jaw-dropping costs of some of the upscale luxury buildings? Explore our minigame below to discover the surprising number of Boston's graduate students 
    who could afford a year's rent with just the price of one luxurious unit.</p>
  </div>

  <LuxuryApartment />

  <div class="text-container">
    <p>Many of these luxury buildings are actually home to part-time residents or speculative investors, and not full-time Boston residents! </p>
  </div>
  <div class="text-container" id="caption">
    <p>"A lot of these condos aren't homes, these are safety deposits in the sky" - Chuck Collins, author and program director at the Institute for Policy Studies</p>
  </div>

  <div class="container">
    <img src = "PrinceofDarkness_Comic.jpg" alt="" style="width: 1200px;"/>
  </div>

  <div class="text-container">
    <p>In the present-day Boston housing market, an annual income of nearly $200,000 is necessary for a median-priced home (Homes for Profit). Through analyzing residential sales transactions, our research finds that 21% of residential properties sold in Greater Boston in the period from 2004 through 2018 were purchased by an investor (Homes for Profit).</p>
  </div>
  <HomeBuyers />
  <PredictiveTool />

  <div class="text-container">
    <p>As a next step, you may be curious about investment activity and price trends for the zipcode you are interested in buying in. In order to allow users to see the exact zip code they would like to buy in, we allow for the map to highlight zip codes of interest and focus on the recent speculative investment trends.</p>
  </div>
  <div class="container">
    <img src = "map.png" alt="" style="width: 1200px;"/>
  </div>
</main>

<style>
  /* Include global styles here if needed */
</style>
