var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    SETTINGSFunction1: () => {
        functions.SETTINGSEnableordisablestartupdatafields();
        // console.log("wwww");
    }
};

