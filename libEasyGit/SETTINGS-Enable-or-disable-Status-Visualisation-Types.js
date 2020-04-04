var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    SETTINGSFunction2: () => {
        functions.SETTINGSEnableordisableStatusVisualisationTypes();
        // console.log("wwww");
    }
};

