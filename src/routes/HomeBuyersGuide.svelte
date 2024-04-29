<script>
    import { onMount } from 'svelte';

    class ScrollerVis {
        constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 400,
            containerHeight: 600,
            cellWidth: 18,
            cellHeight: 18,
            cellSpacing: 12,
            yAxisWidth: 150,
            barHeight: 18,
            barSpacing: 4,
            margin: {top: 5, right: 30, bottom: 5, left: 5},
            steps: ['step0', 'step1', 'step2', 'step3', 'step4']
        }
        this.data = _data;
        this.initVis();
        }
        
        /**
        * We initialize scales/axes and append static elements, such as axis titles.
        */
        initVis() {
        let vis = this;
    
        // Identify hikes with the longest distance
        const dataTop15 = [...vis.data].sort((a,b) => b.distance - a.distance).slice(0,10);
        const namesTop15 = dataTop15.map(d => d.trail);
        vis.data.forEach(d => {
            d.rank = namesTop15.indexOf(d.trail);
        });
    
        vis.dataLongestHike = [...vis.data].sort((a,b) => b.time - a.time)[0];
    
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.xScale = d3.scaleLinear()
            .range([0, vis.config.width-vis.config.yAxisWidth])
            .domain([0, d3.max(dataTop15, d => d.distance)]);
    
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // Append group element that will contain our actual chart 
        // and position it according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
        console.log("vis data", vis.data)

        // Initialize scales
        vis.colorScale = d3.scaleOrdinal()
            .range(['#B5a291', '#F3db76', '#B5a291'])
            .domain(['default','highlighted', 'inactive']);
    
        // Calculate number of columns and rows for the grid layout
        vis.config.columns = Math.floor(vis.config.width / (vis.config.cellWidth + vis.config.cellSpacing));
        vis.config.rows = Math.ceil(vis.data.length / vis.config.columns);
    
        // Bind data to rectangles but don't specify any attributes yet
        vis.rect = vis.chart.selectAll('rect')
            .data(data, d => d.name).join('rect');
    
        // Call first step
        vis.step0();
        console.log("WE ARE IN scrollerVis.JS")
        }
        step0() {
        const vis = this;
    
        // Arrange rectangles in grid layout and set a default colour
        vis.rect.transition()
            .attr('fill', vis.colorScale('default'))
            .attr('width', d => vis.config.cellWidth)
            .attr('height', d => vis.config.cellHeight)
            .attr('x', (d, i) => i % vis.config.columns * (vis.config.cellWidth + vis.config.cellSpacing))
            .attr('y', (d, i) => Math.floor(i / vis.config.columns) % vis.config.rows * (vis.config.cellHeight + vis.config.cellSpacing));
        }
    
        step1() {
        const vis = this;
    
        // Change the colour of some rectangles to highlight them
        vis.rect.transition()
            .attr('fill', d => d.difficulty=='Easy' ? vis.colorScale('highlighted') : vis.colorScale('default'));
        }
    
        step2() {
        const vis = this;
    
        // Change the colour of other rectangles
        vis.rect.transition()
            .attr('fill', d => d.difficulty=='Difficult' ? vis.colorScale('highlighted') : vis.colorScale('default'));
        }
    
        step3() {
        const vis = this;
        
        // Highlight one trail
        // Important: We also need to update the width, height, etc because these attributes are
        // getting changed in step4() and we want to allow users to scroll up and down.
        vis.rect.transition()
            .attr('opacity', 1)
            .attr('fill', d => d.trail==vis.dataLongestHike.trail ? vis.colorScale('highlighted') : vis.colorScale('inactive'))
            .attr('width', d => vis.config.cellWidth)
            .attr('height', d => vis.config.cellHeight)
            .attr('x', (d, i) => i % vis.config.columns * (vis.config.cellWidth + vis.config.cellSpacing))
            .attr('y', (d, i) => Math.floor(i / vis.config.columns) % vis.config.rows * (vis.config.cellHeight + vis.config.cellSpacing));
    
        if (vis.textG) vis.textG.remove();
        }
    
        step4() {
        const vis = this;
    
        vis.rect
            .attr('fill', vis.colorScale('default'))
            .transition().duration(500)
            .attr('opacity', 0)
            .filter(d => d.rank >= 0)
            .attr('opacity', 1)
            .attr('x', vis.config.yAxisWidth)
            .attr('y', d => d.rank * (vis.config.barHeight + vis.config.barSpacing))
            .attr('height', d => vis.config.barHeight)
            .attr('width', d => vis.xScale(d.distance));
    
        vis.textG = vis.chart.selectAll('g')
            .data(vis.data.filter(d => d.rank >= 0))
            .join('g')
            .attr('opacity', 0)
            .attr('transform', d => `translate(${vis.config.yAxisWidth},${d.rank * (vis.config.barHeight + vis.config.barSpacing)})`);
    
        vis.textG.append('text')
            .attr('class', 'chart-label chart-label-name')
            .attr('text-anchor', 'end')
            .attr('dy', '0.35em')
            .attr('x', -3)
            .attr('y', vis.config.barHeight/2)
            .text(d => d.trail);
    
        // vis.textG.append('text')
        //     .attr('class', 'chart-label chart-label-val')
        //     .attr('dy', '0.35em')
        //     .attr('x', 5)
        //     .attr('y', vis.config.barHeight/2)
        //     .text(d => d.distance);
    
        vis.textG.transition().duration(800)
            .attr('opacity', 1);
        }
        
        goToStep(stepIndex) {
        this[this.config.steps[stepIndex]]();
        }
    }
    /**
    * Load data from CSV file asynchronously and render scatter plot
    */
    console.log("WE ARE IN MAIN.JS IN SVELTE")
    
    let data, scrollerVis;
    onMount(async () => {
        d3.csv('data/vancouver_trails.csv').then(_data => {
            data = _data;
            data.forEach(d => {
                d.distance = +d.distance;
            });
            console.log(data);

            // Update text on the web page based on the loaded dataset
            d3.select('#hikes-count').text(data.length);
            d3.select('#easy-hikes-count').text(data.filter(d => d.difficulty == 'Easy').length);
            d3.select('#difficult-hikes-count').text(data.filter(d => d.difficulty == 'Difficult').length);

            const longestHike = [...data].sort((a,b) => b.time - a.time)[0];
            d3.select('#max-duration').text(longestHike.time);
            d3.select('#max-duration-trail').text(longestHike.trail);

            // Initialize visualization
            scrollerVis = new ScrollerVis({ parentElement: '#vis'}, data); // this is where the vis element is created.
            
            // Create a waypoint for each `step` container
            const waypoints = d3.selectAll('.step').each( function(d, stepIndex) {
                return new Waypoint({
                    // `this` contains the current HTML element
                    element: this,
                    handler: function(direction) {
                        // Check if the user is scrolling up or down
                        const nextStep = direction === 'down' ? stepIndex : Math.max(0, stepIndex - 1)
                        
                        // Update visualization based on the current step
                        scrollerVis.goToStep(nextStep);
                    },
                    // Trigger scroll event halfway up. Depending on the text length, 75% might be even better
                    offset: '50%',
                });
            });
        })
        .catch(error => console.error(error));
    });
</script>

<div class="page">
    <h1>A Homebuyer's Guide to Investor Activity in Boston</h1>
    <div class="container">
        <div id="vis"></div>
        <div id="prose">
            <div class="step" id="step0">There are a total of <span class="count" id="hikes-count"></span> zipcodes that have a median home price at over one million dollars, ten times that of the average Boston household income ($120,000).</div>
            <div class="step" id="step1"><span class="count" id="easy-hikes-count"></span> counties where the investor rate is above 30%.</div>
            <div class="step" id="step2"><span class="count" id="difficult-hikes-count"></span> counties where the investment activity has gone up significantly (>15%) in the past 5 years.</div>
            <div class="step" id="step3">The county with the highest investment activity: <b>Back Bay</b> (zipcode 02199). <br></div>
            <div class="step" id="step4">The top 10 counties with the highest investment activity.</div>
        </div>
    </div>
</div>
