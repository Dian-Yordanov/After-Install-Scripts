var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    GoToOrigin: () => {
        child = exec('git config --get remote.origin.url',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
             if (functions.testEmpty(stderr) !== 'empty-yes') {
						console.log('stderr: ' + stderr);
			}
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            var opsys = process.platform;
            if (opsys == "darwin") {
                opsys = "MacOS";
            } else if (opsys == "win32" || opsys == "win64") {
                opsys = "Windows";
                var readableURL = functions.MakegitURLtoNormalURL(stdout);
                var readableURL2 = functions.MakegitURLtoNormalURL2(stdout);
                console.log('readableURL: ' + readableURL);
                console.log('readableURL2: ' + readableURL2);
                console.log('readableURL: ' + functions.validURL(readableURL));
                console.log('readableURL2: ' + functions.validURL(readableURL2));
                if(functions.validURL(readableURL2)){
                    child = exec('start ' + readableURL2,
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
                else if(functions.validURL(readableURL)){
                    child = exec('start ' + readableURL,
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
            } else if (opsys == "linux") {
                var readableURL = functions.MakegitURLtoNormalURL(stdout);
                child = exec('firefox ' + readableURL,
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
        });
    }
};
