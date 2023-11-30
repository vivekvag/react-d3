import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { Cluster, hierarchy } from "@visx/hierarchy";
import {
  HierarchyPointNode,
  HierarchyPointLink,
} from "@visx/hierarchy/lib/types";
import { LinkVertical } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import './App.css'

const citrus = "#000000";
const white = "#000000";
export const green = "#020202";
const aqua = "#222222";
const merlinsbeard = "#020202aa";
export const background = "#ffff";

interface NodeShape {
  name: string;
  children?: NodeShape[];
  imgUrl?: string;
}

const clusterData: NodeShape = {
  name: "Vivek",
  children: [
    {
      name: "A",
      imgUrl:
        "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      children: [
        {
          name: "A1",
          imgUrl:
            "https://i.pinimg.com/originals/b8/ae/b1/b8aeb1b09d6c6529cbcf66b414052d57.png",
        },
      ],
    },
    {
      name: "B",
      imgUrl:
        "https://www.rockethub.com/wp-content/uploads/2022/07/hubspot-logo.jpg",
      children: [
        {
          name: "B1",
          imgUrl:
            "https://i.pinimg.com/originals/b8/ae/b1/b8aeb1b09d6c6529cbcf66b414052d57.png",
        },
        {
          name: "B2",
          imgUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZth4srs693eCm9IBhPtbuMg83LmxFNsp8SK5tmtHtpiRcrMpJYzTBJHhezZq06A5kY8Y&usqp=CAU",
        },
        {
          name: "B3",
          imgUrl:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
      ],
    },
    {
      name: "D",
      imgUrl:
        "https://brandlogos.net/wp-content/uploads/2022/10/microsoft_365-logo_brandlogos.net_j9l2g.png",
      children: [
        {
          name: "Z",
          imgUrl:
            "https://i.pinimg.com/originals/b8/ae/b1/b8aeb1b09d6c6529cbcf66b414052d57.png",
        },
        {
          name: "web",
          imgUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZth4srs693eCm9IBhPtbuMg83LmxFNsp8SK5tmtHtpiRcrMpJYzTBJHhezZq06A5kY8Y&usqp=CAU",
        },
      ],
    },
    {
      name: "D",
      imgUrl:"https://cdn.icon-icons.com/icons2/2407/PNG/512/atlassian_icon_146225.png",
      children: [
        {
          name: "Z",
          imgUrl:
            "https://i.pinimg.com/originals/b8/ae/b1/b8aeb1b09d6c6529cbcf66b414052d57.png",
        },
        {
          name: "web",
          imgUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZth4srs693eCm9IBhPtbuMg83LmxFNsp8SK5tmtHtpiRcrMpJYzTBJHhezZq06A5kY8Y&usqp=CAU",
        },
      ],
    },
  ],
};


function RootNode({ node }: { node: HierarchyPointNode<NodeShape> }) {
  const width = 70;
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

const onClickImage = () => {};

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
            x={-12}
            y={-15}
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
          >
          </text>
        </>
      )}
    </Group>
  );
}

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

export type DendrogramProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function App({
  width,
  height,
  margin = defaultMargin,
}: DendrogramProps) {
  const data = useMemo(() => hierarchy<NodeShape>(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const onClickonNode = () => {
    console.log("onClickonNode");
  };

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={green} to={aqua} />
      <Cluster<NodeShape> root={data} size={[xMax, yMax]}>
        {(cluster: any) => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link: any, i: any) => (
              <LinkVertical<
                HierarchyPointLink<NodeShape>,
                HierarchyPointNode<NodeShape>
              >
                key={`cluster-link-${i}`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {cluster.descendants().map((node: any, i: any) => (
              <Node
                key={`cluster-node-${i}`}
                node={node}
                onclick={onClickonNode}
              />
            ))}
          </Group>
        )}
      </Cluster>
      <div>
      </div>
    </svg>
  );
}