var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    TaggingPusAllhTagsToRemote: () => {
        functions.MakeTerminalCallFromMenuName('start cmd /k git push --tags');
    }
};

