<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import geoData from '../../public/ma_massachusetts_zip_codes_geo.min.json';
  
    let svg;
    let projection, pathGenerator;
  
    // List of relevant zip codes
    const relevantZipCodes = new Set([
      "02024", "02026", "02028", "02108", "02110", "02111", "02112", "02113", "02114", 
      "02115", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", 
      "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02137", 
      "02138", "02169", "02171", "02186", "02199", "02201", "02205", "02214", "02218", 
      "02228", "02251", "02445", "02446", "02458", "02459", "02465", "02467", "02494"
    ]);
  
    onMount(() => {
      const width = 1000;
      const height = 1000;
  
      // Filter the GeoJSON data to include only the relevant zip codes
      const filteredData = {
        ...geoData,
        features: geoData.features.filter(feature => relevantZipCodes.has(feature.properties.ZCTA5CE10))
      };
  
      // Adjusting the projection to fit only the filtered features
      projection = d3.geoTransverseMercator()
                     .rotate([74 + 30 / 60, -38 - 50 / 60])
                     .fitSize([width, height], filteredData);
      pathGenerator = d3.geoPath().projection(projection);
  
      const svgElement = d3.select(svg);
      svgElement.selectAll('path')
        .data(filteredData.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .attr('fill', '#cccccc')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.5)
        .append('title')
        .text(d => `ZIP Code: ${d.properties.ZCTA5CE10}`);
    });
  </script>
  
  <svg bind:this={svg} width="1000" height="1000" style="width: 100%; height: auto; border: 1px solid black;"></svg>
  
  <style>
    path:hover {
      fill: #ec9717;  /* Change fill color on hover */
    }
  </style>
  