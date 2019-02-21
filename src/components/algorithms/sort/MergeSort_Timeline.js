import React, { Component, Fragment } from "react";
import { sortAlgo, csses } from "../../../util/GlobalVars";
import { getInlineCss } from "../../../util/css_modifier";
import { Tween, Timeline } from "react-gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import "../../../css/MergeSort_Timeline.css";

export default class animateMergeSort extends Component {
  numRefs = [];

  constructor(props) {
    super(props);
    this.state = {
      tweens: []
    };
  }

  componentDidMount() {
    console.log("NUM refs : ", this.numRefs);
    let [x, y, ofs] = [0, 50, 0];
    let coords = this.numRefs.map((e, i) => {
      x = ofs;
      ofs = e.ref.offsetWidth;
      console.log(x, ofs);
      if (e.half === sortAlgo.merge.LEFT) return ({ x, y: y + 2*e.ref.scrollHeight });
      else return ({ x, y: y + e.ref.scrollHeight});
    });
    this.setTweens(coords);
  }

  setTweens(coords) {
    let [ tweens, delay ] = [[], 0];
    coords.forEach((e, i) => {
      const tween = <Tween to={{ x: e.x, y: e.y, delay: delay++ }} />;
      tweens.push(tween);
    })    
    this.setState({ tweens });
  }

  animateSplit(data) {
    let [tweenLeft, tweenRight] = [
      <Tween to={{ x: -40 }} />,
      <Tween to={{ x: 40 }} />
    ];
    let [cross, leftArr, rightArr] = [
      <FontAwesomeIcon icon="times" className="icon" />,
      [],
      [],
      false,
      false
    ];

    if (data.left.length)
      leftArr = data.left.map((e, i) => (
        <div className="num" key={i}>
          {e}
        </div>
      ));
    else {
      leftArr = cross;
      tweenLeft = null;
    }
    if (data.right.length)
      rightArr = data.right.map(e => <div className="num">{e}</div>);
    else {
      rightArr = cross;
      tweenRight = null;
    }

    let leftOver = [];
    if (data.side && data.leftOver)
      leftOver = data.leftOver.map(e => <div className="num">{e}</div>);

    return (
      <div className="split-container">
        <Timeline
          ref={ref => this.props.getRef(ref)}
          wrapper={<div className="wrapper" />}
          target={
            <div>
              <Fragment>{leftArr}</Fragment>
            </div>
          }
        >
          {tweenLeft}
        </Timeline>
        <Timeline
          ref={ref => this.props.getRef(ref)}
          wrapper={<div className="wrapper" />}
          target={
            <div>
              <Fragment>{rightArr}</Fragment>
            </div>
          }
        >
          {tweenRight}
        </Timeline>
      </div>
    );
  }

  initMerge(data) {
    let [leftHalf, rightHalf, numCss] = [
      [],
      [],
      csses,
      getInlineCss(csses.num)
    ];

    data.subSteps.map((s, i) => {      
      if (s.half === sortAlgo.merge.LEFT) {
        leftHalf.push(this.getMergeObj({ i, val: s.val, half: s.half, seq: s.destIndex }));
      } else {
        rightHalf.push(this.getMergeObj({ i, val: s.val, half: s.half, seq: s.destIndex }));
      }
    });

    return (
      <div className="merge-container">
        <div className="two-halves">
          <div className="left-half">{leftHalf}</div>
          <div className="right-half">{rightHalf}</div>
        </div>
      </div>
    );
  }

  getMergeObj({ i, half, val, delay = 1000, seq }) {
    return (
      <Timeline
        ref={ref => this.props.getRef(ref)}
        wrapper={<div />}
        target={
          <div>
            <Fragment>
              {
                <div
                  className="num"
                  ref={ref => this.numRefs[seq] = { ref, half }}
                >
                  {val}
                </div>
              }
            </Fragment>
          </div>
        }
      >
        {this.state.tweens[i]}
      </Timeline>
    );
  }

  render() {
    if (this.props.data.type === sortAlgo.merge.SPLIT) {
      return this.animateSplit(this.props.data);
    } else return this.initMerge(this.props.data);
  }
}
