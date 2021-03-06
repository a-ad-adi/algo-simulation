import React, { Component } from "react";
import { sort } from "../../../algorithms/mergeSort";
import Step from "../../Step";
import { nTypes } from "../../../util/GlobalVars";
import uuid from "uuid/v1";

import "../../../css/SortSimulationContainer.css";
import MinimizeBtn from "../../MinimizeBtn";

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
    this.loadAlgorithm = this.loadAlgorithm.bind(this);
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

  loadAlgorithm() {
    return this.props.algo.map( (e, i) => {
      return (
        <div className={e.phase} key={i}>
          <pre>{e.code}</pre>
        </div>
      );
    });
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
            <div className="section-header">
              <p>Basic information:</p>
              <MinimizeBtn
                scaleToZero={this.props.scaleToZero}
                scaleToNormal={this.props.scaleToNormal}
                displayNone={this.props.displayNone}
                displayVisible={this.props.displayVisible}
                ref={this.props.getHeaderRef}
                sectionCode={this.props.animHeaderSection}
              />
            </div>
            <div>Input: {numbers}</div>
            <div className="algorithm">{this.loadAlgorithm()}</div>
          </div>
          <div className="animate-actions">
            <div className="btn autoplay">Autoplay</div>
            <div className="btn next" onClick={this.getNext}>
              Next
            </div>
              <MinimizeBtn
                scaleToZero={this.props.scaleToZero}
                scaleToNormal={this.props.scaleToNormal}
                displayNone={this.props.displayNone}
                displayVisible={this.props.displayVisible}
                ref={this.props.getHeaderRef}
                sectionCode={this.props.animBodySection}
              />
          </div>
        </div>
        <div className={this.props.animBodyCls}>
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
