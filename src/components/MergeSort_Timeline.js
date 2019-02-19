import React, { Fragment } from "react";
import { sortAlgo } from "../util/GlobalVars";
import { Tween, Timeline } from "react-gsap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function animateMergeSort({ data, getRef }) {
  console.log("data.type", data.type, sortAlgo.merge.SPLIT);
  if (data.type === sortAlgo.merge.SPLIT) {    
    return animateSplit(data, getRef);
  } else return animateMerge(data, getRef);
}

function animateSplit(data, getRef) {
  let [tweenLeft, tweenRight ] = [<Tween to={{ x: -40 }} />, <Tween to={{ x: 40 }} />];
  let [cross, leftArr, rightArr ] = [<FontAwesomeIcon icon="times" style={{"margin": "0px 10px", "transform": "scale(2,2"}}/>, [], [], false, false];
  if (data.left.length)
    leftArr = data.left.map(e => <div className="num">{e}</div>);
  else{
    leftArr = cross;
    tweenLeft = null;
  }
  if(data.right.length)
  rightArr = data.right.map(e => <div className="num">{e}</div>);
  else{
    rightArr = cross;
    tweenRight = null;
  }

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
        {tweenLeft}
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
        {tweenRight}
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
