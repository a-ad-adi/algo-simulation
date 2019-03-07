import React, { Component } from "react";
import clsUtil from "./../../../util/class_modifier";
import "./../../../css/Node.css";
import { Rect } from "react-raphael";

const [DEFAULT, CREATED, SELECTED, DESELECTED, LOCKED] = [
  "default",
  "created",
  "selected",
  "deselected",
  "locked"
];

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addNode = this.addNode.bind(this);
  }

  addNode(status) {
    // console.log("status before : ", this.props.status);
    this.props.addNode(this.props.id);
    // console.log("status after : ", this.props.status);
  }

  render() {
    const { x, y } = this.props;
    return (
      <Rect x={x} y={y} attr={{ ...this.props.attr }} click={this.addNode} />
    );
  }
}
