import React, { Component } from "react";
import { sort } from "./../algorithms/mergeSort";
import Step from "./Step";
import "./../css/SortSimulation.css";
import { nTypes } from "./../util/GlobalVars";
import uuid from "uuid/v1";

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
    // console.log(this.snapshot);
    const steps = [
      <Step
        actions={this.state.showControls}
        key={this.state.stepNo}
        hasNext={true}
        next={this.getNext}
        notify={this.props.notify}
        header={{ stepNo: this.state.stepNo }}
        body={this.snapshot.steps[this.state.stepNo]}
      />
    ];
    this.setState({ steps });
    let stepNo = this.state.stepNo;
    const iid = uuid();
    const stepDetails = this.snapshot.steps[this.state.stepNo];
    this.props.notify({ id: iid, type: nTypes.DESCRIBE, stepInfo: {stepNo, ...stepDetails}});
    this.setState({ stepNo: ++stepNo });
  }

  getNext() {
    let stepNo = this.state.stepNo;
    this.setState({ stepNo: ++stepNo });
    if (this.state.stepNo < this.snapshot.steps.length) {
      const steps = this.state.steps;
      steps.push(
        <Step
          actions={this.state.showControls}
          key={this.state.stepNo}
          hasNext={true}
          notify={this.props.notify}
          header={{stepNo: this.state.stepNo }}
          body={this.snapshot.steps[this.state.stepNo]}
        />
      );
      this.setState({ steps });
      const stepDetails = this.snapshot.steps[this.state.stepNo];
      this.props.notify({ id: uuid(), type: nTypes.DESCRIBE, stepInfo: {stepNo: this.state.stepNo, ...stepDetails}});
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
