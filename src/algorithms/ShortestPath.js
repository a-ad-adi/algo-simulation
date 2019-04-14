const graph = {
  edges: {
    "0": [{ to: 1, wt: 6, id: 0 }, { to: 3, wt: 1, id: 1 }],
    "1": [
      { to: 0, wt: 6, id: 0},
      { to: 2, wt: 5, id: 2},
      { to: 3, wt: 2 , id:3},
      { to: 4, wt: 2, id:4}
    ],
    "2": [{ to: 1, wt: 5, id:2 }, { to: 4, wt: 5, id:5 }],
    "3": [{ to: 0, wt: 1, id:1 }, { to: 1, wt: 2, id:3 }, { to: 4, wt: 1, id:6 }],
    "4": [{ to: 1, wt: 2, id:4 }, { to: 2, wt: 5, id:5 }, { to: 3, wt: 1,id:6 }]
  },
  nodes: [0, 1, 2, 3, 4, 5]
};
let visited = {};
let visitedEdgesAtStep = [[]];
let visitedNodesAtStep = [[]];
let minEdgeAtStep = [[]];
let res = {};
let resProps = ["wt", "prevId", "prevEdge"];
let log = [];
let start=0;
module.exports = {
  findShortestPath: function() {
    let { edges, nodes } = graph;
    let ind = start;
    nodes.forEach(nodeId => {
      res[`${nodeId}`] = { wt: Number.MAX_VALUE, prevId: null };
      visited[`${nodeId}`] = false;
    });

    res[`${start}`] = { wt: 0, prevId: start };

    while (true) {
      const neighbours = edges[`${ind}`];
      visited[`${ind}`] = true;
      let newEdges = [];      
      
      if (!neighbours || neighbours.length === 0) break;
      
      neighbours.forEach(v => {
        if (res[`${v.to}`].wt > v.wt + res[`${ind}`].wt) {
          res[`${v.to}`].wt = v.wt + res[`${ind}`].wt;
          res[`${v.to}`].prevId = ind;
          res[`${v.to}`].prevEdge = v.id;
          newEdges.push(v.id);
        }
      });
      
      logStep(ind ,newEdges);
      ind = getNextNearestV();
      // break;
    }
    // console.log(log);
    return {tables: log, visitedEdgesAtStep, visitedNodesAtStep, minEdgeAtStep};
  }
};

function getNextNearestV() {
  let id = null, lineId=null, min = null;
  Object.getOwnPropertyNames(res).forEach(prop => {
    if (visited[`${prop}`] === false) {
      if (min === null && res[`${prop}`].wt !== null) {
        min = res[`${prop}`].wt;
        id = prop;
        lineId = res[`${prop}`].prevEdge;
      } else {
        if (min > res[`${prop}`].wt) {
          min = res[`${prop}`].wt;
          id = prop;
          lineId = res[`${prop}`].prevEdge;
        }
      }
    }
  });
  
  if (id !== null) {
    minEdgeAtStep.push(lineId);
    return +id
  };
  return null;
}

function logStep(newNode, newEdges){
  let table = {};
  visitedEdgesAtStep.push(newEdges);
  visitedNodesAtStep.push(newNode);

  Object.getOwnPropertyNames(res).forEach((nodeId)=> {
    let node = res[`${nodeId}`];
      let nearest = {};
      resProps.forEach( prop => {        
        nearest[`${prop}`] = node[`${prop}`];
        return;
      })
      table[`${nodeId}`] = nearest;
    });
    log.push({table});
}