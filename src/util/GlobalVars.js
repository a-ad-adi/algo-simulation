module.exports = {
  //notification types
  nTypes: {
    GREET: 0,
    NOTIFY: 1,
    DESCRIBE: 2,
    CONTENT: 3,
    ERROR: 4
  },
  sortAlgo: {
    merge: {
      LEFT: 0,
      RIGHT: 1,
      SPLIT: 0,
      MERGE: 1
    }
  },
  actions: {
    HMIN: 0,
    VMIN: 1,
    HMAX: 2,
    VMAX: 3
  },
  csses: {
    num: [
      { prop: "margin", val: 1, dim: "px" },
      { prop: "padding-top", val: 5, dim: "px" },
      { prop: "padding-bottom", val: 5, dim: "px" },
      { prop: "padding-left", val: 10, dim: "px" },
      { prop: "padding-right", val: 10, dim: "px" }
    ]
  }
};
