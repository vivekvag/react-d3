import React from "react";
import Tree from "react-d3-tree";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";



const debugData = [
  {
    name: "Grapql API",
    children: [
      {
        name: "Query",
        children: [
          {
            name: "1"
          },
        ]
      },
      {
        name: "Query",
        children: [
          {
            name: "1"
          },
          {
            name: "2"
          },
        ]
      },
      {
        name: "Query",
        children: [
          {
            name: "1"
          },
          {
            name: "2"
          },
          {
            name: "3"
          },
        ]
      },
      {
        name: "Query",
        children: [
          {
            name: "2"
          },
          {
            name: "3"
          },
        ]
      }
    ]
  }
];

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const svgSquare = {
  shape: "rect",
  shapeProps: {
    width: 5,
    height: 5,
    x: -5,
    y: -5,
  },
};

export default class CenteredTree extends React.PureComponent {

  state = {
    selectedNode: null,
  };

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 10,
        y: dimensions.width / 3,
      },
    });
  }

  handleNodeClick = (nodeData) => {
    // Check if the clicked node is a leaf node
    if (!nodeData.children || nodeData.children.length === 0) {
      // Call your function here
      console.log("Leaf node clicked:", nodeData.name);

      confirmAlert({
        title: "Confirm to submit",
        message: "Are you sure to do this.",
        buttons: [
          {
            label: "Yes",
            onClick: () => alert("Click Yes"),
          },
          {
            label: "No",
            onClick: () => {
              this.setState({ selectedNode: nodeData });
              console.log()
            },
          },
        ],
      });
    }
  };

  render() {
    return (
      <div style={containerStyles} ref={(tc) => (this.treeContainer = tc)}>
        <Tree
          data={debugData}
          translate={this.state.translate}
          orientation={"vertical"}
          nodeSvgShape={(nodeData) => {
            const isRedStroke =
              this.state.selectedNode &&
              this.state.selectedNode.name === nodeData.name;

            return {
              shape: "rect",
              shapeProps: {
                width: 5,
                height: 5,
                x: -5,
                y: -5,
                stroke: isRedStroke ? "red" : "black",
              },
            };
          }}
          circleRadius={5}
          onNodeClick={this.handleNodeClick}
        />
      </div>
    );
  }
}
