import React from "react";
import { Raphael, Paper, Set, Line } from "react-raphael";
import "./../../../css/Snapshot.css";

export default function Snapshot(props) {
  let newCoOrds = {};
  function generateNodes() {
    const { gridInfo } = props;
    let grid = [];
    let nodeId = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (gridInfo[`${nodeId}`]) {
          const [x, y] = [j * OFFSET, i * OFFSET];
          newCoOrds[`${nodeId}`] = { x, y };
          const newNode = props.getNewCustomNode({
            id: nodeId,
            x,
            y,
            attr: { ...ATTR.NODE }
          });
          grid.push(newNode.node);
        }
        nodeId++;
      }
    }
    return grid;
  }

  function generateLines() {
    let lines = [];
    const { linesInfo } = props;
    Object.getOwnPropertyNames(linesInfo).forEach(id => {
      const p1 = newCoOrds[`${linesInfo[id].from}`];
      const p2 = newCoOrds[`${linesInfo[id].to}`];
      let stroke = "black";
      if (linesInfo[id].attr) stroke = linesInfo[id].attr.stroke;
      const newLine = props.getNewLine({ p1, p2, attr: { stroke: stroke } });
      lines.push(newLine.line);
    });
    return lines;
  }
  return (
    <div key={props.id} className="snapshot">
      <Paper width={350} height={140}>
        <Set>{generateNodes()}</Set>
        <Set>{generateLines()}</Set>
      </Paper>
    </div>
  );
}

const [ROWS, COLS, WIDTH, HEIGHT, OFFSET] = [8, 30, 10, 10, 20];
const ATTR = {
  NODE: {
    fill: "#333",
    opacity: 0.5,
    width: WIDTH,
    height: HEIGHT,
    cursor: "pointer"
  }
};
