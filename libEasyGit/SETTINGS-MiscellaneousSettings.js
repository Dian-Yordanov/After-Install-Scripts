var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    SETTINGSFunction3: () => {
        functions.SETTINGSEnableordisableMiscellaneousSettings();
        // console.log("wwww");
    }
};

