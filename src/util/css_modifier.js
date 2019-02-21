module.exports = {
    getInlineCss: function(propList){
        let retObj = {};
        propList.map( p => retObj[p.prop] = `${p.val}${p.dim}`);
        return retObj;
    }
}