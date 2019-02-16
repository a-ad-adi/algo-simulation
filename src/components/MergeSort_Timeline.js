import React, { Fragment } from "react";
import { sortAlgo } from "../util/GlobalVars";
import { Tween, Timeline } from "react-gsap";

export default function animateMergeSort({ data, getRef }) {
  console.log("data.type", data.type, sortAlgo.merge.SPLIT);
  if (data.type == sortAlgo.merge.SPLIT) {
    console.log("in comp ..", data);
    return animateSplit(data, getRef);
  } else return animateMerge(data, getRef);
}

function animateSplit(data, getRef) {
  console.log("split animation..");
  const leftArr = data.left.map(e => <div className="num">{e}</div>);
  const rightArr = data.right.map(e => <div className="num">{e}</div>);
  let leftOver = [];
  if (data.side && data.leftOver)
    leftOver = data.leftOver.map(e => <div className="num">{e}</div>);

  return (
    <div className="split-container" style={{ "text-align": "center" }} >
      <Timeline
        ref={ref => getRef(ref)}
        wrapper={<div style={{ display: "inline-block" }} />}
        target={
          <div>
            <Fragment>{leftArr}</Fragment>
          </div>
        }
      >
        <Tween to={{ x: -40 }} />
      </Timeline>
      <Timeline
        ref={ref => getRef(ref)}
        wrapper={<div style={{ display: "inline-block" }} />}
        target={
          <div>
            <Fragment>{rightArr}</Fragment>
          </div>
        }
      >
        <Tween to={{ x: 40 }} />
      </Timeline>
    </div>
  );
}

function animateMerge(data, getRef) {
  return (
    <div>
      {" "}
      <h1> Animate merge</h1>
    </div>
  );
}
