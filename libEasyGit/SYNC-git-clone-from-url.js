var exec = require('child_process').exec, child;

var functions = require('./functions');

module.exports = {
    GitCloneFromURl: () => {
        const questions = [
            {
                type: 'text',
                name: 'url',
                pageSize: '50',
                message: 'What is the URL of the repository?'
            }
        ];
        (async () => {
            const response = await prompts(questions);

            child = exec('git clone ' + response.url,
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    if (functions.testEmpty(stderr) !== 'empty-yes') {
						console.log('stderr: ' + stderr);
					}
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        console.log('response.url ' + response.url + '.git');
                        
                        // If it fails
                        functions.gitCloneFromUrlRetryOnFailure(response.url)
                    }
                });

        })();
    }
};