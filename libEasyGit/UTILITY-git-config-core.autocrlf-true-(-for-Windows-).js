var exec = require('child_process').exec, child;

var functions = require('./functions');

module.exports = {
    WindowsConfig: () => {
        functions.MakeTerminalCallFromMenuName(answers, chalk.magenta('UTILITY:    git config core.autocrlf true ( for Windows )    (git config core.autocrlf true)'), 'git config core.autocrlf true');
    }
};