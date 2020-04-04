var exec = require('child_process').exec, child;

var functions = require('./functions');

module.exports = {
    GitPUllRebase: () => {
        // console.log('ddddddddddddddddd: ');
    child = exec('git pull --rebase',
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        if (functions.testEmpty(stderr) !== 'empty-yes') {
			console.log('stderr: ' + stderr);
		}
        if (error !== null) {
            console.log('exec error: ' + error);

        }

        if (String(stderr).includes("fatal: could not read Password for"))
        {
            functions.gitPull_ExternalCall()
        }
        if (String(stderr).includes("Your branch is ahead of"))
        {
            functions.gitPull_ExternalCall()
        }
        if (String(stderr).includes('could not read Username'))
        {
            functions.gitPull_ExternalCall()
        }
        
    });
    }
};