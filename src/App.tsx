import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { Cluster, hierarchy } from "@visx/hierarchy";
import {
  HierarchyPointNode,
  HierarchyPointLink,
} from "@visx/hierarchy/lib/types";
import { LinkVertical } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import { confirmAlert } from "react-confirm-alert";
import "./App.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const citrus = "#000000";
const white = "#000000";
export const green = "#020202";
const aqua = "#222222";
const navyBlue = "#010080";
const red = "#ff0a19";
export const background = "#fff";

interface NodeShape {
  name: string;
  children?: NodeShape[];
  imgUrl?: string;
}

const clusterData: NodeShape = {
  name: "John Doe",
  children: [
    {
      name: "Hubspot",
      imgUrl:
        "https://www.rockethub.com/wp-content/uploads/2022/07/hubspot-logo.jpg",
      children: [
        {
          name: "hubspot-iPhone",
          imgUrl: "https://static.thenounproject.com/png/1314324-200.png",
        },
      ],
    },
    {
      name: "Github",
      imgUrl:
        "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      children: [
        {
          name: "Github-iPhone",
          imgUrl: "https://static.thenounproject.com/png/1314324-200.png",
        },
        {
          name: "Github-Mac",
          imgUrl: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
      ],
    },
    {
      name: "Copilot",
      imgUrl:
        "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/chrome.png",
      children: [
        {
          name: "Copilot-iPhone",
          imgUrl: "https://static.thenounproject.com/png/1314324-200.png",
        },
        {
          name: "Copilot-Mac",
          imgUrl: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "Copilot-Windows",
          imgUrl:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
      ],
    },
    {
      name: "Atlassian",
      imgUrl:
        "https://cdn.icon-icons.com/icons2/2407/PNG/512/atlassian_icon_146225.png",
      children: [
        {
          name: "at-Mac",
          imgUrl: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "at-Windows",
          imgUrl:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
      ],
    },
  ],
};

function RootNode({ node }: { node: HierarchyPointNode<NodeShape> }) {
  const width = 80;
  const height = 30;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        y={centerY}
        x={centerX}
        fill="url('#top')"
      />
      <text
        dy=".33em"
        fontSize={16}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={background}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function Node({
  node,
  onclick,
}: {
  node: HierarchyPointNode<NodeShape>;
  onclick: any;
}) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;
  const isLeaf = !node.children || node.children.length === 0;

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <>
          <image
            href={node.data.imgUrl}
            width={30} // Set width as needed
            height={30} // Set height as needed
            x={-15}
            y={-3}
            onClick={() => {
              if (isLeaf) {
                onclick();
              }
            }}
          />
          <text
            dy=".33em"
            fontSize={9}
            fontFamily="Arial"
            textAnchor="middle"
            style={{ pointerEvents: "none" }}
            fill={isParent ? white : citrus}
          ></text>
        </>
      )}
    </Group>
  );
}

export type DendrogramProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

export default function App({
  width,
  height,
  margin = defaultMargin,
}: DendrogramProps) {
  const data = useMemo(() => hierarchy<NodeShape>(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const [terminatedNodes, setTerminatedNodes] = useState<string[]>([]);

  const onClickonNode = (nodeName: string) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Success",
          onClick: () => console.log("Yes"),
        },
        {
          label: "Terminate",
          onClick: () => {
            console.log("No");
            setTerminatedNodes((prevNodes) => [...prevNodes, nodeName]);
          },
        },
      ],
    });
  };

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={green} to={aqua} />
      <Cluster<NodeShape> root={data} size={[xMax, yMax]}>
        {(cluster: any) => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link: any, i: any) => {
              const isTerminated =
                terminatedNodes.includes(link.target.data.name) ||
                terminatedNodes.includes(link.source.data.name);
              const strokeColor = isTerminated ? red : navyBlue;

              return (
                <LinkVertical<
                  HierarchyPointLink<NodeShape>,
                  HierarchyPointNode<NodeShape>
                >
                  key={`cluster-link-${i}`}
                  data={link}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeOpacity={0.2}
                  fill="none"
                />
              );
            })}
            {cluster.descendants().map((node: any, i: any) => (
              <Node
                key={`cluster-node-${i}`}
                node={node}
                onclick={() => onClickonNode(node.data.name)}
              />
            ))}
          </Group>
        )}
      </Cluster>
      <div></div>
    </svg>
  );
}
