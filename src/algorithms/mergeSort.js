const { sortAlgo } = require("./../util/GlobalVars");

const snapshot = {
  algo: "Merge sort",
  steps: []
};
let c = 0;
let stack = [];

function merge(a, start, mid, end) {
  const left = a.slice(start, mid + 1);
  const right = a.slice(mid + 1, end + 1);
  let subSteps = [];
  let [i, j, k, l, r] = [0, 0, start, left.length, right.length];
  while (i < l && j < r) {
    if (left[i] < right[j]) {
      subSteps.push({id: k, val: left[i], half: sortAlgo.merge.LEFT, srcIndex: i, destIndex: k});
      a[k++] = left[i++];
    } else if (left[i] > right[j]) {
      subSteps.push({id: k, val: right[j], half: sortAlgo.merge.RIGHT, srcIndex: j, destIndex: k});
      a[k++] = right[j++];
    } else {
      subSteps.push({id: k, val: left[i], half: sortAlgo.merge.LEFT, srcIndex: i, destIndex: k});
      a[k++] = left[i++];
      subSteps.push({id: k, val: right[j], half: sortAlgo.merge.RIGHT, srcIndex: j, destIndex: k});
      a[k++] = right[j++];
    }
  }
  while (i < l) {
    subSteps.push({id: k, val: left[i], half: sortAlgo.merge.LEFT, srcIndex: i, destIndex: k});
    a[k++] = left[i++];
  };
  while (j < r) {
    subSteps.push({id: k, val: right[j], half: sortAlgo.merge.RIGHT, srcIndex: j, destIndex: k});
    a[k++] = right[j++];
  };

  logMerge({ id: c++, type: sortAlgo.merge.MERGE, start, mid, end, subSteps });
}

function mergeSort(a, l, r) {
  if (l < r) {
    const m = parseInt((l + r) / 2);
    const [leftStart, leftEnd, rightStart, rightEnd] = [l, m, m + 1, r];
    let relEnd = r;
    logSplit({
      side: sortAlgo.merge.LEFT,
      id: c++,
      arr: a,
      type: sortAlgo.merge.SPLIT,
      start: leftStart,
      end: leftEnd,
      relEnd,
      remInd: [rightStart, rightEnd]
    });
    relEnd = leftEnd;
    stack.push({ leftStart, leftEnd, rightStart, rightEnd });
    mergeSort(a, leftStart, leftEnd);
    
    relEnd = stack.pop().rightEnd;
    logSplit({
      side: sortAlgo.merge.RIGHT,
      id: c++,
      arr: a,
      type: sortAlgo.merge.SPLIT,
      start: rightStart,
      end: rightEnd,
      relEnd
    });
    mergeSort(a, rightStart, rightEnd);
    merge(a, l, m, r);
  }
}

function logSplit({ side, id, arr, type, start, end, remInd, relEnd }) {
  let desc = [`Phase: Split`, `mergeSort(arr, ${start}, ${end})`];
  const left = arr.slice(start, end);
  const right = arr.slice(end, relEnd);
  let leftOver;
  if (remInd) leftOver = arr.slice(remInd[0], remInd[1]);

  if (!side) desc.push(`Left start: ${start}, end: ${end}, relEnd: ${relEnd}`);
  else desc.push(`Right start: ${start}, end: ${end}`);
  snapshot.steps.push({
    id,
    type,
    side,
    start,
    end,
    desc,
    left,
    right,
    leftOver
  });
}

function logMerge({ id, type, start, mid, end, subSteps }) {
  const desc = [`Phase: Merge`, `merge(arr, ${start}, ${mid}, ${end})`];
  snapshot.steps.push({ id, type, start, mid, end, desc, subSteps });
}

module.exports = {
  sort: arr => {
    snapshot.ipArr = arr;
    mergeSort(arr, 0, arr.length);
    return snapshot;
  }
};
