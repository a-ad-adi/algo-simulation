import React, { Component } from "react";
const {
  Raphael,
  Paper,
  Set,
  Circle,
  Ellipse,
  Image,
  Rect,
  Text,
  Path,
  Line
} = require("react-raphael");

class RaphaelCmp extends Component {
  // render(){
  //     return(
  //         <div className="raphael">
  //             <div className="section-header">Raphael test</div>
  //             <div className="workspace">
  //                 <Paper width={300} height={300}>
  //                     <Set>
  //                         <Circle x={50} y={50} r={50} stroke={10} fill="black" />
  //                     </Set>
  //                 </Paper>
  //             </div>
  //         </div>
  //     )
  // }

  render() {
    var data = [
      {
        x: 50,
        y: 50,
        r: 40,
        attr: { stroke: "#0b8ac9", "stroke-width": 5 },
        animate: Raphael.animation({ cx: 60, title: "circle" }, 500)
      },
      {
        x: 100,
        y: 100,
        r: 40,
        attr: { stroke: "#f0c620", "stroke-width": 5 },
        animate: Raphael.animation({ cx: 105 }, 500)
      },
      { x: 150, y: 50, r: 40, attr: { stroke: "#1a1a1a", "stroke-width": 5 } },
      {
        x: 200,
        y: 100,
        r: 40,
        attr: { stroke: "#10a54a", "stroke-width": 5 },
        animate: Raphael.animation({ cx: 195 }, 500)
      },
      {
        x: 250,
        y: 50,
        r: 40,
        attr: { stroke: "#e11032", "stroke-width": 5 },
        animate: Raphael.animation({ cx: 240 }, 500)
      }
    ];
    return (
      <Paper width={300} height={300}>
        <Set>
          {data.map(function(ele, pos) {
            return (
              <Circle
                key={pos}
                x={ele.x}
                y={ele.y}
                r={ele.r}
                attr={ele.attr}
                animate={ele.animate}
              />
            );
          })}
        </Set>
        <Set>
          <Circle
            x={50}
            y={200}
            r={40}
            attr={{ fill: "yellow", "stroke-width": 15 }}
            animate={Raphael.animation({ cx: 240 }, 500)}
          />
          <Circle
            x={50}
            y={200}
            r={40}
            attr={{ fill: "yellow", "stroke-width": 15 }}
            animate={anm1}
          />
        </Set>
      </Paper>
    );
  }
}

export default RaphaelCmp;

const start = function() {
  this.attr("opacity", 0.2);
  this.data("ox", this.attr("cx"));
  this.data("oy", this.attr("cy"));
};
const end = function() {
  this.attr("opacity", 1);
};
const move = function(dx, dy, mx, my, ev) {
  this.attr("cx", this.data("ox") + dx);
  this.attr("cy", this.data("oy") + dy);
};

const anm1 = function() {
    alert();
  console.log("starting animation..");
  // this.animate({cx:60},500)
  return Raphael.animation({ cx: 240 }, 500);
};
const anm2 = function() {
  this.animate({ cx: 260 }, 500);
};
