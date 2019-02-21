import React, { Fragment } from "react";
import { Tween, Timeline, Controls } from "react-gsap";

export default class Gsap extends React.Component {
  tween;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="gsap">
        <Controls>
          <Timeline
            wrapper={
              <div
                style={{
                  position: "relative",
                  background: "grey",
                  height: "200px"
                }}
              />
            }
            target={
              <Fragment>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    background: "black",
                  }}
                />
              </Fragment>
            }
            paused= {true}
          >
            <Tween to={{ x: 100 }} />
            <Tween to={{ y: 100 }} />
          </Timeline>
        </Controls>
      </div>
    );
  }

  componentDidMount() {
    // console.log("SORTED :: ", sort());
  }
}
