import React from "react";
import "./../../../css/Table.css";

export default function Table(props) {
  const table = props.table;
  let res = [];
  Object.getOwnPropertyNames(table).map(node => {
    let { wt, prevId } = table[`${node}`];
    wt =
      wt !== null && wt !== undefined
        ? wt === Number.MAX_VALUE
          ? "INF"
          : wt
        : "-";
    res.push([
      <div key={1} className="t-col">{node}</div>,
      <div key={2} className="t-col">{wt}</div>,
      <div key={3} className="t-col">{prevId}</div>
    ]);
  });
  const displayTable = res.map((row, i) => {
    return <div key={i} className="t-row">{row}</div>;
  });
  return (
    <div className="res-table">
      <div className="t-row">
        <div className="t-col">Node</div>
        <div className="t-col">Dist</div>
        <div className="t-col">Prev</div>
      </div>
      {displayTable}
    </div>
  );
}
