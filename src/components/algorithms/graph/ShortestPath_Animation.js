import React, { Component } from "react";
import Snapshot from "./Snapshot";
import { findShortestPath } from "../../../algorithms/ShortestPath";
import { Raphael, Paper, Set, Line, Circle, Text } from "react-raphael";
import uuid from "uuid";
import { nTypes } from "./../../../util/GlobalVars";
import "./../../../css/ShortestPath_Animation.css";
import { node } from "prop-types";

let res = [];
export default class ShortestPath_Animation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNo: -1,
      grid: {},
      start: null,
      lines: {},
      circles: {},
      edgeWts: {}
    };

    this.start = this.start.bind(this);
    this.changeStartNode = this.changeStartNode.bind(this);
    this.restart = this.restart.bind(this);
    this.loadStep = this.loadStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.showSnapshot = this.showSnapshot.bind(this);
  }
  componentDidMount() {
    this.recreateGraph();
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
        if(this.state.start === start) return;
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
      const { from, to, id: lineId } = lines[`${id}`].meta;
      const p1TOp2 = {
        id: lineId,
        to: Number(to),
        wt: Number(lines[`${id}`].meta.wt)
      };
      const p2Top1 = { to: Number(from), wt: Number(lines[`${id}`].meta.wt) };
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
    if (!this.state.start) {
      this.sendMessage(MSG.NO_START);
      return;
    }
    if (this.state.stepNo > -1 && this.state.stepNo < this.state.res.length)
      return;
    if (this.state.stepNo === -1) {
      res = findShortestPath(this.prepareInput(), this.props.start);
      console.log(res);
      this.startAnimation();
    }
  }

  restart() {
    this.updateNodeWithAttr(this.state.start, ATTR.LOCKED);
    res = [];
    this.setState({ start:null, stepNo: -1 });
  }

  loadStep() {}

  prevStep() {
    if (this.state.stepNo <= -1) {
      this.sendMessage(MSG.AT_START);
      return;
    }

    let stepNo = this.state.stepNo;
    this.setState({ stepNo: --stepNo });
    this.sendMessage(`Step no: ${stepNo}`);
  }
  nextStep() {
    if (this.state.stepNo === res.visitedEdgesAtStep.length - 1) {
      this.sendMessage(MSG.FINISHED);
      return;
    }
    let stepNo = this.state.stepNo;
    this.setState({ stepNo: ++stepNo });
    this.sendMessage(`Step no: ${stepNo}`);
    
    this.props.updateLineWithAttr()
  }
  startAnimation() {
    this.nextStep();
  }
  showSnapshot() {}

  render() {
    const { grid, lines, circles, edgeWts } = this.loadComponents();
    return (
      <div className="shortest-path-anim-container">
        <div className="controls">
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
        <div className="snapshots" />
      </div>
    );
  }

  //helper functions

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
  updateNodeWithAttr(id, attr){
    const grid = this.state.grid;
    const meta = grid[`${id}`].meta;
    meta.attr = attr;
    const newNode = this.props.getNewNode(meta);
    grid[`${id}`] = newNode;
    this.setState({ grid });
  }

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

      lines[`${id}`] = this.props.getNewLine({ id, p1, p2, wt, attr });
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
      edgeWts[`${id}`] = this.props.getNewEdgeWt(this.props.edgeWts[`${id}`]);
    });
    return edgeWts;
  }

  //animation related
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
      fill: "red",
      opacity: 0.5,
      stroke: 4
    },
    HLT: {
      fill: "blue",
      opacity: 0.5,
      stroke: 2
    },
    DHLT: {}
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
