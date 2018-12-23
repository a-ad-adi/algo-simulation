import React, { Component } from 'react';
import Sort from "./Sort";
import ShortestPath from "./ShortestPath";

import './../css/Main.css';
const [ SORT, SHORTEST_PATH ] = ["Merge sort", "Dijkshtra's algorithm"]
class Main extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="main">
      <div className="section-header">{this.props.component.type} : {this.props.component.algo}</div>
      {this.loadComponent()}
      </div>
    );
  }

  loadComponent(){    
    if(this.props.component.algo === SORT)
      return <Sort notify={this.props.notify} />  
    else if(this.props.component === SHORTEST_PATH){
      return <ShortestPath notify={this.props.notify} />  
    }
  }
}

export default Main;
