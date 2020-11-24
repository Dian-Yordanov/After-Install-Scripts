var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    ShowBranches: () => {
        functions.MakeTerminalCallFromMenuName('git branch -a');
    }
};

