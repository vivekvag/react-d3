import React, { useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import * as d3 from 'd3';

const HierarchyChart = ({ data  }) => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submit = (d) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => alert('Click Yes')
        },
        {
          label: 'Terminate',
          onClick: () => {
            updatePathColor(d);
            console.log(d)
          }
        }
      ]
    });
  };

  const updatePathColor = (d) => {
    const svg = d3.select(svgRef.current);

    // Change color for the selected path and its parent
    svg
      .selectAll('.link')
      .filter((link) => link.target === d || link.source === d)
      .attr('stroke', 'skyblue');
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

      // Create links
      const links = svg
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

      // Add circles to represent nodes
      nodes.append('circle').attr('r', 5);

      // Add text labels
      nodes
        .append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children ? -8 : 8))
        .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => d.data.name);
    }
  }, [data, submit]);

  return (
    <svg ref={svgRef} width={600} height={600}>
    </svg>
  );
};

export default HierarchyChart;
