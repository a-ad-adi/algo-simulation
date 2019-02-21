import React, { Fragment } from "react";
import "./../css/Step.css";
import MergeSortTimeline from "./MergeSort_Timeline";

export default class Step extends React.Component {
  timeLineRefs = [];

  constructor(props) {
    super(props);
    this.state = {};
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.reverse = this.reverse.bind(this);
    this.next = this.next.bind(this);
    this.scrollToStep = this.scrollToStep.bind(this);
    this.loadAnimation = this.loadAnimation.bind(this);
    this.getRef = this.getRef.bind(this);
  }

  getRef(ref) {
    this.timeLineRefs.push(ref);
  }

  scrollToStep() {
    this.stepRef.scrollIntoView({ behavior: "smooth" });
  }

  loadAnimation() {
    return <MergeSortTimeline data={this.props.body} getRef={this.getRef} />;
  }
  play(e) {
    this.timeLineRefs.map(t => {
      if (t) t.getGSAP().play();
    });
  }

  pause(e) {
    this.timeLineRefs.map(t => {
      if (t) t.getGSAP().pause();
    });
  }

  stop(e) {
    this.timeLineRefs.map(t => {
      if (t) t.getGSAP().stop();
    });
  }

  reverse(e) {
    // console.log(this.timeLineRefs);
    this.timeLineRefs.map(t => {
      if (t) t.getGSAP().reverse();
    });
  }

  next(e) {
    this.props.next();
  }

  render() {
    return (
      <div className="Step">
        <div className="s-header">
          <p className="step-no">Step {this.props.header.stepNo}</p>
        </div>
        <div className="s-body">{this.loadAnimation()}</div>
        <div className="controls">
          <div className="btn start" onClick={this.play}>
            Play
          </div>
          <div className="btn pause" onClick={this.pause}>
            Pause
          </div>
          <div className="btn stop" onClick={this.stop}>
            Stop
          </div>
          <div className="btn reverse" onClick={this.reverse}>
            Reverse
          </div>
        </div>
      </div>
    );
  }
}
