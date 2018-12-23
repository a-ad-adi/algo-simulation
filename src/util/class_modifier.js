const clsUtil = {
  clsList: [],
  clsStr: "",
  addCls: function(cls) {
    if (this.clsList.indexOf(cls) === -1) this.clsList.push(cls);
    this.getClsString();
    return this;
  },
  removeCls: function(cls) {
    const ind = this.clsList.indexOf(cls);
    let list = this.clsList;
    if (ind > -1)
      list = [...list.splice(0, ind), ...list.slice(ind + 1, list.length)];
    this.clsList = list;
    this.getClsString();
    return this;
  },
  getClsList: function(str) {
    this.clsList = str.split(/\s/);
    this.getClsString();
    return this;
  },
  getClsString: function() {
    this.clsStr = this.clsList.join(" ");    
    return this;
  }
};

export default clsUtil;
