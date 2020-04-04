var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    Sync_GitPush_ExternalCall: () => {
        functions.gitPush_ExternalCall();
    }
};