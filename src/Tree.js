import React, { useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as d3 from 'd3';

const HierarchyChart = ({ data }) => {
    
  const isNodeTerminated = (d) => {
    const svg = d3.select(svgRef.current);
  
    // Get the current color of the selected path
    const currentColor = svg
      .selectAll('.link')
      .filter((link) => link.target === d || link.source === d)
      .attr('stroke');
  
    return currentColor === 'red';
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submit = (d) => {
    const isTerminated = isNodeTerminated(d);
  
    const title = isTerminated
      ? 'Enable the Line'
      : 'Confirm to terminate';
    const message = isTerminated
      ? 'Are you sure to undo termination?'
      : 'Are you sure to terminate?';
  
    confirmAlert({
      title,
      message,
      buttons: [
        {
          label: isTerminated ? 'Cancel' : 'Leave',
          onClick: () => console.log('Cancel'),
        },
        {
          label: isTerminated ? 'Enable' : 'Terminate',
          onClick: () => {
            updatePathColor(d);
            console.log(d);
          },
        },
      ],
    });
  };
  

  const updatePathColor = (d) => {
    const svg = d3.select(svgRef.current);
    
      // Toggle between red and #ccc
      const newColor =  isNodeTerminated(d)  ? '#ccc' : 'red';

      // Update the color for the selected path and its parent
      svg
        .selectAll('.link')
        .filter((link) => link.target === d || link.source === d)
        .attr('stroke', newColor);
  };

  const svgRef = useRef(null);

  useEffect(() => {
    if (data) {
      // Create a hierarchy layout
      const hierarchy = d3.hierarchy(data);

      // Set up the tree layout
      const treeLayout = d3.tree().size([500, 300]);

      // Assign positions to each node in the hierarchy
      treeLayout(hierarchy);

      // Select the SVG container
      const svg = d3.select(svgRef.current);

      // Create a zoom behavior
      const zoom = d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      });

      // Apply the zoom behavior to the SVG container
      svg.call(zoom);

      // Create links
      svg
        .selectAll('.link')
        .data(hierarchy.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x((d) => d.y).y((d) => d.x))
        .attr('stroke', '#ccc');

      // Create nodes
      const nodes = svg
        .selectAll('.node')
        .data(hierarchy.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .on('click', (event, d) => {
          // Check if the node is a leaf node (has no children)
          if (!d.children && !d._children) {
            submit(d); // Call the submit function for leaf nodes
          }
        });

      // Add text or image labels
      nodes.each(function (d) {
        const node = d3.select(this);

        if (d.data.image) {
          // If the node has an image property, show the image
          node
            .append('image')
            .attr('xlink:href', d.data.image)
            .attr('x', -12)
            .attr('y', 0)
            .attr('width', 24)
            .attr('height', 24);
        } else {
          // Add circles to represent nodes
          node
            .append('circle')
            .attr('r', 5)
            .attr('x', -12)
            .attr('y', 0);

          // If the node doesn't have an image property, show the text
          node
            .append('text')
            .attr('dy', '.35rem')
            .attr('x', (d) => (d.children ? -8 : 8))
            .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
            .text((d) => d.data.name);
        }
      });
    }
  }, [data, submit]);

  return <svg ref={svgRef} width={600} height={600}></svg>;
};

export default HierarchyChart;
