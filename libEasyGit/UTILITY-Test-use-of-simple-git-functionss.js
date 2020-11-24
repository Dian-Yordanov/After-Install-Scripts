var exec = require('child_process').exec, child;

var functions = require('./functions').spawn;

module.exports = {
    TestFunctionForSimplegit: () => {
        functions.TestFunctionForSimplegit();
    }
};
