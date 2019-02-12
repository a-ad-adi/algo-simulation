const stateUtil = {
  updateSubState: function(prop, key, val) {
    prop[key] = val;
    return prop;
  }
};

export default stateUtil;
