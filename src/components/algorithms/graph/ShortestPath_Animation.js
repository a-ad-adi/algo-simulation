import React, { Component } from "react";
import Snapshot from "./Snapshot";
import Table from "./Table";
import { findShortestPath } from "../../../algorithms/ShortestPath";
import { Raphael, Paper, Set, Line, Circle, Text } from "react-raphael";
import uuid from "uuid";
import { nTypes } from "./../../../util/GlobalVars";
import "./../../../css/ShortestPath_Animation.css";
import { node } from "prop-types";

export default class ShortestPath_Animation extends Component {
  containerEnd;
  constructor(props) {
    super(props);
    this.state = {
      stepNo: -1,
      grid: {},
      start: null,
      lines: {},
      circles: {},
      edgeWts: {},
      snapshots: [],
      res: null
    };

    this.drawNewGraph = this.drawNewGraph.bind(this);
    this.start = this.start.bind(this);
    this.changeStartNode = this.changeStartNode.bind(this);
    this.restart = this.restart.bind(this);
    this.loadStep = this.loadStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.saveSnapshot = this.saveSnapshot.bind(this);
  }
  componentDidMount() {
    this.recreateGraph();
    this.restart();
  }

  componentDidUpdate() {
    this.scrollToBottom();
    console.log("update", this.state.snapshots);
  }

  drawNewGraph() {
    this.props.setIsReady(false);
  }
  recreateGraph() {
    let { grid, lines, circles, edgeWts } = this.state;
    grid = this.buildGraphNodes();
    lines = this.buildGraphLines();
    circles = this.buildGraphCircles();
    edgeWts = this.buildGraphEdgeWts();
    this.setState({ grid, lines, circles, edgeWts });
  }

  loadComponents() {
    let [grid, lines, circles, edgeWts] = [{}, {}, {}, {}];
    grid = this.getComponentCollection(COLLECTION.GRID, PROPS.NODE);
    lines = this.getComponentCollection(COLLECTION.LINES, PROPS.LINE);
    circles = this.getComponentCollection(COLLECTION.CIRLCES, PROPS.CIRCLE);
    edgeWts = this.getComponentCollection(COLLECTION.WTS, PROPS.WT);
    return { grid, lines, circles, edgeWts };
  }

  changeStartNode(start) {
    if (this.state.start) {
      if (this.state.start === start) return;
      this.sendMessage(MSG.NEW_START);
      return;
    }
    this.setState({ start });
    this.updateNodeWithAttr(start, ATTR.START_NODE);
  }

  prepareInput() {
    const lines = this.state.lines;
    let edges = {};
    let nodes = [];

    Object.getOwnPropertyNames(lines).forEach(id => {
      const { from, to, id: lineId, wt } = lines[`${id}`].meta;
      const p1TOp2 = {
        id: lineId,
        to: Number(to),
        wt: Number(wt)
      };
      const p2Top1 = {
        id: lineId,
        to: Number(from),
        wt: Number(wt)
      };
      if (edges[`${from}`]) edges[`${from}`].push(p1TOp2);
      else edges[`${from}`] = [p1TOp2];
      if (edges[`${to}`]) edges[`${to}`].push(p2Top1);
      else edges[`${to}`] = [p2Top1];
      if (nodes.indexOf(from) === -1) nodes.push(from);
      if (nodes.indexOf(to) === -1) nodes.push(to);
    });
    return { edges, nodes };
  }

  start() {
    if (this.state.start === null) {
      this.sendMessage(MSG.NO_START);
      return;
    }
    if (this.state.stepNo > -1 && this.state.stepNo < this.state.res.length)
      return;

    if (this.state.stepNo === -1) {
      this.props.clearNotifications();
      const res = findShortestPath(this.prepareInput(), this.state.start);
      this.setState({ res }, this.nextStep);
    } else {
      // this.sendMessage("problem..")
    }
  }

  restart() {
    this.props.clearNotifications();
    if (this.state.start)
      this.updateNodeWithAttr(this.state.start, ATTR.LOCKED);
    let lines = this.state.lines;
    lines = this.buildGraphLines();
    this.setState({ start: null, stepNo: -1, res: null, lines, snapshots: [] });
  }

  loadStep() {}

  prevStep() {
    if (this.state.stepNo <= -1) {
      this.sendMessage(MSG.AT_START);
      return;
    }

    let stepNo = this.state.stepNo;
    const lines = this.state.lines;
    this.animate(stepNo, lines, {
      minEdge: ANIM_ATTR.LINE.DHLT,
      visitedEdge: ANIM_ATTR.LINE.DHLT
    });
    this.setState({ lines, stepNo: --stepNo });
    this.sendMessage(`Step no: ${stepNo}`);
  }

  nextStep() {
    if (!this.hasNextStep()) return;
    let stepNo = this.state.stepNo;
    this.setState({ stepNo: ++stepNo });

    const lines = this.state.lines;
    this.animate(stepNo, lines, {
      minEdge: ANIM_ATTR.LINE.MIN,
      visitedEdge: ANIM_ATTR.LINE.HLT
    });
    this.setState({ lines });
    if (this.state.snapshots.length <= stepNo) {
      this.saveSnapshot();
      this.displayTable(stepNo);
    }
  }

  animate(stepNo, lines, attrs) {
    const res = this.state.res;
    const minEdge = res.minEdgeAtStep[stepNo] || -1;
    if (minEdge !== -1) {
      lines[`${minEdge}`] = this.updateLineWithAttr(minEdge, attrs.minEdge);
    }
    if (res.visitedEdgesAtStep[stepNo]) {
      res.visitedEdgesAtStep[stepNo].forEach(id => {
        if (id != minEdge) {
          lines[`${id}`] = this.updateLineWithAttr(id, attrs.visitedEdge);
        }
      });
    }
  }

  startAnimation() {
    this.nextStep();
  }

  saveSnapshot() {
    const { grid, lines, snapshots } = this.state;
    let [gridInfo, linesInfo] = [{}, {}];

    Object.getOwnPropertyNames(grid).forEach(id => {
      gridInfo[`${id}`] = grid[`${id}`].meta;
    });

    Object.getOwnPropertyNames(lines).forEach(id => {
      linesInfo[`${id}`] = lines[`${id}`].meta;
    });

    const sid = uuid();
    snapshots.push(
      <div key={sid} className="snapshot-container">
        <Snapshot
          id={sid}
          key={sid}
          getNewCustomNode={this.props.getNewCustomNode}
          getNewNode={this.props.getNewNode}
          getNewLine={this.props.getNewLine}
          gridInfo={gridInfo}
          linesInfo={linesInfo}
        />
      </div>
    );
    this.setState({ snapshots });
  }

  render() {
    const { grid, lines, circles, edgeWts } = this.loadComponents();
    const c = <div key={uuid()} className="snapshot-container" />;
    return (
      <div className="shortest-path-anim-container">
        <div className="controls">
          {this.getMenu({
            value: "New Graph",
            onClickHandler: this.drawNewGraph
          })}
          {this.getMenu({ value: "start", onClickHandler: this.start })}
          {this.getMenu({ value: "Restart", onClickHandler: this.restart })}
          {this.getMenu({ value: "Previous", onClickHandler: this.prevStep })}
          {this.getMenu({ value: "Next", onClickHandler: this.nextStep })}
        </div>
        <div className="shortest-path-graph">
          <Paper width={500} height={350}>
            <Set>{grid}</Set>
            <Set>{lines}</Set>
            <Set>{circles}</Set>
            <Set>{edgeWts}</Set>
          </Paper>
        </div>
        <div className="snapshots">
          {this.state.snapshots}
          {c}
          {/* <div key={uuid()}
            className="containerEnd"
            ref={ref => (this.containerEnd = ref)}
          /> */}
        </div>
      </div>
    );
  }

  //helper functions

  //animation flow related
  hasNextStep() {
    if (this.state.res === null) {
      this.sendMessage(MSG.CLICK_START);
      return false;
    }
    if (this.state.stepNo === this.state.res.visitedEdgesAtStep.length - 1) {
      this.sendMessage(MSG.FINISHED);
      return false;
    }
    return true;
  }

  displayTable(stepNo) {
    if (stepNo < this.state.res.tables.length)
      this.props.notify({
        id: uuid(),
        type: nTypes.CONTENT,
        stepNo: stepNo,
        content: <Table table={this.state.res.tables[stepNo]} />
      });
  }
  //notifications related
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

  //render related
  updateNodeWithAttr(id, attr) {
    const grid = this.state.grid;
    const meta = grid[`${id}`].meta;
    meta.attr = attr;
    const newNode = this.props.getNewNode(meta);
    grid[`${id}`] = newNode;
    this.setState({ grid });
  }

  updateLineWithAttr(id, attr) {
    const { x1, x2, y1, y2, wt, from, to } = this.state.lines[`${id}`].meta;
    const p1 = { x: x1, y: y1, id: from };
    const p2 = { x: x2, y: y2, id: to };
    return this.props.getNewLine({
      id,
      p1,
      p2,
      wt,
      attr: { ...attr }
    });
  }

  updateCircleWithAttr() {}

  updateEdgeWtWithAttr() {}

  getComponentCollection(type, prop) {
    const src = this.state;
    if (!src[`${type}`]) return; /** First render without graph */
    let collection = [];
    Object.getOwnPropertyNames(src[`${type}`]).forEach(id => {
      collection.push(src[`${type}`][`${id}`][`${prop}`]);
    });
    return collection;
  }

  buildGraphNodes() {
    const grid = {};
    Object.getOwnPropertyNames(this.props.grid).forEach(id => {
      let { status, x, y, attr, onClickHandler } = this.props.grid[`${id}`];
      onClickHandler = this.changeStartNode;
      grid[`${id}`] = this.props.getNewNode({
        id,
        status,
        x,
        y,
        attr,
        onClickHandler
      });
    });
    return grid;
  }

  buildGraphLines() {
    const lines = {};
    Object.getOwnPropertyNames(this.props.lines).forEach(id => {
      const { x1, x2, y1, y2, wt, from, to, attr } = this.props.lines[`${id}`];
      const p1 = { x: x1, y: y1, id: from };
      const p2 = { x: x2, y: y2, id: to };

      lines[`${id}`] = this.props.getNewLine({
        id,
        p1,
        p2,
        wt,
        attr: { ...ANIM_ATTR.LINE.DHLT }
      });
    });
    return lines;
  }

  buildGraphCircles() {
    const circles = {};
    Object.getOwnPropertyNames(this.props.circles).forEach(id => {
      circles[`${id}`] = this.props.getNewCircle(this.props.circles[`${id}`]);
    });
    return circles;
  }

  buildGraphEdgeWts() {
    const edgeWts = {};
    Object.getOwnPropertyNames(this.props.edgeWts).forEach(id => {
      const { x, y, wt } = this.props.edgeWts[`${id}`];
      edgeWts[`${id}`] = this.props.getNewEdgeWt({ id, x, y, wt });
    });
    return edgeWts;
  }

  //animation related
  scrollToBottom() {
    if (this.containerEnd) {
      this.containerEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  highlightComponent() {}
  deHighlightComponent() {}

  //notifications related
  sendMessage(msg) {
    this.props.notify({
      id: uuid(),
      timeOut: 4000,
      type: nTypes.NOTIFY,
      msg
    });
  }
}

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
const MSG = {
  NO_START: "Please select a start node..",
  CLICK_START: "Please click start..",
  AT_START: "We are at the start step..",
  FINISHED: "Execution completed..",
  NEW_START: "Click restart to select new start node"
};
const ATTR = {
  LOCKED: {
    fill: "#333",
    opacity: 0.6
  },
  START_NODE: {
    fill: "orangered",
    opacity: 0.8
  }
};

const ANIM_ATTR = {
  LINE: {
    MIN: {
      stroke: "red",
      "stroke-width": 4
    },
    HLT: {
      stroke: "#0b8ac9",
      "stroke-width": 3
    },
    DHLT: {
      stroke: "black",
      "stroke-width": 1
    }
  },
  CIRCLE: {
    fill: "red",
    opacity: 0.3
  },
  TEXT: {
    fill: "green",
    opacity: 0.6
  },
  NODE: {
    fill: "red",
    opacity: 0.3
  }
};
