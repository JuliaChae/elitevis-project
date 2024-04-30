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
    <h1>Boston is experiencing a housing crisis simultaneously with the luxury building boom...</h1>
    <div class="text-container">
      <p>which makes finding an affordable home tougher than ever for the average Bostonion.</p>

      <p>In the present-day Boston housing market, an annual income of nearly $200,000 is necessary for a median-priced home (Homes for Profit).
        Luxury buildings are being developed up all across Boston, but many of these buildings are home to part-time residents and foreign investors: not full-time Bostonions.</p>
      
      <p>This data comic shows a story of a young boy Timmy and his mother, as they stroll by the Four Seasons One Dalton. 
        Timmy notices immediately that many of the windows in the building are dark. 
        Back at home, Timmy is upset over the fact that he has to share a bed with all of his siblings, 
        while his mother struggles in silence between paying next month’s rent and paying her childrens' health insurance. In the final panel, 
        the single mother decides Boston has gotten much too expensive and, alas, makes a difficult decision to move her family out.</p>
    </div>

    <div class="container">
      <img src = "public/PrinceofDarkness_Comic.jpg" alt="" style="width: 1200px;"/>
    </div>

    <div class="text-container" id="caption">
      <p>"A lot of these condos aren't homes, these are safety deposits in the sky" - Chuck Collins, author and program director at the Institute for Policy Studies</p>
    </div>

    <h1>Are you interested in buying in Boston?</h1>

    <p>You've come to the right place! In this web page, we will help you gain a better understanding of the Boston housing market,
      with a specific dive into the spculative investor activites across the city. </p>

    <p>Are you new to Boston? Let's start by comparing Boston to some other famous cities in the U.S.</p>
  </div>

  <div class="text-container" id="caption">
    <p>Take a Guess: Use the dropdown menu to select a major U.S. city, seeing how big of a place you can own 
      if you had the equivalent of 500 sq ft. in Boston!</p>
  </div>

  <SquareFootage />
  
  <div class="text-container" id="caption">
    <p>As you have probably noticed from above, unfortunately Boston is not the most affordable city to live in for an 
    average American. Although new buildings are homes are being added to the city, many high-rises that are being built in are not 
    affordable for those in need of housing.</p>
  </div>

  <div class="text-container" id="caption">
    <p>Curious about the jaw-dropping costs of some of the upscale luxury buildings? Take a wild guess below to discover how many MIT graduate students 
    could afford a year's rent with just the price of one luxurious unit.</p>
  </div>

  <LuxuryApartment />

  <div class="text-container" id="caption">
    <p>Scroll to find out some surprising general trends about investor activity in Boston zipcodes as a whole.</p>
  </div>
  <HomeBuyers />

  <PredictiveTool />

  <div class="text-container">
    <p>As a next step, you may be curious about investment activity and price trends for the zipcode you are interested in buying in. In order to allow users to see the exact zip code they would like to buy in, we allow for the map to highlight zip codes of interest and focus on the recent speculative investment trends.</p>
  </div>
  <div class="container">
    <img src = "map.png" alt="" style="width: 1200px;"/>
  </div>

  <div class="text-container">
    <h1>Resources for New Homebuyers</h1>
    <p>Learn More About Buying in Boston with these resources (we’ve compiled these resources to be especially user-friendly for first-time home buyers navigating the Boston housing market!)</p>
    <ol>
      <li>Here is a great resource that lets you set a realistic budget for your first-time homebuyer experience: <a href="https://kingstonrem.com/essential-tips-for-first-time-homebuyers-in-the-boston-housing-market/">Essential Tips for First Time Boston Homebuyers</a> </li>
      <li>Here is an ultimate guide to Boston home-buying and renting intended for students and young individuals: <a href="https://kingstonrem.com/the-ultimate-guide-to-student-rentals-in-cambridge-what-you-need-to-know/">Ultimate Guide to Student Homebuying and Rentals</a></li>
      <li>This resource provides Boston first-time homebuyers with a great towards a downpayment: <a href="https://www.boston.gov/first-time-homebuyer-program">First-time Homebuyers Program</a></li>
    </ol>
  </div>

</main>

<style>
  /* Include global styles here if needed */
</style>
