import React, { Component } from "react";
import MinimizeBtn from "../../MinimizeBtn";
import Node from "./Node";
import { Raphael, Paper, Set, Line, Circle, Text } from "react-raphael";
import uuid from "uuid";
import { findShortestPath } from "../../../algorithms/ShortestPath";
import { nTypes } from "./../../../util/GlobalVars";

import "./../../../css/ShortestPath.css";

export default class ShortestPath extends Component {
  constructor(props) {
    super(props);
    let nodeList = [];
    let c = 0;
    this.state = {
      grid: [],
      gridInfo: [],
      gridLocked: false,
      problemGrid: [],
      problemGridInfo: [],
      startNode: null,
      node1: null,
      node2: null,
      lines: [],
      lineInfo: [],
      edgeWts: [],
      circles: [],
      res: [],
      stepNo: -1,
      actions: []
    };

    for (let i = 0; i < 8 * 30; i++) {
      this.state[`${i}`] = null;
    }

    this.addNode = this.addNode.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.getLine = this.getLine.bind(this);
    this.erazeLine = this.erazeLine.bind(this);
    this.loadGrid = this.loadGrid.bind(this);
    this.lockGrid = this.lockGrid.bind(this);
    this.drawDummyGraph = this.drawDummyGraph.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.showSnapshot = this.showSnapshot.bind(this);
  }

  getNewNode({ id, status, x, y, attr }) {
    return (
      <Node
        key={id}
        id={id}
        status={status}
        x={x}
        y={y}
        addNode={this.addNode}
        attr={{
          ...attr,
          width: WIDTH,
          height: HEIGHT,
          OFFSET: OFFSET,
          cursor: "pointer"
        }}
      />
    );
  }

  sendMessage(msg) {
    this.props.notify({
      id: uuid(),
      timeOut: 4000,
      type: nTypes.NOTIFY,
      msg
    });
  }
  getAttrs(status) {
    switch (status) {
      case DEFAULT:
        return ATTR.DEFAULT;
      case CREATED:
        return ATTR.CREATED;
      case SELECTED:
        return ATTR.SELECTED;
      case DESELECTED:
        return ATTR.DESELECTED;
      case START_NODE:
        return ATTR.START_NODE;
      case REMOVED:
        return ATTR.REMOVED;
      case LOCKED:
        return ATTR.LOCKED;
    }
  }
  addNode(id) {
    if (this.state.gridLocked && !this.state.startNode) {
      this.setStatus(id, START_NODE);
    } else if (!this.state.gridLocked) {
      this.changeStatus(id);
      let { node1, node2 } = this.state;
      if (node1) {
        if (node1.id !== id) node2 = this.state.gridInfo[id];
      } else {
        node1 = this.state.gridInfo[id];
      }
      this.setState({ node1, node2 });
      this.drawLine();
    }
  }

  drawLine() {
    let { node1, node2 } = this.state;
    let { lines, lineInfo } = this.state;
    if (node1 && node2) {
      if (node1.status === SELECTED || node2.status === SELECTED) {
        const lineId = uuid();
        const p1 = { x: node1.x, y: node1.y, id: node1.id };
        const p2 = { x: node2.x, y: node2.y, id: node2.id };

        if (
          !lineInfo.find(
            node =>
              (node.x1 === p1.x &&
                node.x2 === p2.x &&
                node.y1 === p1.y &&
                node.y2 === p2.y) ||
              (node.x1 === p2.x &&
                node.x2 === p1.x &&
                node.y1 === p2.y &&
                node.y2 === p1.y)
          )
        ) {
          console.log("adding line..");
          lines.push(this.getLine(lineId, p1, p2));
          lineInfo.push(this.getLineInfo(lineId, p1, p2));
          this.displayLineWt(lineId);
          console.log(lineInfo);
        }
        this.setStatus(node1.id, DESELECTED);
        this.setStatus(node2.id, DESELECTED);
        node1 = null;
        node2 = null;
        this.setState({ lines, lineInfo, node1, node2 });
      }
    }
  }

  getLine(id, p1, p2) {
    return (
      <Line
        key={id}
        x1={p1.x + OFFSET / 5}
        y1={p1.y + OFFSET / 5}
        x2={p2.x + OFFSET / 5}
        y2={p2.y + OFFSET / 5}
      />
    );
  }

  getLineInfo(id, p1, p2) {
    const wt = Math.floor(
      Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    );
    return {
      id,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      from: p1.id,
      to: p2.id,
      wt
    };
  }

  getCircle(id, x, y) {
    return (
      <Circle
        id={id}
        key={id}
        x={x + OFFSET / 5}
        y={y + OFFSET / 5}
        r={12}
        attr={{
          fill: "white",
          opacity: 0.5,
          stroke: "black",
          cursor: "pointer"
        }}
      />
    );
  }

  getEdgeWt(id, x, y, wt) {
    return (
      <Text
        dblclick={() => this.erazeLine(id)}
        id={id}
        key={id}
        x={x + OFFSET / 5}
        y={y + OFFSET / 5}
        text={`${wt}`}
        attr={{ fill: "red", "font-size": 12, cursor: "pointer" }}
      />
    );
  }

  erazeLine(id) {
    if (!this.state.gridLocked) {
      let { lines, lineInfo, circles, edgeWts } = this.state;
      const remLine = lineInfo.indexOf(id => this.id === id);
      const remEdgeWt = edgeWts.indexOf(id => this.id === id);
      const remCircles = circles.indexOf(id => this.id === id);
      lines.splice(remLine, 1);
      lineInfo.splice(remLine, 1);
      edgeWts.splice(remEdgeWt, 1);
      circles.splice(remCircles, 1);
      this.setState({ lines, lineInfo, circles, edgeWts });
    }
  }

  displayLineWt(id) {
    const line = this.state.lineInfo.find(l => l.id === id);
    const { x1, y1, x2, y2 } = line;
    const [cx, cy] = [(x1 + x2) / 2, (y1 + y2) / 2];
    const wt = Math.floor(
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    );

    let { circles, edgeWts } = this.state;
    edgeWts.push(this.getEdgeWt(id, cx, cy, wt));
    circles.push(this.getCircle(id, cx, cy));
    this.setState({ circles, edgeWts });
  }

  //forcefull set
  setStatus(nodeId, newStatus) {
    let { key, id, status, x, y, attr } = this.state.gridInfo[nodeId];
    let { grid, gridInfo } = this.state;
    status = newStatus;
    attr = this.getAttrs(status);
    grid[nodeId] = this.getNewNode({ id, status, x, y, attr });
    gridInfo[nodeId] = { key, id, status, x, y };
    this.setState({ grid, gridInfo });
    if (newStatus === START_NODE) {
      this.setState({ startNode: nodeId });
    }
  }

  // automatic change
  changeStatus(nodeId) {
    let { key, id, status, x, y, attr } = this.state.gridInfo[nodeId];
    let { grid, gridInfo } = this.state;
    switch (status) {
      case DEFAULT:
        status = CREATED;
        break;
      case CREATED:
        status = SELECTED;
        break;
      case SELECTED:
        status = DESELECTED;
        break;
      case DESELECTED:
        status = SELECTED;
        break;
      case LOCKED:
        break;
      default:
        break;
    }
    attr = this.getAttrs(status);
    grid[nodeId] = this.getNewNode({ id, status, x, y, attr });
    gridInfo[nodeId] = { key, id, status, x, y };
    this.setState({ grid, gridInfo });
  }

  nextStep() {
    let stepNo = this.state.stepNo;
    if (stepNo === this.state.res.length - 1) {
      this.sendMessage("Algorithm completed..");
      return;
    }
    this.sendMessage(`Step no :  ${stepNo}`);
    this.setState({ stepNo: ++stepNo });
    this.loadStep();
  }

  prevStep() {
    let stepNo = this.state.stepNo;
    if (stepNo === 0) {
      this.sendMessage("We are at the first step..");
      return;
    }
    this.sendMessage(`Step no :  ${stepNo}`);
    this.setState({ stepNo: --stepNo });
    this.loadStep();
  }

  loadStep() {
    const { stepNo, res, problemGrid } = this.state;
  }

  showSnapshot() {}

  loadGrid(doClear) {
    this.setState({
      gridLocked: false,
      startNode: null,
      node1: null,
      node2: null,
      lines: [],
      lineInfo: [],
      circles: [],
      edgeWts: []
    });
    let [c, grid, gridInfo] = [0, [], []];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 30; j++) {
        const x = j * OFFSET;
        const y = i * OFFSET;
        gridInfo.push({ id: c, status: DEFAULT, x, y });
        grid.push(
          this.getNewNode({
            id: c,
            status: DEFAULT,
            x,
            y,
            addNode: this.addNode,
            attr: ATTR.DEFAULT
          })
        );
        c++;
      }
    }

    if (doClear) {
      this.setState({ grid, gridInfo });
    } else {
      this.setState({ grid, gridInfo }, this.drawDummyGraph);
    }
  }

  drawDummyGraph() {
    let { grid, gridInfo, lines, lineInfo, circles, edgeWts } = this.state;
    const edges = [
      { from: 91, to: 63 },
      { from: 91, to: 122 },
      { from: 63, to: 67 },
      { from: 122, to: 126 },
      { from: 67, to: 98 },
      { from: 126, to: 98 }
    ];
    edges.forEach((e, id) => {
      const p1 = this.state.gridInfo[e.from];
      const p2 = this.state.gridInfo[e.to];
      gridInfo[e.from].status = CREATED;
      gridInfo[e.to].status = CREATED;

      grid[e.from] = this.getNewNode({
        id: p1.id,
        status: CREATED,
        x: p1.x,
        y: p1.y,
        attr: ATTR.CREATED
      });

      grid[e.to] = this.getNewNode({
        id: p2.id,
        status: CREATED,
        x: p2.x,
        y: p2.y,
        attr: ATTR.CREATED
      });

      const [cx, cy] = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
      const wt = Math.floor(
        Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      );
      lines.push(this.getLine(id, p1, p2));
      lineInfo.push(this.getLineInfo(id, p1, p2));
      circles.push(this.getCircle(id, cx, cy));
      edgeWts.push(this.getEdgeWt(id, cx, cy, wt));
    });

    this.setState({ grid, gridInfo, lines, lineInfo, edgeWts, circles });
  }

  lockGrid() {
    if (this.state.gridLocked) return;
    if (this.state.lines.length === 0) {
      this.sendMessage(EMPTY_GRAPH);
      return;
    }
    let { gridInfo } = this.state;
    gridInfo.forEach(node => {
      if (node.status === DEFAULT) this.setStatus(node.id, REMOVED);
      else this.setStatus(node.id, LOCKED);
    });
    this.setState({ gridLocked: true, gridInfo });
  }

  addToProblemGridNodes(nodes, line, problemGridInfo) {
    if (
      !problemGridInfo ||
      problemGridInfo.map(node => node.id).indexOf(line.from) === -1
    ) {
      const { id, x, y, status } = this.state.gridInfo[line.from];
      problemGridInfo.push({ id, x, y, status });
    }
    if (
      !problemGridInfo ||
      problemGridInfo.map(node => node.id).indexOf(line.to) === -1
    ) {
      const { id, x, y, status } = this.state.gridInfo[line.to];
      problemGridInfo.push({ id, x, y, status });
    }

    if (nodes.indexOf(line.from) === -1) nodes.push(line.from);
    if (nodes.indexOf(line.to) === -1) nodes.push(line.to);
  }

  addToProblemGridEdges(adjList, line) {
    if (adjList[`${line.from}`]) {
      if (
        adjList[`${line.from}`].map(dest => dest.to).indexOf(line.to) === -1
      ) {
        adjList[`${line.from}`].push({ id: line.id, to: line.to, wt: line.wt });
      }
    } else {
      adjList[`${line.from}`] = [{ id: line.id, to: line.to, wt: line.wt }];
    }
  }

  prepareInput() {
    let { lineInfo, problemGridInfo } = this.state;
    let adjList = {};
    let nodes = [];
    lineInfo = lineInfo.map(line => {
      return {
        from: Number(line.from),
        to: Number(line.to),
        wt: Number(line.wt),
        id: Number(line.id)
      };
    });

    lineInfo.forEach((line, id) => {
      this.addToProblemGridNodes(nodes, line, problemGridInfo);
      this.addToProblemGridEdges(adjList, line);
    });
    this.switchToProblemGrid(problemGridInfo);
    return { edges: adjList, nodes };
  }

  switchToProblemGrid(problemGridInfo) {
    let { problemGrid } = this.state;
    problemGridInfo.forEach(node => {
      let { id, status, x, y, attr } = node;
      const newNode = this.getNewNode({
        id,
        status,
        x,
        y,
        attr: this.getAttrs(status)
      });
      problemGrid.push(newNode);
    });

    console.log("switch to : ", problemGrid, this.state.grid);
    this.setState({ grid: problemGrid, gridInfo: problemGridInfo });
  }

  startAnimation() {
    if (this.state.lines.length === 0) {
      this.sendMessage(NO_EGDES);
      return;
    }

    if (!this.state.gridLocked) {
      this.sendMessage(NOT_DONE);
      return;
    }
    if (!this.state.startNode) {
      this.sendMessage(NO_START_NODE);
      return;
    }
    if (this.state.stepNo > -1) return;

    const res = findShortestPath(this.prepareInput(), this.state.startNode);
    this.initAnimation(res);
  }

  initAnimation(res) {
    const actions = [
      <input
        type="button"
        className="btn"
        value="Next"
        onClick={() => this.nextStep()}
      />,
      <input
        type="button"
        className="btn"
        value="Previous"
        onClick={() => this.prevStep()}
      />
    ];

    this.setState({ actions, res, stepNo: 0 });
    this.nextStep();
  }

  render() {
    return (
      <div className="shortest-path">
        <div className="input-menubar" />
        <div className="actions">
          {this.state.actions}
          <input
            type="button"
            className="btn"
            value="Done"
            onClick={this.lockGrid}
          />
          <input
            type="button"
            className="btn"
            value="New"
            onClick={() => this.loadGrid(false)}
          />
          <input
            type="button"
            className="btn"
            value="Reset"
            onClick={() => this.loadGrid(true)}
          />
          <input
            type="button"
            className="btn"
            value="Start"
            onClick={this.startAnimation}
          />
        </div>
        <div className="init">
          <Paper width={500} height={350}>
            <Set>{this.state.grid}</Set>
            <Set>{this.state.lines}</Set>
            <Set>{this.state.circles}</Set>
            <Set>{this.state.edgeWts}</Set>
          </Paper>
        </div>
        {/* <hr /> */}
        <div className="simulation">
          <div className="stepwise-graphs">
            <div className="step">Step 1</div>
            <div className="step">Step 2</div>
            <div className="step">Step 3</div>
            <div className="step">Step 4</div>
            <div className="step">Step 4</div>
            <div className="step">Step 4</div>
          </div>
        </div>
      </div>
    );
  }
}

const [WIDTH, HEIGHT, OFFSET] = [25, 25, 40];
const [DEFAULT, CREATED, SELECTED, DESELECTED, LOCKED, REMOVED, START_NODE] = [
  "default",
  "created",
  "selected",
  "deselected",
  "locked",
  "removed",
  "start node"
];
const [NO_EGDES, EMPTY_GRAPH, NO_START_NODE, NOT_DONE] = [
  "No edges in the graph",
  'The graph is empty.Please click "New" to create a graph',
  "Please select a start node",
  "Please press done if the graph is ready"
];

const ATTR = {
  DEFAULT: {
    fill: "#333",
    opacity: 0.05
  },
  CREATED: {
    fill: "red",
    opacity: 0.3
  },
  SELECTED: {
    fill: "green",
    opacity: 0.6
  },
  DESELECTED: {
    fill: "red",
    opacity: 0.3
  },
  LOCKED: {
    fill: "#333",
    opacity: 0.6
  },
  REMOVED: {
    opacity: 0
  },
  START_NODE: {
    fill: "orangered",
    opacity: 0.8
  }
};
