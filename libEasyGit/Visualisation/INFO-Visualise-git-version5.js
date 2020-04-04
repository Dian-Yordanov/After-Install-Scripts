var exec = require('child_process').exec, child;

const functions = require('../functions');

module.exports = {
    VisualiseGitVersion5: () => {
        functions.MakeTerminalCallFromMenuName('git log --oneline --abbrev-commit --all --graph --decorate --color --shortstat --max-count=5');
    }
};

