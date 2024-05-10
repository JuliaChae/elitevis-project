<!-- <script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    export let selectedZipCode;

    let svg;

    $: if (selectedZipCode) {
        loadData(selectedZipCode);
    }

    async function loadData(zipCode) {
        const data = await d3.csv('../public/price.csv', d => ({
        year: +d.year,
        zip: d.zip,
        value: +d.price
        }));

        const filteredData = data.filter(d => d.zip === zipCode).sort((a, b) => a.year - b.year);

        if (filteredData.length === 0) {
            console.error('No data available for the specified ZIP code.');
            return;
        }

        const width = 460, height = 250;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const svgElement = d3.select(svg)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('width', '100%')
        .style('height', 'auto');

        const x = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.year))
        .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.value)])
        .range([height - margin.bottom, margin.top]);

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
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-width', 2)
        .attr('d', line);
    }
</script>
  
<svg bind:this={svg}></svg> -->

<!-- works with static data ============================================================  -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let specificZipCode = "2116";
    let svg;
  
    onMount(async () => {
      // Load the data directly within the component
      const data = await d3.csv('../public/price.csv', d => ({
        year: +d.year,
        zip: d.zip,
        value: +d.price
      }));

      // Filter and sort data for the specific zip code
      const filteredData = data.filter(d => d.zip === specificZipCode)
                               .sort((a, b) => a.year - b.year); // Sort data by year

      if (filteredData.length === 0) {
        console.error('No data available for the specified ZIP code.');
        return;
      }

      const width = 460, height = 250;
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const svgElement = d3.select(svg)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('width', '100%')
        .style('height', 'auto');
  
      const x = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.year))
        .range([margin.left, width - margin.right]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.value)])
        .range([height - margin.bottom, margin.top]);
  
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
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-width', 2)
        .attr('d', line);
    });
</script>
  
<svg bind:this={svg}></svg>


<!-- works with mock data ============================================================  -->
<!-- <script>
import { onMount } from 'svelte';
import * as d3 from 'd3';

let svg;

onMount(() => {
    // Mock data
    const filteredData = [
    { year: 2000, value: 150 },
    { year: 2001, value: 180 },
    { year: 2002, value: 200 },
    { year: 2003, value: 240 },
    { year: 2004, value: 210 },
    { year: 2005, value: 230 },
    ];

    const width = 460, height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const svgElement = d3.select(svg)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('width', '100%')
    .style('height', 'auto');

    const x = d3.scaleLinear()
    .domain(d3.extent(filteredData, d => d.year))
    .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.value)])
    .range([height - margin.bottom, margin.top]);

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
    .datum(filteredData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);
});
</script>

<svg bind:this={svg}></svg> -->

  