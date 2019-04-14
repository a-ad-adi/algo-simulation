import React, { Component } from "react";
import clsUtil from "./../../../util/class_modifier";
import "./../../../css/Node.css";
import { Set, Text, Rect } from "react-raphael";

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
    this.props.onClickHandler(this.props.id);
  }

  render() {
    const { x, y, id, attr } = this.props;
    return (
        <Rect x={x} y={y} attr={{ ...this.props.attr }} click={this.addNode} />
    );
  }
}
{/* <Set>
  <Text x={x+5} y={y+5} text={id}></Text>
</Set> */}
