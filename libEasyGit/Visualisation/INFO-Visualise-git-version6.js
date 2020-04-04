var exec = require('child_process').exec, child;

const functions = require('../functions');

module.exports = {
    VisualiseGitVersion6: () => {
        functions.MakeTerminalCallFromMenuName('git log --oneline --all --graph --color --shortstat --name-only -5');
    }
};

