import React, { Fragment } from "react";
import { Tween, Timeline, Controls } from "react-gsap";
import "./../css/Step.css";

export default class Step extends React.Component {
  tl1;

  constructor(props) {
    super(props);
    this.state = {};
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.reverse = this.reverse.bind(this);
    this.next = this.next.bind(this);
    this.scrollToStep = this.scrollToStep.bind(this);
  }
  scrollToStep() {
    this.stepRef.scrollIntoView({ behavior: "smooth" });
  }

  start(e) {}

  pause(e) {}

  stop(e) {}

  reverse(e) {}

  next(e) {
    this.props.next();
  }
  
  render() {
    return (
      <div className="Step">
        <div className="s-header">
          <p className="step-no">Step {this.props.header.stepNo}</p>
        </div>
        <div className="s-body" />
        <div className="controls">
          <div className="btn start" onClick={this.start}>
            Start
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
