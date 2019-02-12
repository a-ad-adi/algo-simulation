import React, { Fragment } from "react";
import { Tween, Timeline, Controls } from "react-gsap";

export default class Swap extends React.Component {
  tl1;
  tl2;
  constructor(props) {
    super(props);
    super(props);
    this.state = {};
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.reverse = this.reverse.bind(this);

    // this.tl = new Timeline({paused: true});
  }
  componentDidMount() {
    const tl1 = this.tl1.getGSAP();
    const tl2 = this.tl2.getGSAP();
    const tl3 = this.tl3.getGSAP();
    const tl4 = this.tl4.getGSAP();
  }
  start(e) {
    const tl1 = this.tl1.getGSAP();
    const tl2 = this.tl2.getGSAP();
    const tl3 = this.tl3.getGSAP();
    const tl4 = this.tl4.getGSAP();
    tl1.play();
    tl2.play();
    tl3.play();
    tl4.play();
  }
  pause(e) {
    const tl1 = this.tl1.getGSAP();
    const tl2 = this.tl2.getGSAP();
    const tl3 = this.tl3.getGSAP();
    const tl4 = this.tl4.getGSAP();
    tl1.pause();
    tl2.pause();
    tl3.pause();
    tl4.pause();
  }
  stop(e) {
    const tl1 = this.tl1.getGSAP();
    const tl2 = this.tl2.getGSAP();
    const tl3 = this.tl3.getGSAP();
    const tl4 = this.tl4.getGSAP();
    tl1.pause();
    tl2.pause();
    tl3.stop();
    tl4.stop();
  }
  reverse(e) {
    const tl1 = this.tl1.getGSAP();
    const tl2 = this.tl2.getGSAP();
    const tl3 = this.tl3.getGSAP();
    const tl4 = this.tl4.getGSAP();
    tl1.reverse();
    tl2.reverse();
    tl3.reverse();
    tl4.reverse();
  }

  render() {
    const btn = {
      border: "1px solid black",
      "box-shadow": "0xp 0px 4px",
      display: "inline-block",
      margin: "2px",
      padding: "2px",
      boxSizing: "border-box",
      cursor: "pointer"
    };
    return (
      <div className="container">
        <div
          className="gsap"
          style={{
            position: "relative",
            'border': '1px solid grey',
            height: "300px"
          }}
        >
          <div className="controls" style={{ padding: "50px" }}>
            <div className="btn start" style={btn} onClick={this.start}>
              Start
            </div>
            <div className="btn pause" style={btn} onClick={this.pause}>
              Pause
            </div>
            <div className="btn stop" style={btn} onClick={this.stop}>
              Stop
            </div>
            <div className="btn reverse" style={btn} onClick={this.reverse}>
              Reverse
            </div>
          </div>
          <h3>Swap</h3>
          <Timeline
            ref={ref => (this.tl1 = ref)}
            wrapper={<div style={{ display: "inline-block" }} />}
            target={
              <Fragment>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    background: "black"
                  }}
                />
              </Fragment>
            }
            paused={true}
          >
            <Tween to={{ y: -50 }} />
            <Tween to={{ x: 100 }} />
            <Tween to={{ y: 0 }} />
          </Timeline>

          <Timeline
            ref={ref => (this.tl2 = ref)}
            wrapper={<div style={{ display: "inline-block" }} />}
            target={
              <Fragment>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    background: "orangered",
                    left: "50px"
                  }}
                />
              </Fragment>
            }
            paused={true}
          >
            <Tween to={{ y: 50 }} />
            <Tween to={{ x: -100 }} />
            <Tween to={{ y: -0 }} />
          </Timeline>
        </div>

        <div
          className="gsap"
          style={{
            position: "relative",
            'border': '1px solid grey',
            height: "300px"
          }}
        >
        <h3>Split</h3>
          <Timeline
            ref={ref => (this.tl3 = ref)}
            wrapper={ <div style={{ display: "inline-block" }} /> }
            target={
              <Fragment>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    background: "black"
                  }}
                />
              </Fragment>
            }
            paused={true}
          >
            <Tween to={{ x: -50 }} />
          </Timeline>          
          <Timeline
            ref={ref => (this.tl4 = ref)}
            wrapper={<div style={{ display: "inline-block" }} />}
            target={
              <Fragment>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    background: "orangered",
                    left: "25px"
                  }}
                />
              </Fragment>
            }
            paused={true}
          >
            <Tween to={{ x: 50 }} />
          </Timeline>
        </div>
      </div>
    );
  }
}
