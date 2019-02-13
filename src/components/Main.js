import React, { Component } from "react";
import Sort from "./Sort";
import ShortestPath from "./ShortestPath";

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
    if (this.props.component.algo === SORT)
      return <Sort notify={this.props.notify} />;
    else if (this.props.component.algo === SHORTEST_PATH) {
      return <ShortestPath notify={this.props.notify} />;
    } else if (this.props.component.algo === RAPHAEL) {
      return <RaphaelCmp notify={this.props.notify} />;
    } else if (this.props.component.algo === BONSAI) {
      return <Bonsai notify={this.props.notify} />;
    }else if (this.props.component.algo === GSAP) {
      return <Gsap notify={this.props.notify} />;
    }else if (this.props.component.algo === SWAP) {
      return <Swap notify={this.props.notify} />;
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