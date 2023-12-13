import React, { useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as d3 from 'd3';

const TREE_SIZE = [700, 400];
const CIRCLE_RADIUS = 5;

const HierarchyChart = ({ data }) => {
  const isNodeTerminated = (d) => {
    const svg = d3.select(svgRef.current);
    const currentColor = svg
      .selectAll('.link')
      .filter((link) => link.target === d)
      .attr('stroke');
    return currentColor === 'red';
  };

  const updatePathColor = (d) => {
    const svg = d3.select(svgRef.current);
    const newColor = isNodeTerminated(d) ? '#ccc' : 'red';
    svg
      .selectAll('.link')
      .filter((link) => link.target === d)
      .attr('stroke', newColor);
  };

  const toggleParentColor = (d) => {
    const svg = d3.select(svgRef.current);
    const allChildrenAreRed = svg
      .selectAll('.link')
      .filter((link) => link.source === d)
      .nodes()
      .every((node) => d3.select(node).attr('stroke') === 'red');

    return allChildrenAreRed;
  };

  const resetChildColors = (d) => {
    const svg = d3.select(svgRef.current);
    const newColor = toggleParentColor(d) ? '#ccc' : 'red';

    svg
      .selectAll('.link')
      .filter((link) => link.source === d)
      .attr('stroke', newColor);
  };

  const submit = (d) => {
    const isTerminated = isNodeTerminated(d);
    const allChildrenAreRed = toggleParentColor(d);
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
          label: isTerminated
            ? 'Enable'
            : d.depth === 1
            ? allChildrenAreRed
              ? 'Enable All'
              : 'Terminate All'
            : 'Terminate',
          onClick: () => {
            if (d.depth === 1) {
              resetChildColors(d);
            } else {
              updatePathColor(d);
            }
          },
        },
      ],
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .attr('d', (d) => {
        const link = d3
          .linkVertical()
          .x((d) =>
            !d.children && !d._children
              ? (d.parent ? d.parent.x : '') + 45
              : d.x
          )
          .y((d) => {
            if (!d.children && !d._children) {
              const parentY = d.parent ? d.parent.y + 125 : '';
              const verticalSpacing = 40;
              return parentY + verticalSpacing * d.parent.children.indexOf(d);
            } else {
              return d.y + 10;
            }
          });

        // Get the generated path
        const path = link(d);
        if (d.target.depth === 2) {
          // Extract M's x and y values
          const mValues = path.match(/([\d.]+),([\d.]+)$/);
          const lastNumber = mValues ? mValues[2] : null;
          console.log('Last Number:', lastNumber);
          console.log(d.target.depth);

          // Update the second control point dynamically
          const newPath = path.replace(
            /C([\d.]+),([\d.]+),([\d.]+),([\d.]+)/,
            (_, x1, y1) => {
              return `C${x1},${y1},${x1 - 10},${Number(lastNumber) + 15}`;
            }
          );
          console.log(newPath);
          return newPath;
        } else {
          return path;
        }
      })
      .attr('stroke', '#ccc');
  };

  // const createLinks = (svg, hierarchy) => {
  //   svg
  //     .selectAll('.link')
  //     .data(hierarchy.links())
  //     .enter()
  //     .append('path')
  //     .attr('class', 'link')
  //     .attr(
  //       'd',
  //       d3
  //         .linkVertical()
  //         .x((d) => {
  //           if (!d.children && !d._children) {
  //             const parentX = d.parent ? d.parent.x : '';
  //             return parentX + 50;
  //           } else {
  //             return d.x;
  //           }
  //         })
  //         .y((d) => {
  //           if (!d.children && !d._children) {
  //             const parentY = d.parent ? d.parent.y + 120 : ''; // Get the y coordinate of the parent node
  //             const verticalSpacing = 35; // Adjust this value for the desired vertical spacing between leaf nodes

  //             // Calculate the y coordinate for the leaf node with a gap of 100 units
  //             return parentY + verticalSpacing * d.parent.children.indexOf(d);
  //             // return d.parent.y;
  //           } else {
  //             return d.y + 10;
  //           }
  //         })
  //     )
  //     .attr('stroke', '#ccc');
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createNodes = (svg, hierarchy) => {
    // console.log(svg);
    const nodes = svg
      .selectAll('.node')
      .data(hierarchy.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        if (!d.children && !d._children) {
          // console.log(d.parent.children.indexOf(d));
          // Leaf nodes
          const parentY = d.parent ? d.parent.y + 120 : ''; // Get the y coordinate of the parent node
          const verticalSpacing = 35; // Adjust this value for the desired vertical spacing between leaf nodes

          // Calculate the y coordinate for the leaf node with a gap of 100 units
          return `translate(${d.parent.x + 50},${
            parentY + verticalSpacing * d.parent.children.indexOf(d)
          })`;
        } else if (d.depth === 0) {
          return `translate(${d.x},${d.y + 10})`;
        } else {
          return `translate(${d.x},${d.y})`;
        }
      })
      .on('click', (event, d) => {
        if (!d.children && !d._children) {
          // Call the submit function directly on the parent node click
          submit(d);
        } else if (d.depth === 1) {
          console.log('I got logged');
          // Reset child colors for parent nodes with children
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

      // Rotate the SVG to 90 degrees
      // svg.attr('transform', 'rotate(90)');
    }
  }, [createNodes, createTree, data]);

  return <svg ref={svgRef} width={500} height={600}></svg>;
};

export default HierarchyChart;
