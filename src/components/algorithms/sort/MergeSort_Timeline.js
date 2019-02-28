import React, { Component, Fragment } from "react";
import { sortAlgo, csses } from "../../../util/GlobalVars";
import { getInlineCss } from "../../../util/css_modifier";
import { Tween, Timeline } from "react-gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../../css/MergeSort_Timeline.css";

export default class animateMergeSort extends Component {
  numRefs = [];
  refCntr = 0;

  constructor(props) {
    super(props);
    this.state = {
      tweens: []
    };
  }

  componentDidMount() {}

  initMerge(data) {
    let [leftHalf, rightHalf, mergedArr] = [[], [], []];

    data.subSteps.forEach((s, i) => {
      if (s.half === sortAlgo.merge.LEFT)
        leftHalf.push(this.getMergeObj({ i, val: s.val, duration:1, delay: i/2, opacity: 0 }));
      else
        rightHalf.push(this.getMergeObj({ i, val: s.val, duration:1, delay: i/2, opacity: 0 }));    
      mergedArr.push(this.getMergeObj({ i, val: s.val, duration:0.2, delay: i/2, opacity: 1 }));
    });

    return (
      <div className="merge-container">
        <div className="two-halves">
          <div className="left-half">{leftHalf}</div>
          <div className="right-half">{rightHalf}</div>
          <div className="merged-arr">{mergedArr}</div>
        </div>
      </div>
    );
  }

  getMergeObj({ i, val, duration, delay, opacity }) {
    const cls = opacity ? "num opacity-zero" : "num";
    return (
      <Timeline
        key={i}
        ref={ref => this.props.getRef(ref)}
        wrapper={<div className="wrapper" />}
        target={
          <Fragment>
            <div className={cls}>{val}</div>
          </Fragment>
        }
      >
        <Tween to={{ opacity, duration, delay }} />
      </Timeline>
    );
  }

  setTweens(coords) {}

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
      rightArr = data.right.map((e, i) => <div className="num" key={i}>{e}</div>);
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

  render() {
    if (this.props.data.type === sortAlgo.merge.SPLIT) {
      return this.animateSplit(this.props.data);
    } else return this.initMerge(this.props.data);
  }
}
