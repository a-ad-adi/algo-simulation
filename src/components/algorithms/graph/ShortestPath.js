import React, { Component } from "react";
import ShortestPath_Animation from "./ShortestPath_Animation";
import Node from "./Node";
import { Raphael, Paper, Set, Rect, Line, Circle, Text } from "react-raphael";
import uuid from "uuid";
import { nTypes } from "./../../../util/GlobalVars";

import "./../../../css/ShortestPath.css";

export default class ShortestPath extends Component {
  constructor(props) {
    super(props);
    let nodeList = [];
    let c = 0;
    this.state = {
      grid: {},
      gridLocked: false,
      isReady: false,
      start: null,
      node1: null,
      node2: null,
      lines: {},
      circles: {},
      edgeWts: {},
      res: [],
      stepNo: -1,
      actions: []
    };

    for (let i = 0; i < ROWS * COLS; i++) {
      this.state[`${i}`] = null;
    }
    this.setIsReady = this.setIsReady.bind(this);
    this.loadGrid = this.loadGrid.bind(this);
    this.lockGrid = this.lockGrid.bind(this);
    this.addNode = this.addNode.bind(this);
    this.removeLine = this.removeLine.bind(this);
  }

  setIsReady(isReady) {
    this.setState({ isReady });
  }

  loadGrid(doClear) {
    this.setState({
      grid: {},
      gridLocked: false,
      isReady: false,
      node1: null,
      node2: null,
      lines: {},
      circles: {},
      edgeWts: {},
      res: [],
      stepNo: -1
    });

    let c = 0;
    let grid = {};
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const x = j * OFFSET;
        const y = i * OFFSET;
        const newNode = this.getNewNode({
          id: c,
          status: DEFAULT,
          x,
          y,
          attr: ATTR.DEFAULT,
          onClickHandler: this.addNode
        });
        grid[`${c}`] = newNode;
        c++;
      }
    }

    if (!doClear) {
      this.setState({ grid }, () => this.drawDummyGraph());
    } else this.setState({ grid });
  }

  lockGrid() {
    if (this.state.gridLocked) return;
    const grid = this.state.grid;
    if (Object.getOwnPropertyNames(this.state.lines).length === 0) {
      this.sendMessage(NO_EGDES);
      return;
    }

    Object.getOwnPropertyNames(grid).forEach(id => {
      if (grid[`${id}`].meta.status === DEFAULT) this.removeNode(id);
      else this.setStatus(id, LOCKED);
    });
    this.setState({ gridLocked: true, isReady: true });
  }

  canAddLine(node1, node2) {
    return (
      node1 &&
      node2 &&
      (node1.status === SELECTED ||
        (node2.status === SELECTED && node1.status === CREATED))
    );
  }

  addLine() {
    let { node1: p1, node2: p2 } = this.state;
    const { lines, circles, edgeWts } = this.state;
    if (p1 && p2) {
      if (this.canAddLine(p1, p2)) {
        const id = this.getLineId(p1, p2);

        if (!lines[`${id}`]) {
          const wt = this.calcWt(p1, p2);
          lines[`${id}`] = this.getNewLine({ id, p1, p2, wt });
          const { x, y } = this.calcOrigin(p1, p2);
          circles[`${id}`] = this.getNewCircle({ id, x, y });
          edgeWts[`${id}`] = this.getNewEdgeWt({
            id,
            x,
            y,
            wt,
            onDoubleClickHandler: () => this.removeLine(id)
          });
        }
        this.setStatus(p1.id, DESELECTED);
        this.setStatus(p2.id, DESELECTED);
        p1 = null;
        p2 = null;
        this.setState({ lines, circles, edgeWts, node1: p1, node2: p2 });
      }
    }
  }

  render() {
    if (this.state.isReady)
      return (
        <div className="shortest-path">{this.loadShortestPathOutput()}</div>
      );
    else
      return (
        <div className="shortest-path">{this.loadShortestPathInput()}</div>
      );
  }

  //Helper functions

  //render related
  loadShortestPathOutput() {
    const { grid, lines, circles, edgeWts } = this.loadGraphMetaData();
    return (
      <ShortestPath_Animation
        getNewNode={this.getNewNode}
        getNewCustomNode={this.getNewCustomNode}
        getNewRect={this.getNewRect}
        getNewLine={this.getNewLine}
        getNewCircle={this.getNewCircle}
        getNewEdgeWt={this.getNewEdgeWt}
        notify={this.props.notify}
        clearNotifications={this.props.clearNotifications}
        setIsReady={this.setIsReady}
        grid={grid}
        lines={lines}
        circles={circles}
        edgeWts={edgeWts}
      />
    );
  }

  loadShortestPathInput() {
    const { grid, lines, circles, edgeWts } = this.loadComponents();
    return (
      <div>
        <div className="input-menubar" />
        <div className="actions">
          {this.state.actions}
          {this.getMenu({
            value: "Done",
            onClickHandler: this.lockGrid
          })}
          {this.getMenu({
            value: "New",
            onClickHandler: () => this.loadGrid(false)
          })}
          {this.getMenu({
            value: "Reset",
            onClickHandler: () => this.loadGrid(true)
          })}
        </div>
        <div className="init">
          <Paper width={500} height={350}>
            <Set>{grid}</Set>
            <Set>{lines}</Set>
            <Set>{circles}</Set>
            <Set>{edgeWts}</Set>
          </Paper>
        </div>
        <div className="simulation">
          <div className="stepwise-graphs" />
        </div>
      </div>
    );
  }

  loadGraphMetaData() {
    const { grid, lines, circles, edgeWts } = this.state;
    const [gridInfo, linesInfo, circlesInfo, edgeWtsInfo] = [{}, {}, {}, {}];

    Object.getOwnPropertyNames(grid).forEach(id => {
      gridInfo[`${id}`] = grid[`${id}`].meta;
    });

    Object.getOwnPropertyNames(lines).forEach(id => {
      linesInfo[`${id}`] = lines[`${id}`].meta;
    });

    Object.getOwnPropertyNames(circles).forEach(id => {
      circlesInfo[`${id}`] = circles[`${id}`].meta;
    });

    Object.getOwnPropertyNames(edgeWts).forEach(id => {
      edgeWtsInfo[`${id}`] = edgeWts[`${id}`].meta;
    });

    return {
      grid: gridInfo,
      lines: linesInfo,
      circles: circlesInfo,
      edgeWts: edgeWtsInfo
    };
  }
  getMenu({ value, onClickHandler }) {
    return (
      <input
        type="button"
        className="btn"
        value={value}
        onClick={onClickHandler}
      />
    );
  }

  //graph generation related
  setActiveNode({ id, status, x, y }) {
    return { id, status, x, y };
  }

  getNewNode({ id, status, x, y, attr, onClickHandler }) {
    return {
      meta: { id, status, x, y, attr, onClickHandler },
      node: (
        <Node
          key={id}
          id={id}
          status={status}
          x={x}
          y={y}
          onClickHandler={onClickHandler}
          attr={{
            ...attr,
            width: WIDTH,
            height: HEIGHT,
            OFFSET: OFFSET,
            cursor: "pointer"
          }}
        />
      )
    };
  }

  getNewCustomNode({ id, status, x, y, attr, onClickHandler }) {
    return {
      meta: { id, status, x, y, attr, onClickHandler },
      node: (
        <Node
          key={id}
          id={id}
          status={status}
          x={x}
          y={y}
          onClickHandler={onClickHandler}
          attr={attr}
        />
      )
    };
  }

  addNode(id) {
    if (this.state.gridLocked && this.state.start == null) {
      this.setStatus(id, START_NODE);
      this.setState({ start: this.state.grid[`${id}`].meta });
    } else if (!this.state.gridLocked) {
      this.changeStatus(id);
      let { node1, node2 } = this.state;
      let { status, x, y } = this.state.grid[`${id}`].meta;
      if (node1) {
        if (node1.id !== id) node2 = this.setActiveNode({ id, status, x, y });
      } else {
        node1 = this.setActiveNode({ id, status, x, y });
      }
      this.setState({ node1, node2 }, this.addLine);
    }
  }

  //node attributes and status related
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
      case LOCKED:
        return ATTR.LOCKED;
      case START_NODE:
        return ATTR.START_NODE;
    }
  }

  loadComponents() {
    let [grid, lines, circles, edgeWts] = [{}, {}, {}, {}];

    grid = this.getComponentCollection(COLLECTION.GRID, PROPS.NODE);
    lines = this.getComponentCollection(COLLECTION.LINES, PROPS.LINE);
    circles = this.getComponentCollection(COLLECTION.CIRLCES, PROPS.CIRCLE);
    edgeWts = this.getComponentCollection(COLLECTION.WTS, PROPS.WT);
    return { grid, lines, circles, edgeWts };
  }

  getComponentCollection(type, prop) {
    const src = this.state;
    let collection = [];
    Object.getOwnPropertyNames(src[`${type}`]).forEach(id => {
      collection.push(src[`${type}`][`${id}`][`${prop}`]);
    });
    return collection;
  }

  //edge related
  getLineId(node1, node2) {
    if (node1.x < node2.x) {
      return `${node1.x}:${node1.y}:${node2.x}:${node2.y}`;
    } else if (node1.x > node2.x) {
      return `${node2.x}:${node2.y}:${node1.x}:${node1.y}`;
    } else {
      if (node1.y < node2.y)
        return `${node1.x}:${node1.y}:${node2.x}:${node2.y}`;
      else if (node1.y > node2.y)
        return `${node2.x}:${node2.y}:${node1.x}:${node1.y}`;
    }
    return `${node1.x}:${node1.y}:${node2.x}:${node2.y}`;
  }

  getNewRect({ x, y, attr }) {
    return <Rect x={x} y={y} attr={attr} />;
  }

  getNewLine({ id, p1, p2, wt, attr }) {
    // let stroke="black", strokeWidth=1;
    return {
      meta: {
        id,
        x1: p1.x,
        x2: p2.x,
        y1: p1.y,
        y2: p2.y,
        from: p1.id,
        to: p2.id,
        wt,
        attr
      },
      line: (
        <Line
          key={id}
          x1={p1.x + OFFSET / 5}
          y1={p1.y + OFFSET / 5}
          x2={p2.x + OFFSET / 5}
          y2={p2.y + OFFSET / 5}
          attr={attr}
        />
      )
    };
  }

  getNewCircle({ id, x, y }) {
    return {
      meta: { id, x, y },
      circle: (
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
      )
    };
  }

  getNewEdgeWt({ id, x, y, wt, onDoubleClickHandler }) {
    return {
      meta: { id, x, y, wt },
      wt: (
        <Text
          dblclick={onDoubleClickHandler}
          id={id}
          key={id}
          x={x + OFFSET / 5}
          y={y + OFFSET / 5}
          text={`${wt}`}
          attr={{ fill: "red", "font-size": 12, cursor: "pointer" }}
        />
      )
    };
  }

  removeNode(id) {
    const grid = this.state.grid;
    delete grid[`${id}`];
    this.setState({ grid });
  }

  removeLine(id) {
    "use strict";
    if (!this.state.gridLocked) {
      let { lines, circles, edgeWts } = this.state;
      delete lines[`${id}`];
      delete edgeWts[`${id}`];
      delete circles[`${id}`];
      this.setState({ lines, circles, edgeWts });
    }
  }

  calcWt(node1, node2) {
    return Math.floor(
      Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2))
    );
  }

  calcOrigin(node1, node2) {
    return { x: (node1.x + node2.x) / 2, y: (node1.y + node2.y) / 2 };
  }
  //forcefull set
  setStatus(nodeId, newStatus) {
    const grid = this.state.grid;
    let { id, status, x, y, attr } = grid[`${nodeId}`].meta;
    status = newStatus;
    attr = this.getAttrs(status);

    const newNode = this.getNewNode({
      id,
      status,
      x,
      y,
      attr,
      onClickHandler: this.addNode
    });
    grid[`${nodeId}`] = newNode;

    this.setState({ grid });
  }

  // automatic change
  changeStatus(nodeId) {
    const grid = this.state.grid;
    let { key, id, status, x, y, attr } = grid[`${nodeId}`].meta;
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
    this.setStatus(id, status);
  }

  //notifications related
  sendMessage(msg) {
    this.props.notify({
      id: uuid(),
      timeOut: 4000,
      type: nTypes.NOTIFY,
      msg
    });
  }

  drawDummyGraph() {
    const { lines, circles, edgeWts } = this.state;
    const edges = [
      { from: 91, to: 63, id: 0 },
      { from: 91, to: 122, id: 1 },
      { from: 63, to: 67, id: 2 },
      { from: 122, to: 126, id: 3 },
      { from: 67, to: 98, id: 4 },
      { from: 126, to: 98, id: 5 }
    ];
    edges.forEach(e => {
      const p1 = this.state.grid[`${e.from}`].meta;
      const p2 = this.state.grid[`${e.to}`].meta;
      this.setStatus(p1.id, CREATED);
      this.setStatus(p2.id, CREATED);
      const id = e.id;
      if (!lines[`${id}`]) {
        const wt = this.calcWt(p1, p2);
        lines[`${id}`] = this.getNewLine({ id, p1, p2, wt });
        const { x, y } = this.calcOrigin(p1, p2);
        circles[`${id}`] = this.getNewCircle({ id, x, y });
        edgeWts[`${id}`] = this.getNewEdgeWt({
          id,
          x,
          y,
          wt,
          onDoubleClickHandler: () => this.removeLine(id)
        });
      }
    });
    this.setState({ lines, circles, edgeWts });
  }
}
const [WIDTH, HEIGHT, OFFSET] = [25, 25, 40];
const [DEFAULT, CREATED, SELECTED, DESELECTED, LOCKED, START_NODE] = [
  "default",
  "created",
  "selected",
  "deselected",
  "locked",
  "start node"
];
const [NO_EGDES, EMPTY_GRAPH, NOT_DONE] = [
  "No edges in the graph",
  'The graph is empty.Please click "New" to create a graph',
  "Please press done if the graph is ready"
];

const [ROWS, COLS] = [8, 30];

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
  START_NODE: {
    fill: "orangered",
    opacity: 0.8
  }
};

const COLLECTION = {
  GRID: "grid",
  LINES: "lines",
  CIRLCES: "circles",
  WTS: "edgeWts"
};
const PROPS = {
  META: "meta",
  NODE: "node",
  LINE: "line",
  CIRCLE: "circle",
  WT: "wt"
};
