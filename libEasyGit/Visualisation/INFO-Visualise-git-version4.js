var exec = require('child_process').exec, child;

const functions = require('../functions');

module.exports = {
    VisualiseGitVersion4: () => {
        functions.MakeTerminalCallFromMenuName('git log --all --color --graph');
    }
};

