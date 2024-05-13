<script>
	let options = [
		"02026: East Dedham", 
		"02108: Beacon Hill", 
		"02110: Financial District", 
		"02111: Chinatown", 
		"02112: Financial District", 
		"02113: North End", 
		"02114: Downtown", 
		"02115: Kenmore Square",
		"02119: Washington Park | Roxbury", 
		"02120: Mission Hill | Jamaica Plain", 
		"02121: Franklin Field North | Roxbury", 
		"02122: Port Norfolk | Dorchester",
		"02124: Codman Sq | Dorchester",
		"02125: Harbor Islands | Dorchester", 
		"02126: Southern Mattapan | Mattapan", 
		"02127: Telegraph Hill | South Boston", 
		"02128: Jeffries Point | East Boston", 
		"02129: Medford St | Charlestown", 
		"02130: Jamaica Hills | Jamaica Plain", 
		"02131: Metropolitan Hill | Roslindale", 
		"02132: Upper Washington | West Roxbury", 
		"02134: Allston", 
		"02135: Brighton | Allston", 
		"02136: Stony Brook | Hyde Park", 
		"02137: Readville | Hyde Park", 
		"02138: Huron Village", 
		"02169: South Quincy", 
		"02171: Quincy", 
		"02186: East Milton", 
		"02199: Prudential | Back Bay", 
		"02201: Government Center | Downtown", 
		"02205: Financial District | Downtown", 
		"02228: Maverick Sq | East Boston",
		"02445: Brookline Village", 
		"02446: North Brookine", 
		"02458: Newton Corner", 
		"02459: Newton Centre", 
		"02465: West Newton", 
		"02467: Chestnut Hill", 
		"02494: Needham Heights"
	];
  
	let option1 = '';
	let option2 = '';
	let option3 = '';
  
	let selectedZIP1 = '';
	let selectedZIP2 = '';
	let selectedZIP3 = '';
  
	let zip_pop_1 = null;
	let zip_pop_2 = null;
	let zip_pop_3 = null;
  
	let zip_white_1 = null;
	let zip_white_2 = null;
	let zip_white_3 = null;
  
	let zip_black_1 = null;
	let zip_black_2 = null;
	let zip_black_3 = null;
  
	let zip_asian_1 = null;
	let zip_asian_2 = null;
	let zip_asian_3 = null;
  
	let zip_indian_1 = null;
	let zip_indian_2 = null;
	let zip_indian_3 = null;

	let zip_blank_1 = null;
	let zip_blank_2 = null;
	let zip_blank_3 = null;

	let zip_u18_1 = null;
	let zip_u18_2 = null;
	let zip_u18_3 = null;

	let zip_1864_1 = null;
	let zip_1864_2 = null;
	let zip_1864_3 = null;

	let zip_o64_1 = null; 
	let zip_o64_2 = null; 
	let zip_o64_3 = null;

	let zip_male_1 = null;
	let zip_male_2 = null;
	let zip_male_3 = null;

	let zip_female_1 = null;
	let zip_female_2 = null;
	let zip_female_3 = null;

	let zip_medianprice_1 = null;
	let zip_medianprice_2 = null;
	let zip_medianprice_3 = null;

	let zip_perc_investor_1 = 0.0;
	let zip_perc_investor_2 = 0.0;
	let zip_perc_investor_3 = 0.0;
	
	let zip_data = null;

	import { onMount } from 'svelte';
	import { csv } from 'd3';
  
	async function fetchData() {
	  try {
		const data = await csv('data/averaged_by_zip.csv');
		zip_data = data;
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	}
  
	onMount(fetchData);
  
	function handleZIPChange(column, event) {
	  const val = event.target.value;
	  const selectedZip = val.split(":")[0];
	  const selectedZipData = zip_data.find(row => row.zip === selectedZip);
	  if (selectedZipData) {
		if (column === 1) {
		  selectedZIP1 = selectedZip;
		  zip_pop_1 = selectedZipData.pop;
		  zip_white_1 = selectedZipData.pop_white;
		  zip_black_1 = selectedZipData.pop_black;
		  zip_asian_1 = selectedZipData.pop_asian;
		  zip_indian_1 = selectedZipData.pop_american_indian;
		  zip_u18_1 = selectedZipData.pop_u18; 
		  zip_1864_1 = selectedZipData.pop_18_64; 
		  zip_o64_1 = selectedZipData.pop_65o; 
		  zip_male_1 = selectedZipData.male;
		  zip_female_1 = selectedZipData.female;
		  zip_blank_1 = zip_pop_1 - zip_white_1 - zip_black_1 - zip_asian_1 - zip_indian_1 - 10;
		  zip_medianprice_1 = selectedZipData.median_price;
		  zip_perc_investor_1 = selectedZipData.perc_investor;
		} else if (column === 2) {
		  selectedZIP2 = selectedZip;
		  zip_pop_2 = selectedZipData.pop;
		  zip_white_2 = selectedZipData.pop_white;
		  zip_black_2 = selectedZipData.pop_black;
		  zip_asian_2 = selectedZipData.pop_asian;
		  zip_indian_2 = selectedZipData.pop_american_indian;
		  zip_u18_2 = selectedZipData.pop_u18; 
		  zip_1864_2 = selectedZipData.pop_18_64; 
		  zip_o64_2 = selectedZipData.pop_65o; 
		  zip_male_2 = selectedZipData.male;
		  zip_female_2 = selectedZipData.female;
		  zip_blank_2 = zip_pop_2 - zip_white_2 - zip_black_2 - zip_asian_2 - zip_indian_2 - 10;
		  zip_medianprice_2 = selectedZipData.median_price;
		  zip_perc_investor_2 = selectedZipData.perc_investor;
		} else if (column === 3) {
		  selectedZIP3 = selectedZip;
		  zip_pop_3 = selectedZipData.pop;
		  zip_white_3 = selectedZipData.pop_white;
		  zip_black_3 = selectedZipData.pop_black;
		  zip_asian_3 = selectedZipData.pop_asian;
		  zip_indian_3 = selectedZipData.pop_american_indian;
		  zip_u18_3 = selectedZipData.pop_u18; 
		  zip_1864_3 = selectedZipData.pop_18_64; 
		  zip_o64_3 = selectedZipData.pop_65o; 
		  zip_male_3 = selectedZipData.male;
		  zip_female_3 = selectedZipData.female;
		  zip_blank_3 = zip_pop_3 - zip_white_3 - zip_black_3 - zip_asian_3 - zip_indian_3 - 10;
		  zip_medianprice_3 = selectedZipData.median_price;
		  zip_perc_investor_3 = selectedZipData.perc_investor;
		}

	  } else {
		if (column === 1) {
		  selectedZIP1 = '';
		  zip_pop_1 = null;
		  zip_white_1 = null;
		  zip_black_1 = null;
		  zip_asian_1 = null;
		  zip_indian_1 = null;
		  zip_u18_1 = null; 
		  zip_1864_1 = null; 
		  zip_o64_1 = null; 
		  zip_male_1 = null;
		  zip_female_1 = null;
		  zip_blank_1 = null;
		  zip_medianprice_1 = null;
		  zip_perc_investor_1 = null;
		} else if (column === 2) {
		  selectedZIP2 = '';
		  zip_pop_2 = null;
		  zip_white_2 = null;
		  zip_black_2 = null;
		  zip_asian_2 = null;
		  zip_indian_2 = null;
		  zip_u18_2 = null; 
		  zip_1864_2 = null; 
		  zip_o64_2 = null; 
		  zip_male_2 = null;
		  zip_female_2 = null;
		  zip_blank_2 = null;
		  zip_medianprice_2 = null;
		  zip_perc_investor_2 = null;
		} else if (column === 3) {
		  selectedZIP3 = '';
		  zip_pop_3 = null;
		  zip_white_3 = null;
		  zip_black_3 = null;
		  zip_asian_3 = null;
		  zip_indian_3 = null;
		  zip_u18_3 = null; 
		  zip_1864_3 = null; 
		  zip_o64_3 = null; 
		  zip_male_3 = null;
		  zip_female_3 = null;
		  zip_blank_3 = null;
		  zip_medianprice_3 = null;
		  zip_perc_investor_3 = null;
		}
	  }
	}
  </script>
  
  <div class="container" id="predictive">
	<div class="column">
		<div class="sticky-select">
			<br>
			<center>
				<select bind:value={option1} on:change={() => handleZIPChange(1, event)}>
				<option value="">Zip:</option>
				{#each options as option}
				<option value={option} disabled={option === option2 || option === option3}>{option}</option>
				{/each}
				</select>
			</center>
			<br>
		</div>
	  {#if option1 !== ''}

	  	<p><b><center>Demographics (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_white"></div>
			  <span>White</span>
			</div>
			<div class="legend-item">
			  <div class="square_black"></div>
			  <span>Black</span>
			</div>
			<div class="legend-item">
			  <div class="square_asian"></div>
			  <span>Asian</span>
			</div>
			<div class="legend-item">
			  <div class="square_indian"></div>
			  <span>Native A.</span>
			</div>
			<div class="legend-item">
				<div class="square_blank"></div>
				<span>Unidentified</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_white_1 !== null}
			{#each Array(Math.ceil(zip_white_1 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black_1 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian_1 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian_1 / 10)) as _, i}
			  <div class="square_indian"></div>
			{/each}
			{#each Array(Math.ceil(zip_blank_1 / 10)) as _, i}
			  <div class="square_blank"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>


		<br><br>
		<p><b><center>Age (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_u18"></div>
			  <span>Under 18</span>
			</div>
			<div class="legend-item">
			  <div class="square_18_64"></div>
			  <span>18 to 64</span>
			</div>
			<div class="legend-item">
			  <div class="square_o64"></div>
			  <span>Above 64</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_u18_1 !== null}
			{#each Array(Math.ceil(zip_u18_1 / 10)) as _, i}
			  <div class="square_u18"></div>
			{/each}
			{#each Array(Math.ceil(zip_1864_1 / 10)) as _, i}
			  <div class="square_18_64"></div>
			{/each}
			{#each Array(Math.ceil(zip_o64_1 / 10)) as _, i}
			  <div class="square_o64"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Sex (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_male"></div>
			  <span>Male</span>
			</div>
			<div class="legend-item">
			  <div class="square_female"></div>
			  <span>Female</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_male_1 !== null}
			{#each Array(Math.ceil(zip_male_1 / 10)) as _, i}
			  <div class="square_male"></div>
			{/each}
			{#each Array(Math.ceil(zip_female_1 / 10)) as _, i}
			  <div class="square_female"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Percentage of Investor Activity (by %)</center></b></p>
		<div class="population">
		  {#if zip_perc_investor_1 !== null}
			{#each Array(Math.ceil(zip_perc_investor_1)) as _, i}
			  <div class="square_investor"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Median Price (by $1000)</center></b></p>
		<div class="population">
		  {#if zip_medianprice_1 !== null}
			{#each Array(Math.ceil(zip_medianprice_1 / 1000)) as _, i}
			  <div class="square_price"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

	  {/if}
	</div>
  
	<div class="column">
		<div class="sticky-select">
			<br>
			<center>
				<select bind:value={option2} on:change={() => handleZIPChange(2, event)}>
					<option value="">Zip:</option>
					{#each options as option}
					<option value={option} disabled={option === option1 || option === option3}>{option}</option>
					{/each}
				</select>
			</center>
			<br>
		</div>
	  {#if option2 !== ''}
	  	<p><b><center>Demographics (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_white"></div>
			  <span>White</span>
			</div>
			<div class="legend-item">
			  <div class="square_black"></div>
			  <span>Black</span>
			</div>
			<div class="legend-item">
			  <div class="square_asian"></div>
			  <span>Asian</span>
			</div>
			<div class="legend-item">
			  <div class="square_indian"></div>
			  <span>Native A.</span>
			</div>
			<div class="legend-item">
				<div class="square_blank"></div>
				<span>Unidentified</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_pop_2 !== null}
			{#each Array(Math.ceil(zip_white_2 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black_2 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian_2 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian_2 / 10)) as _, i}
			  <div class="square_indian"></div>
			{/each}
			{#each Array(Math.ceil(zip_blank_2 / 10)) as _, i}
			  <div class="square_blank"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Age (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_u18"></div>
			  <span>Under 18</span>
			</div>
			<div class="legend-item">
			  <div class="square_18_64"></div>
			  <span>18 to 64</span>
			</div>
			<div class="legend-item">
			  <div class="square_o64"></div>
			  <span>Above 64</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_u18_2 !== null}
			{#each Array(Math.ceil(zip_u18_2 / 10)) as _, i}
			  <div class="square_u18"></div>
			{/each}
			{#each Array(Math.ceil(zip_1864_2 / 10)) as _, i}
			  <div class="square_18_64"></div>
			{/each}
			{#each Array(Math.ceil(zip_o64_2 / 10)) as _, i}
			  <div class="square_o64"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Sex (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_male"></div>
			  <span>Male</span>
			</div>
			<div class="legend-item">
			  <div class="square_female"></div>
			  <span>Female</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_male_2 !== null}
			{#each Array(Math.ceil(zip_male_2 / 10)) as _, i}
			  <div class="square_male"></div>
			{/each}
			{#each Array(Math.ceil(zip_female_2 / 10)) as _, i}
			  <div class="square_female"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Percentage of Investor Activity (by %)</center></b></p>
		<div class="population">
		  {#if zip_perc_investor_2 !== null}
			{#each Array(Math.ceil(zip_perc_investor_2)) as _, i}
			  <div class="square_investor"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Median Price (by $1000)</center></b></p>
		<div class="population">
		  {#if zip_medianprice_2 !== null}
			{#each Array(Math.ceil(zip_medianprice_2 / 1000)) as _, i}
			  <div class="square_price"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

	  {/if}
	</div>
  
	<div class="column">
		<div class="sticky-select">
			<br>
			<center>
				<select bind:value={option3} on:change={() => handleZIPChange(3, event)}>
					<option value="">Zip:</option>
					{#each options as option}
					<option value={option} disabled={option === option1 || option === option2}>{option}</option>
					{/each}
				</select>
			</center>
			<br>
		</div>

	  {#if option3 !== ''}
	  	<p><b><center>Demographics (by 10s)</center></b></p>		
		<div class="legend">
			<div class="legend-item">
			  <div class="square_white"></div>
			  <span>White</span>
			</div>
			<div class="legend-item">
			  <div class="square_black"></div>
			  <span>Black</span>
			</div>
			<div class="legend-item">
			  <div class="square_asian"></div>
			  <span>Asian</span>
			</div>
			<div class="legend-item">
			  <div class="square_indian"></div>
			  <span>Native A.</span>
			</div>
			<div class="legend-item">
				<div class="square_blank"></div>
				<span>Unidentified</span>
			</div>
		</div>
		
		<div class="population">
		  {#if zip_pop_3 !== null}
			{#each Array(Math.ceil(zip_white_3 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black_3 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian_3 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian_3 / 10)) as _, i}
			  <div class="square_indian"></div>
			{/each}
			{#each Array(Math.floor(zip_blank_3 / 10)) as _, i}
			  <div class="square_blank"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Age (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_u18"></div>
			  <span>Under 18</span>
			</div>
			<div class="legend-item">
			  <div class="square_18_64"></div>
			  <span>18 to 64</span>
			</div>
			<div class="legend-item">
			  <div class="square_o64"></div>
			  <span>Above 64</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_u18_3 !== null}
			{#each Array(Math.ceil(zip_u18_3 / 10)) as _, i}
			  <div class="square_u18"></div>
			{/each}
			{#each Array(Math.ceil(zip_1864_3 / 10)) as _, i}
			  <div class="square_18_64"></div>
			{/each}
			{#each Array(Math.ceil(zip_o64_3 / 10)) as _, i}
			  <div class="square_o64"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Sex (by 10s)</center></b></p>
		<div class="legend">
			<div class="legend-item">
			  <div class="square_male"></div>
			  <span>Male</span>
			</div>
			<div class="legend-item">
			  <div class="square_female"></div>
			  <span>Female</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_male_3 !== null}
			{#each Array(Math.ceil(zip_male_3 / 10)) as _, i}
			  <div class="square_male"></div>
			{/each}
			{#each Array(Math.ceil(zip_female_3 / 10)) as _, i}
			  <div class="square_female"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Percentage of Investor Activity (by %)</center></b></p>
		<div class="population">
		  {#if zip_perc_investor_3 !== null}
			{#each Array(Math.ceil(zip_perc_investor_3)) as _, i}
			  <div class="square_investor"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

		<br><br>
		<p><b><center>Median Price (by $1000)</center></b></p>
		<div class="population">
		  {#if zip_medianprice_3 !== null}
			{#each Array(Math.ceil(zip_medianprice_3 / 1000)) as _, i}
			  <div class="square_price"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>

	  {/if}
	</div>
  </div>
  
  <style>
	.container {
	  display: flex;
	  border: 1px solid white;
	  padding: 20px;
	}
  
	.column {
	  flex: 1;
	  margin: 30 0;
	  padding: 20px;
	}
  
	.column:last-child {
	  border-right: none;
	}
  
	.population {
	  display: flex;
	  flex-wrap: wrap;
	  margin-top: 10px;
	}
  
	.square_white {
	  width: 10px;
	  height: 10px;
	  background-color: pink;
	  margin: 1px;
	}
	
	.square_black {
	  width: 10px;
	  height: 10px;
	  background-color: lightcoral;
	  margin: 1px;
	}

	.square_asian {
	  width: 10px;
	  height: 10px;
	  background-color: orange;
	  margin: 1px;
	}

	.square_indian {
	  width: 10px;
	  height: 10px;
	  background-color: yellow;
	  margin: 1px;
	}

	.square_blank {
	  width: 10px;
	  height: 10px;
	  background-color: lightgrey;
	  margin: 1px;
	}

	.square_u18 {
	  width: 10px;
	  height: 10px;
	  background-color: lightgreen;
	  margin: 1px;
	}

	.square_18_64 {
	  width: 10px;
	  height: 10px;
	  background-color: lightblue;
	  margin: 1px;
	}

	.square_o64 {
	  width: 10px;
	  height: 10px;
	  background-color: lightseagreen;
	  margin: 1px;
	}

	.square_male {
	  width: 10px;
	  height: 10px;
	  background-color: palevioletred;
	  margin: 1px;
	}

	.square_female {
	  width: 10px;
	  height: 10px;
	  background-color: plum;
	  margin: 1px;
	}

	.square_price {
	  width: 10px;
	  height: 10px;
	  background-color: yellowgreen;
	  margin: 1px;
	}

	.square_investor {
	  width: 10px;
	  height: 10px;
	  background-color: green;
	  margin: 1px;
	}

	.legend {
		margin-top: 5px;
		display: flex;
		justify-content: center;
	}

	.legend-item {
		display: flex;
		align-items: center;
		margin-right: 5px;
	}

	.legend-item span {
		margin-left: 5px;
	}

	.sticky-select {
        position: sticky;
        top: 0px;
		height: 100px;
        z-index: 1000; /* Ensure it stays on top of other content */
        background-color: #1f1f1f;
    }
	
  </style>
  