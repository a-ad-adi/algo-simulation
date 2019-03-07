import React, { Component } from "react";
import MinimizeBtn from "../../MinimizeBtn";
import Node from "./Node";
import { Raphael, Paper, Set, Line, Circle } from "react-raphael";
import uuid from "uuid";
import "./../../../css/ShortestPath.css";

const [INPUT, ANIM_HEADER, ANIM_BODY] = [0, 1, 2];
const [nodeWidth, nodeHeight] = [50, 50];
const [lineWidth] = [2];
const [DEFAULT, CREATED, SELECTED, DESELECTED, LOCKED] = [
  "default",
  "created",
  "selected",
  "deselected",
  "locked"
];

export default class ShortestPath extends Component {
  constructor(props) {
    super(props);

    let nodeList = [];
    let c = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = j * nodeWidth + 5;
        const y = i * nodeHeight + 5;
        nodeList.push({
          id: c++,
          x,
          y,
          status: DEFAULT,
          attr: {
            fill: "#333",
            opacity: 0.05,
            width: 30,
            height: 30
          }
        });
      }
    }

    this.state = {
      cls: {
        inputArea: "init",
        animHeader: "sol-header",
        animBody: "sol-body"
      },
      attr: {
        fill: "#333",
        opacity: 0.05,
        width: 30,
        height: 30
      },
      nodeList,
      node1: null,
      node2: null,
      lines: [],
      lineInfo: [],
      edgeWts: []
    };

    this.addNode = this.addNode.bind(this);
    this.drawLine = this.drawLine.bind(this);
  }

  addNode(id) {
    this.changeStatus(id);
    let { node1, node2 } = this.state;
    if (node1) {
      if(node1.id !== id)
        node2 = this.state.nodeList[id];
    } else {
      node1 = this.state.nodeList[id];
    }
    this.setState({ node1, node2 });
    this.drawLine();
  }

  drawLine() {
    let { node1, node2 } = this.state;
    let { lines, lineInfo } = this.state;
    if (node1 && node2) {
      if (node1.status === SELECTED || node2.status === SELECTED) {
        const lineId = uuid();
        const p1 = { x: node1.x + nodeWidth / 5, y: node1.y + nodeHeight / 5 };
        const p2 = { x: node2.x + nodeWidth / 5, y: node2.y + nodeHeight / 5 };

        lines.push(
          <Line key={lineId} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
        );

        lineInfo.push({ id: lineId, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
        this.displayLineWt(lineId);
        this.setStatus(node1.id, DESELECTED);
        this.setStatus(node2.id, DESELECTED);
        node1 = null;
        node2 = null;
        this.setState({ lines, lineInfo, node1, node2 });
      }
    }
  }

  displayLineWt(id) {
    const line = this.state.lineInfo.find(l => l.id === id);
    console.log(line);
    const { x1, y1, x2, y2 } = line;
    const [cx, cy] = [(x1 + x2) / 2, (y1 + y2) / 2];
    let edgeWts = this.state.edgeWts;
    edgeWts.push(<Circle x={cx} y={cy} r={5} />);
    this.setState({ edgeWts });
  }

  //forcefull set
  setStatus(id, status) {
    let nodeList = this.state.nodeList;
    let node = this.state.nodeList[id];
    switch (status) {
      case DEFAULT:
        node.attr = {
          fill: "#333",
          opacity: 0.05,
          width: 30,
          height: 30
        };
        node.status = DEFAULT;
      case CREATED:
        node.attr = {
          fill: "red",
          opacity: 0.3,
          width: 30,
          height: 30
        };
        node.status = CREATED;
        break;

      case SELECTED:
        node.attr = {
          fill: "green",
          opacity: 0.6,
          width: 30,
          height: 30
        };

        node.status = SELECTED;
        break;

      case DESELECTED:
        node.attr = {
          fill: "red",
          opacity: 0.3,
          width: 30,
          height: 30
        };
        node.status = DESELECTED;
        break;

      case LOCKED:
        break;

      default:
        break;
    }
    nodeList[id] = node;
    this.setState({ nodeList });
  }

  // automatic change
  changeStatus(id) {
    let nodeList = this.state.nodeList;
    let node = nodeList[id];
    switch (node.status) {
      case DEFAULT:
        node.attr = {
          fill: "red",
          opacity: 0.3,
          width: 30,
          height: 30
        };
        node.status = CREATED;
        break;

      case CREATED:
        node.attr = {
          fill: "green",
          opacity: 0.6,
          width: 30,
          height: 30
        };

        node.status = SELECTED;
        break;

      case SELECTED:
        node.attr = {
          fill: "red",
          opacity: 0.3,
          width: 30,
          height: 30
        };
        node.status = DESELECTED;
        break;

      case DESELECTED:
        node.attr = {
          fill: "green",
          opacity: 0.6,
          width: 30,
          height: 30
        };
        node.status = SELECTED;
        break;

      case LOCKED:
        break;

      default:
        break;
    }
    nodeList[id] = node;
    this.setState({ nodeList });
  }

  render() {
    const nodeList = this.state.nodeList;
    const grid = nodeList.map((n, i) => {
      return (
        <Node
          key={i}
          id={i}
          status={n.status}
          x={n.x}
          y={n.y}
          addNode={this.addNode}
          attr={n.attr}
        />
      );
    });
    return (
      <div className="shortest-path">
        <div className="input-menubar">
          <p>Input:</p>
          <MinimizeBtn
            scaleToZero={this.scaleToZero}
            scaleToNormal={this.scaleToNormal}
            displayNone={this.displayNone}
            displayVisible={this.displayVisible}
            ref={ref => (this.getInputRef = ref)}
            sectionCode={INPUT}
          />
        </div>
        <div className={this.state.cls.inputArea}>
          <Paper width={500} height={500}>
            <Set>{this.state.lines}</Set>
            <Set>{this.state.edgeWts}</Set>
            <Set>{grid}</Set>
          </Paper>
        </div>
        <hr />
        <div className="simulation" />
      </div>
    );
  }
}
