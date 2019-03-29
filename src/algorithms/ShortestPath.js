const nodes = [1, 2, 3, 4, 5];
// const edges = [{start:1, end:2, wt:6}, {start:1, end:4, wt:1},
//     {start:2, end:1, wt:6}, {start:2, end:4, wt:2}, {start:2, end:5, wt:2}, {start:2, end:3, wt:5},
//     {start:3, end:2, wt:5}, {start:3, end:5, wt:5},
//     {start:4, end:1, wt:1}, {start:4, end:2, wt:2}, {start:4, end:5, wt:1},
//     {start:5, end:2, wt:2}, {start:5, end:3, wt:5}, {start:5, end:4, wt:1}
// ];

const graph = [
  { id: 0, edges: [{ start: 0, end: 1, wt: 6 }, { start: 0, end: 3, wt: 1 }] },
  {
    id: 1,
    edges: [
      { start: 1, end: 0, wt: 6 },
      { start: 1, end: 2, wt: 5 },
      { start: 1, end: 3, wt: 2 },
      { start: 1, end: 4, wt: 2 }
    ]
  },
  { id: 2, edges: [{ start: 2, end: 1, wt: 5 }, { start: 2, end: 4, wt: 5 }] },
  {
    id: 3,
    edges: [
      { start: 3, end: 0, wt: 1 },
      { start: 3, end: 1, wt: 2 },
      { start: 3, end: 4, wt: 1 }
    ]
  },
  {
    id: 4,
    edges: [
      { start: 4, end: 1, wt: 2 },
      { start: 4, end: 2, wt: 5 },
      { start: 4, end: 3, wt: 1 }
    ]
  }
];

module.exports = {
  findShortestPath: function() {
    let visited = [];
    let start = 0;
    let ind = null;
    let res = [];
    for (let i = 0; i < graph.length; i++) {
      if (start === graph[i].id) ind = i;
      res.push({ id: i, dist: null, prevId: null });
    }
    graph[ind].dist = 0;
    visited.push(graph[ind].id);
    let min = null;
    while (visited.length != graph.length) {
      min = null;
      for (let i = 0; i < graph[ind]["edges"].length; i++) {
        const vId = graph[ind]["edges"][i].end;
        const endV = res[vId];
        if (endV.dist === null) {
          endV.dist = graph[ind]["edges"][i].wt;
          endV.prevId = ind;
        } else {
          if (endV.dist < graph[ind]["edges"][i].wt) {
            endV.dist = graph[ind]["edges"][i].wt;
            endV.prevId = ind;
          }
        }
        if (min === null) min = i;
        else if (graph[ind]["edges"][i].wt < graph[ind]["edges"][min].wt)
          min = i;
      }
      visited.push(ind);
      ind = min;
    }

    console.log(res);
  }
};
