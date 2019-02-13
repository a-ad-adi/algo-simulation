import React, { Component } from "react";
import { sort } from "./../algorithms/mergeSort";
import Step from "./Step";
import "./../css/SortSimulation.css";

export default class SortSimulation extends Component {
  snapshot;
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      stepNo: 0,
      hasNext: true,
      showControls: true
    };
    this.getNext = this.getNext.bind(this);
  }
  
  componentDidMount() {
    this.snapshot = sort(this.props.numbers);
    console.log("SORTING NUMBERS :: ", this.snapshot);
    const steps = [
      <Step
        actions={this.state.showControls}
        key={this.state.stepNo}
        hasNext={true}
        next={this.getNext}
      />
    ];
    this.setState({ steps });
  }

  getNext() {
    let stepNo = this.state.stepNo;
    this.setState({ stepNo: stepNo++ });
    if (this.state.stepNo < this.snapshot.steps.length) {
      const steps = this.state.steps;
      steps.push(
        <Step
          actions={this.state.showControls}
          key={this.state.stepNo}
          hasNext={true}          
        />
      );
      this.setState({ steps });
    } else {
      console.log("Notify done..");
    }
    this.props.scrollToStep();
  }

  render() {
    const numbers = this.props.numbers.map(n => {
      return <div className="num">{n}</div>;
    });
    return (
      <div className="sort-simulation">
        <div className="sol-header">
          <div>
            <p>Input: {numbers}</p>
          </div>
          <div className="btn next" onClick={this.getNext}>
            Next
          </div>
        </div>
        <div className="steps">{this.state.steps}</div>
      </div>
    );
  }
}
