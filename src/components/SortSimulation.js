import React, { Component } from "react";
import { sort } from "./../algorithms/mergeSort";
import Step from "./Step";
import "./../css/SortSimulation.css";
import { nTypes } from "./../util/GlobalVars";
import uuid from "uuid/v1";

export default class SortSimulation extends Component {
  snapshot;
  containerEnd;

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
    this.props.notify({
      id: iid,
      type: nTypes.DESCRIBE,
      stepInfo: { stepNo, ...stepDetails }
    });
    this.setState({ stepNo: ++stepNo });
  }
  componentDidUpdate() {
    this.scrollToStep();
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
          header={{ stepNo: this.state.stepNo }}
          body={this.snapshot.steps[this.state.stepNo]}
        />
      );
      this.setState({ steps });
      const stepDetails = this.snapshot.steps[this.state.stepNo];
      this.props.notify({
        id: uuid(),
        type: nTypes.DESCRIBE,
        stepInfo: { stepNo: this.state.stepNo, ...stepDetails }
      });
    } else {
      this.props.notify({
        id: uuid(),
        type: nTypes.NOTIFY,
        msg: "Sort completed.."
      });
    }
  }

  scrollToStep() {
    if (this.containerEnd)
      this.containerEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const numbers = this.props.numbers.map((n, i) => {
      return (
        <div className="num" key={i}>
          {n}
        </div>
      );
    });
    return (
      <div className="sort-simulation">
        <div className="sol-header">
          <div className="basic-info">
            <div>Input: {numbers}</div>
          </div>
          <div className="animate-actions">
            <div className="btn autoplay">
              Autoplay
            </div>
            <div className="btn next" onClick={this.getNext}>
              Next
            </div>
          </div>
        </div>
        <div className="sol-body">
          <div className="steps">{this.state.steps}</div>
          <div
            className="containerEnd"
            ref={ref => (this.containerEnd = ref)}
          />
        </div>
      </div>
    );
  }
}
