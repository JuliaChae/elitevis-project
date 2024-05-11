<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import geoData from '../../public/ma_massachusetts_zip_codes_geo.min.json';

  let svgMap, svgLineChart1;
  let selectedZipCode = "02116";

  $: if (selectedZipCode) {
    updateLineChart(selectedZipCode);
  }

  let lineChartData = new Map(); // will hold the grouped data by ZIP code

  const relevantZipCodes = new Set([
      "02024", "02026", "02028", "02108", "02110", "02111", "02112", "02113", "02114", 
      "02115", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", 
      "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02137", 
      "02138", "02169", "02171", "02186", "02199", "02201", "02205", "02214", "02218", 
      "02228", "02251", "02445", "02446", "02458", "02459", "02465", "02467", "02494"
  ]);

  function initializeMap() {
    const width = 1000, height = 600; 
    const filteredData = {
      ...geoData,
      features: geoData.features.filter(f =>
        relevantZipCodes.has(f.properties.ZCTA5CE10)
      )
    };

    const projection = d3.geoTransverseMercator()
      .fitSize([width, height], filteredData);
    const pathGenerator = d3.geoPath().projection(projection);

    d3.select(svgMap).selectAll('path')
      .data(filteredData.features)  // ensure this is the correct data source
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#ccc')
      .on('click', function(event, d) {
        console.log("Clicked ZIP:", d.properties.ZCTA5CE10);
        selectedZipCode = d.properties.ZCTA5CE10; // update selected ZIP code
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#f2bc19');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#ccc');
      })
      .append('title')
      .text(d => `ZIP Code: ${d.properties.ZCTA5CE10}`);
  }


  async function loadChartData() {
    const data = await d3.csv('../public/price.csv', d => ({
      year: +d.year,
      zip: d.zip.padStart(5, '0'),  // zipcodes in price.csv are different
      value: +d.price
    }));

    lineChartData = d3.group(data, d => d.zip);
    
  }

  function updateLineChart(zipCode) {
    if (!zipCode || !lineChartData.has(zipCode)) {
      console.error('Data not available for ZIP:', zipCode);
      return;
    }
    const data = lineChartData.get(zipCode).sort((a, b) => a.year - b.year);
    const width = 460, height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const svgElement = d3.select(svgLineChart1)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height - margin.bottom, margin.top]);

    svgElement.selectAll('*').remove(); // Clear previous contents

    svgElement.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svgElement.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value));

    svgElement.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'yellow')
      .attr('stroke-width', 3)
      .attr('d', line);
  }

  onMount(async () => {
    await loadChartData();
    initializeMap();
    updateLineChart(selectedZipCode); // Initial update with default or null
  });

</script>

<svg bind:this={svgMap} width="1000" height="600" style="width: 100%; height: auto; border: 1px solid black;"></svg>
<svg bind:this={svgLineChart1}></svg>



<!-- OLD CODE -->

<!-- <script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import geoData from '../../public/ma_massachusetts_zip_codes_geo.min.json';

  let svgMap, svgLineChart1, svgLineChart2;
  let selectedZipCode = "02116";
  let lineChartData = [];

  const relevantZipCodes = new Set([
      "02024", "02026", "02028", "02108", "02110", "02111", "02112", "02113", "02114", 
      "02115", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", 
      "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02137", 
      "02138", "02169", "02171", "02186", "02199", "02201", "02205", "02214", "02218", 
      "02228", "02251", "02445", "02446", "02458", "02459", "02465", "02467", "02494"
  ]);

  async function loadChartData() {
    const data = await d3.csv('../public/price.csv', d => ({
      year: +d.year,
      zip: d.zip.padStart(5, '0'),  // zipcodes are differnt in price.csv
      price: +d.price,
      invest: +d.perc_top_invested * 100
    }));

    lineChartData = d3.group(data, d => d.zip);
  }

  onMount(async () => {
    await loadChartData();
    updateLineCharts(); // debugging

    const width = 1000, height = 1000;
    const filteredData = {
      ...geoData,
      features: geoData.features.filter(f => relevantZipCodes.has(f.properties.ZCTA5CE10))
    };

    const projection = d3.geoTransverseMercator()
      .fitSize([width, height], filteredData);
    const pathGenerator = d3.geoPath().projection(projection);

    d3.select(svgMap).selectAll('path')
      .data(filteredData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#ccc')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .on('click', d => {
        selectedZipCode = d.properties.ZCTA5CE10;
        updateLineCharts();
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#ec9717');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#ccc');
      })
      .append('title')
      .text(d => `ZIP Code: ${d.properties.ZCTA5CE10}`);
  });

  function updateLineCharts() {
    console.log("Selected ZIP:", selectedZipCode);  // Debugging
    if (!selectedZipCode || !lineChartData.has(selectedZipCode)) {
      console.error('Data not found for ZIP:', selectedZipCode);
      return;
    }
    const data = lineChartData.get(selectedZipCode);
    console.log("Data for ZIP:", data);  // Check what data is being retrieved
    const configs = [
      { svg: svgLineChart1, value: 'price' },
      { svg: svgLineChart2, value: 'invest' }
    ];
    configs.forEach(({ svg, value }) => drawLineChart(svg, data, value));
      if (!selectedZipCode || !lineChartData.has(selectedZipCode)) return;
  }

  function drawLineChart(svgElement, data, valueField) {
    const width = 460, height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[valueField])])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d[valueField]));

    d3.select(svgElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .selectAll('*').remove(); // Clear previous

    svgElement.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svgElement.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svgElement.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }
</script>

 <svg bind:this={svgMap} width="1000" height="1000" style="width: 100%; height: auto; border: 1px solid black;"></svg> -->
<!-- <svg bind:this={svgLineChart1} width="460" height="250"></svg> -->
<!-- <svg bind:this={svgLineChart2} width="460" height="250"></svg> -->
