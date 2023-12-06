import React, { useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as d3 from 'd3';

const TREE_SIZE = [500, 300];
const CIRCLE_RADIUS = 5;

const HierarchyChart = ({ data }) => {
  const isNodeTerminated = (d) => {
    const svg = d3.select(svgRef.current);
    const currentColor = svg
      .selectAll('.link')
      .filter((link) => link.target === d || link.source === d)
      .attr('stroke');
    return currentColor === 'red';
  };

  const updatePathColor = (d) => {
    const svg = d3.select(svgRef.current);
    const newColor = isNodeTerminated(d) ? '#ccc' : 'red';
    svg
    .selectAll('.link')
    .filter((link) => link.target === d || link.source === d)
    .attr('stroke', newColor);
  };
  
  const submit = (d) => {
    const isTerminated = isNodeTerminated(d);
    const title = isTerminated ? 'Enable the Line' : 'Confirm to terminate';
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

  const createTree = () => {
    const hierarchy = d3.hierarchy(data);
    const treeLayout = d3.tree().size(TREE_SIZE);
    treeLayout(hierarchy);
    return hierarchy;
  };

  const createLinks = (svg, hierarchy) => {
    svg
      .selectAll('.link')
      .data(hierarchy.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal().x((d) => d.y).y((d) => d.x))
      .attr('stroke', '#ccc');
  };

  const createNodes = (svg, hierarchy) => {
    const nodes = svg
      .selectAll('.node')
      .data(hierarchy.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .on('click', (event, d) => {
        if (!d.children && !d._children) {
          submit(d);
        }
      });

    nodes.each(function (d) {
      const node = d3.select(this);

      if (d.data.image) {
        node
          .append('image')
          .attr('xlink:href', d.data.image)
          .attr('x', -12)
          .attr('y', 0)
          .attr('width', 24)
          .attr('height', 24);
      } else {
        node
          .append('circle')
          .attr('r', CIRCLE_RADIUS)
          .attr('x', -12)
          .attr('y', 0);

        node
          .append('text')
          .attr('dy', '.35rem')
          .attr('x', (d) => (d.children ? -8 : 8))
          .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
          .text((d) => d.data.name);
      }
    });
  };

  const svgRef = useRef(null);

  useEffect(() => {
    if (data) {
      const svg = d3.select(svgRef.current);
      const hierarchy = createTree();
      createLinks(svg, hierarchy);
      createNodes(svg, hierarchy);
    }
  }, [data]);

  return <svg ref={svgRef} width={600} height={600}></svg>;
};

export default HierarchyChart;
