var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    ShowOhshitgit: () => {
        var opsys = process.platform;
        if (opsys == "darwin") {
            opsys = "MacOS";
        } else if (opsys == "win32" || opsys == "win64") {
            opsys = "Windows";
            child = exec('start https://ohshitgit.com/',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    if (functions.testEmpty(stderr) !== 'empty-yes') {
						console.log('stderr: ' + stderr);
					}
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        } else if (opsys == "linux") {
            opsys = "Linux";
            child = exec('firefox https://ohshitgit.com/',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    if (functions.testEmpty(stderr) !== 'empty-yes') {
						console.log('stderr: ' + stderr);
					}
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        }
        console.log(opsys) // I don't know what linux is.
    }
};