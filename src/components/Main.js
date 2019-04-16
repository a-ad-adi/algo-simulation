import React, { Component } from "react";
import Sort from "./algorithms/sort/SortInput";
import ShortestPath from "./algorithms/graph/ShortestPath";
import "./../css/Main.css";
import Bonsai from "./Test/Bonsai";
import RaphaelCmp from "./Test/Raphael";
import Gsap from "./Test/Gsap";
import Swap from "./Test/Swap";
const [SORT, SHORTEST_PATH, RAPHAEL, BONSAI, GSAP, SWAP] = [
  "Merge sort",
  "Dijkshtra's algorithm",
  "RapahelJs",
  "BonsaiJs",
  "Gsap",
  "Gsap_swap"
];

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  loadComponent() {
    switch (this.props.component.algo) {
      case SORT:
        return <Sort notify={this.props.notify} clearNotifications={this.props.clearNotifications}/>;
      case SHORTEST_PATH:
        return (
          <ShortestPath
            notify={this.props.notify}
            clearNotifications={this.props.clearNotifications}
          />
        );
      case RAPHAEL:
        return (
          <RaphaelCmp
            notify={this.props.notify}
            clearNotifications={this.props.clearNotifications}
          />
        );
      case BONSAI:
        return (
          <Bonsai
            notify={this.props.notify}
            clearNotifications={this.props.clearNotifications}
          />
        );
      case GSAP:
        return (
          <Gsap
            notify={this.props.notify}
            clearNotifications={this.props.clearNotifications}
          />
        );
      case SWAP:
        return (
          <Swap
            notify={this.props.notify}
            clearNotifications={this.props.clearNotifications}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="main">
        <div className="section-header">
          {this.props.component.type} : {this.props.component.algo}
        </div>
        {this.loadComponent()}
      </div>
    );
  }
}
