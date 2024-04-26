<script>
	let options = [
	  "02024", "02026", "02028", "02108", "02110", "02111", "02112", "02113", "02114", 
	  "02115", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", 
	  "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02137", 
	  "02138", "02169", "02171", "02186", "02199", "02201", "02205", "02214", "02218", 
	  "02228", "02251", "02445", "02446", "02458", "02459", "02465", "02467", "02494"
	];
  
	let option1 = '';
	let option2 = '';
	let option3 = '';
  
	let selectedZIP1 = '';
	let selectedZIP2 = '';
	let selectedZIP3 = '';
  
	let zip_pop1 = null;
	let zip_pop2 = null;
	let zip_pop3 = null;
  
	let zip_white1 = null;
	let zip_white2 = null;
	let zip_white3 = null;
  
	let zip_black1 = null;
	let zip_black2 = null;
	let zip_black3 = null;
  
	let zip_asian1 = null;
	let zip_asian2 = null;
	let zip_asian3 = null;
  
	let zip_indian1 = null;
	let zip_indian2 = null;
	let zip_indian3 = null;
  
	let zip_data = null;
  
	function handleOptionSelect(column, option) {
	  if (column === 1) {
		option1 = option;
	  } else if (column === 2) {
		option2 = option;
	  } else if (column === 3) {
		option3 = option;
	  }
	}
  
	import { onMount } from 'svelte';
	import { csv } from 'd3';
  
	async function fetchData() {
	  try {
		const data = await csv('/averaged_by_zip.csv');
		zip_data = data;
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	}
  
	onMount(fetchData);
  
	function handleZIPChange(column, event) {
	  const selectedZip = event.target.value;
	  const selectedZipData = zip_data.find(row => row.zip === selectedZip);
	  if (selectedZipData) {
		if (column === 1) {
		  selectedZIP1 = selectedZip;
		  zip_pop1 = selectedZipData.pop;
		  zip_white1 = selectedZipData.pop_white;
		  zip_black1 = selectedZipData.pop_black;
		  zip_asian1 = selectedZipData.pop_asian;
		  zip_indian1 = selectedZipData.pop_american_indian;
		} else if (column === 2) {
		  selectedZIP2 = selectedZip;
		  zip_pop2 = selectedZipData.pop;
		  zip_white2 = selectedZipData.pop_white;
		  zip_black2 = selectedZipData.pop_black;
		  zip_asian2 = selectedZipData.pop_asian;
		  zip_indian2 = selectedZipData.pop_american_indian;
		} else if (column === 3) {
		  selectedZIP3 = selectedZip;
		  zip_pop3 = selectedZipData.pop;
		  zip_white3 = selectedZipData.pop_white;
		  zip_black3 = selectedZipData.pop_black;
		  zip_asian3 = selectedZipData.pop_asian;
		  zip_indian3 = selectedZipData.pop_american_indian;
		}
	  } else {
		if (column === 1) {
		  selectedZIP1 = '';
		  zip_pop1 = null;
		  zip_white1 = null;
		  zip_black1 = null;
		  zip_asian1 = null;
		  zip_indian1 = null;
		} else if (column === 2) {
		  selectedZIP2 = '';
		  zip_pop2 = null;
		  zip_white2 = null;
		  zip_black2 = null;
		  zip_asian2 = null;
		  zip_indian2 = null;
		} else if (column === 3) {
		  selectedZIP3 = '';
		  zip_pop3 = null;
		  zip_white3 = null;
		  zip_black3 = null;
		  zip_asian3 = null;
		  zip_indian3 = null;
		}
	  }
	}
  </script>
  
  <div class="container">
	<div class="column">
	  <select bind:value={option1} on:change={() => handleZIPChange(1, event)}>
		<option value="">Zip:</option>
		{#each options as option}
		  <option value={option} disabled={option === option2 || option === option3}>{option}</option>
		{/each}
	  </select>
	  {#if option1 !== ''}
	  	<p>Demographic breakdown</p>
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
			  <span>Native American</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_white1 !== null}
			{#each Array(Math.ceil(zip_white1 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black1 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian1 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian1 / 10)) as _, i}
			  <div class="square_indian"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>
	  {/if}
	</div>
  
	<div class="column">
	  <select bind:value={option2} on:change={() => handleZIPChange(2, event)}>
		<option value="">Zip:</option>
		{#each options as option}
		  <option value={option} disabled={option === option1 || option === option3}>{option}</option>
		{/each}
	  </select>
	  {#if option2 !== ''}
		<p>Demographic breakdown</p>
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
			  <span>Native American</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_pop2 !== null}
			{#each Array(Math.ceil(zip_white2 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black2 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian2 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian2 / 10)) as _, i}
			  <div class="square_indian"></div>
			{/each}
		  {:else}
			<p>No population data available for selected ZIP code</p>
		  {/if}
		</div>
	  {/if}
	</div>
  
	<div class="column">
	  <select bind:value={option3} on:change={() => handleZIPChange(3, event)}>
		<option value="">Zip:</option>
		{#each options as option}
		  <option value={option} disabled={option === option1 || option === option2}>{option}</option>
		{/each}
	  </select>
	  {#if option3 !== ''}
	 	<p>Demographic breakdown</p>
		
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
			  <span>Native American</span>
			</div>
		</div>
		  
		<div class="population">
		  {#if zip_pop3 !== null}
			{#each Array(Math.ceil(zip_white3 / 10)) as _, i}
			  <div class="square_white"></div>
			{/each}
			{#each Array(Math.ceil(zip_black3 / 10)) as _, i}
			  <div class="square_black"></div>
			{/each}
			{#each Array(Math.ceil(zip_asian3 / 10)) as _, i}
			  <div class="square_asian"></div>
			{/each}
			{#each Array(Math.ceil(zip_indian3 / 10)) as _, i}
			  <div class="square_indian"></div>
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
	  border: 1px solid #000;
	}
  
	.column {
	  flex: 1;
	  margin: 0 10px;
	  border-right: 1px solid #000;
	  padding: 10px;
	}
  
	.column:last-child {
	  border-right: none;
	}
  
	.population {
	  display: flex;
	  flex-wrap: wrap;
	  margin-top: 10px;
	}
  
	.square {
	  width: 10px;
	  height: 10px;
	  background-color: grey;
	  margin: 1px;
	}

	.square_white {
	  width: 10px;
	  height: 10px;
	  background-color: lightblue;
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
	  background-color: rgb(177, 88, 177);
	  margin: 1px;
	}

	.legend {
		margin-top: 20px;
		display: flex;
		justify-content: center;
	}

	.legend-item {
		display: flex;
		align-items: center;
		margin-right: 20px;
	}

	.legend-item span {
		margin-left: 5px;
	}

	
  </style>
  