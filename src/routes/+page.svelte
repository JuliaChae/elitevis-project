<!-- App.svelte -->

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import LuxuryApartment from './LuxuryApartment.svelte';
  import SquareFootage from './SquareFootage.svelte';
  import HomeBuyers from './HomeBuyersGuide.svelte';
  import PredictiveTool from './PredictiveTool.svelte';
  import BostonZipCodeMapComplete from './BostonZipCodeMapComplete.svelte';
  // import BostonZipCodeMap from './BostonZipCodeMap.svelte';
  // import LineChart from './LineChart.svelte';
  // import { writable } from 'svelte/store';
  
  // let selectedZipCode = writable(null);
  // let lineChartData = writable([]);

  // onMount(async () => {
  //   const data = await d3.csv('../public/price.csv', d => ({
  //     year: +d.year,
  //     zip: d.zip,
  //     value: +d.price
  //   }));
  //   lineChartData.set(data);
  // });

  // let data = [];

  // onMount(async () => {
  //   data = await d3.csv('../public/price.csv', d => ({
  //     year: +d.year,
  //     zip: d.zip,  // Make sure these property names match your CSV column headers
  //     value: +d.price
  //   }));
  //   console.log(data); // Check what data looks like in the console
  // });

  // function handleZipSelect(zip) {
  //   selectedZipCode.set(zip);
  // }
</script>

<main>
  <div class="spacer"></div>
  <div class="title-page">
      <!-- <h1>Understanding Boston's<br>Speculative Investment Landscape</h1> -->
      <h1>A Homebuyer's Guide to<br>the Investment Landscape in Boston</h1>

      
      <p class="team-name">EliteVis Team</p>
      <p class="team-name">Jenny Huang, Shelley Choi, Kimia Hamidieh, Julia Chae</p>
      <hr class="separator">
  </div>

  <div class="text-container" id="caption">
      <h1>Are you interested in buying in Boston?</h1> 
      <p>You have come to the right place!<p>
  </div>

  <div class="text-container" id="box">
    <p>This webpage is an informative tool for <span class="emphasis">Boston homebuyers</span> 
    to learn more about the Boston housing market and understand <span class="emphasis">speculative investor 
    activity</span> trends in neighborhoods that they are interested in purchasing in.<p>
  </div>

  <div class="text-container" id="caption">
    <h1>Are you new to Boston?</h1>
    <p>Let's start by comparing Boston to some other famous cities in the U.S.</p>
    <p><span class="instructions">Take a Guess: Use the dropdown menu on the left to select a major U.S. city, then click "Draw House" to see how big of a place you can own 
      if you had the equivalent of 500 sq ft. in Boston!<span></p>
    </div>
  <SquareFootage />

  <div class="text-container" id="caption">
      <h1>As you may have noticed, Boston is not the most affordable metropolitan city in the US.</h1>
      <p>In fact, Boston is experiencing a housing crisis simultaneously with the luxury building boom… which makes finding an affordable home 
      tougher than ever for the average Bostonian.</p>
  </div>

  <div class="text-container" id="caption">
      <h1>Curious about the jaw-dropping costs of some of the upscale luxury buildings in Boston?</h1>
      <p>Take a wild guess below to discover how many MIT graduate students could afford a year's rent with just the price of one luxurious unit. </p>
      <p><span class="instructions">Select a luxury apartment from the dropdown, enter your guess in hundreds of grad students in the text box and click submit to find out!<span></p>
  </div>
  <LuxuryApartment />

  <div class="text-container" id="caption">
      <h1>You may be wondering, who can afford such an expensive property?</h1>
      <p>Boston housing market, an annual income of nearly $200,000 is necessary for a median-priced home (Homes for Profit). 
      Luxury buildings are being developed all across Boston, but many of these buildings are home to part-time residents and foreign investors - not full-time Bostonians. 
      This is the effect of <span class="emphasis">speculative residential investment</span>.</p>
  </div>

  <div class="text-container" id="box">
    <p><span class="emphasis">Speculative residential investment:</span> practice under which housing is primarily treated as a market investment - one to be bought, sold, and flipped in order to maximize profits <p>
  </div>

  <div class="text-container">
    <h2>Some impact of investors include:</h2>
    <ul>
        <li>Investors may compete with residents to take <span class="emphasis">desirable properties off the market</span></li>
        <li>Investors buy buildings and <span class="emphasis">hike up</span> rents, or <span class="emphasis">evict</span> residents without cause</li>
        <li>Investors often <span class="emphasis">flip buildings</span>, purchasing affordable properties and converting them to be less affordable to local residents</li>
        <li>Neighborhoods with more investor activity are more likely to <span class="emphasis">gentrify</span></li>
    </ul>
  </div>

  <div class="text-container" id="caption">
      <p>This data comic follows one example of how speculative investors can affect the lives of local residents. 
      In this comic, Timmy and his mother pass by the Four Seasons One Dalton, noticing the dark windows. 
      Later, Timmy expresses frustration about sharing a bed with his siblings, while his mother silently grapples with financial burdens. 
      Ultimately, they decide to move out of Boston due to its high cost of living.</p>
  </div>

  <div class="container">
    <img src = "PrinceofDarkness_Comic.jpg" alt="" style="width: 1200px;"/>
  </div>

  <div class="text-container" id="caption">
    <h1>"A lot of these condos aren't homes, these are safety deposits in the sky" </h1>
    <p>-Chuck Collins, author and program director at the Institute for Policy Studies</p>
  </div>

  <div class="text-container" id="caption">
    <p>As shown by Timmy, <span class="emphasis">speculative investment activity</span> can affect various characteristics of a residential neighborhood. 
    Interestingly, the investment rate is also <span class="emphasis">not evenly distributed across the city of Boston.</span></p>
    <p><span class="instructions">Scroll below to learn more about some surprising general trends about investor activity in Boston zip codes as a whole:<span></p>
  </div>

  <HomeBuyers />
  
  <div class="text-container" id="caption">
    <p>In the remainder of our webpage, we will allow <span class="emphasis">you</span> to explore speculative investment activity trends in areas of Boston that <span class="emphasis">you are interested in</span>. By exploring the data behind speculative activities in different Boston zip codes, you will gain a deeper understanding of the evolving local real estate market dynamics, gauge the influence of investors, and be able to make more informed decisions about your long-term purchase. </p>
    <p><span class="instructions">In order to learn about real estate trends in specific ZIP codes in Boston, click on the areas you are curious about on the map! 
      After clicking, hover over the line graphs to take a look at the exact prices and investor activities.<span></p>
    <p><span class="instructions">Note, only those ZIP codes that have data from the MAPC residential sales dataset are clickable!<span></p>
  </div>
  <div class="content-layout">
    <BostonZipCodeMapComplete />
    <!-- <BostonZipCodeMap on:selectZip={handleZipSelect} /> -->
    <!-- <LineChart {lineChartData} bind:selectedZipCode /> -->
    <!-- <LineChart {lineChartData} bind:selectedZipCode={$selectedZipCode} /> -->
    <!-- <LineChart {data} /> -->
    <!-- <LineChart {data} /> -->
  </div>
  <!-- <div class="container">
    <img src = "map.gif" alt="" style="width: 1200px;"/>
  </div> -->
  <div class="spacer"></div>
  <div class="spacer"></div>
  <div class="spacer"></div>
  <div class="spacer"></div>

  <div class="text-container" id="caption">
    <p>As a homebuyer, you may be interested in <span class="emphasis">several neighborhoods in Boston</span>. 
    Our comparitive tool allows for a side-by-side comparison of, not only the level of speculative real estate investment activities 
    in different neighborhoods, but also other characteristic factors of the neighborhood that correlate strongly with investment activities. </p>
    <p><span class="instructions">To get started, use the dropdown to select zipcodes of your interest and scroll to compare their different characteristics.<span></p>
  </div>

  <PredictiveTool />

  <div class="spacer"></div>

  <div class="text-container" id="caption">
    <p>Thank you for exploring our visualization! We hope that you were able to learn something new about the Boston housing market and the speculative investment trends across the city. Before you go, we have gathered some resources for new homebuyers that we encourage you to check out! Please note that this list may not be complete.</p>
  </div>

  <div class="text-container">
    <h1>Resources for New Homebuyers</h1>
    <p>Learn More About Buying in Boston with these resources (we’ve compiled these resources to be especially user-friendly for first-time homebuyers navigating the Boston housing market!)</p>
    <ol style="font-size: 26px;">
      <li>Here is a great resource that lets you set a realistic budget for your first-time homebuyer experience:<br> <a href="https://kingstonrem.com/essential-tips-for-first-time-homebuyers-in-the-boston-housing-market/">Essential Tips for First Time Boston Homebuyers</a> </li>
      <li>Here is an ultimate guide to Boston home-buying and renting intended for students and young individuals:<br> <a href="https://kingstonrem.com/the-ultimate-guide-to-student-rentals-in-cambridge-what-you-need-to-know/">Ultimate Guide to Student Homebuying and Rentals</a></li>
      <li>This resource provides Boston first-time homebuyers with a great towards a downpayment:<br> <a href="https://www.boston.gov/first-time-homebuyer-program">First-time Homebuyers Program</a></li>
    </ol>
  </div>

  <div class="text-container">
    <h1>Acknowledgments</h1>
    <p>This project was developed with guidance and feedback from the <a href="https://www.mapc.org/">Metropolitan Area Planning Commission (MAPC).</a> 
      We would like to express our gratitude for the contributors of each data source we used, 
      including Residential Sales Transactions Data (data from MAPC), Census Data (data from American Community Survey and Census Bureau Data), 
      the Massachusetts Land Parcel dataset (data from MAPC), Owner Occupancy and Corporate Ownership Data (data from Analyze Boston), 
      and Historical Redlining Data (data from Mapping Inequality: Redlining in New Deal America).</p>
    <h2>References</h2>
      <ol style="font-size: 26px;">
      <li><a href="https://apps.bostonglobe.com/2023/10/special-projects/spotlight-boston-housing/boston-towers-of-wealth/">Boston Globe Article: Boston Towers of Wealth</a></li>
      <li><a href="https://michaeloppermann.com/d3-example/d3-waypoints-scrollytelling">D3 Waypoints Scrollytelling Example</a></li>
      <li><a href="https://dsl.richmond.edu/panorama/redlining/contactus">Mapping Inequality: Redlining Data</a></li>
    </ol>
  </div>

</main>

<style>
  /* Include global styles here if needed */
  /* Add more space between paragraphs */
  .text-container p {
      margin-bottom: 30px; /* Adjust as needed */
      zoom: 160%;
    }
</style>
