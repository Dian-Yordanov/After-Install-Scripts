var exec = require('child_process').exec, child;

const functions = require('../functions');

module.exports = {
    VisualiseGitVersion2: () => {
        functions.MakeTerminalCallFromMenuName('git log --all --color --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit');
    }
};

