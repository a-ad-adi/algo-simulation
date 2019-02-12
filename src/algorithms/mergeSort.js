const snapshot = {
    algo: "Merge sort",
    steps: []
}
let c = 0;
function merge(a, start, mid, end) {
  const left = a.slice(start, mid+1);
  const right = a.slice(mid + 1, end+1);
  // console.log(left, right);
  let [i, j, k, l, r] = [0, 0, start, left.length, right.length];
  while (i < l && j < r) {
    if (left[i] < right[j]) a[k++] = left[i++];
    else if (left[i] > right[j]) a[k++] = right[j++];
    else {
      a[k++] = left[i++];
      a[k++] = right[j++];
    }
  }
  while (i < l) a[k++] = left[i++];
  while (j < r) a[k++] = right[j++];

}

function mergeSort(a, l, r) {
  if (l < r) {
    const m = parseInt((l + r) / 2);
    snapshot.steps.push({id: c++,type: "split", start: l, end: m });
    mergeSort(a, l, m);
    snapshot.steps.push({id: c++,type: "split", start: m+1, end: r });
    mergeSort(a, m + 1, r);
    snapshot.steps.push({id: c++,type: "merge", start: l, mid: m, end: r });
    merge(a, l, m, r);
    console.log(a);
  }
}

module.exports = {
    sort: (arr) => {    
    snapshot.ipArr = arr;    
    mergeSort(arr, 0, arr.length - 1);
    return snapshot;
  }
};
