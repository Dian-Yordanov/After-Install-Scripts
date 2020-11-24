var exec = require('child_process').exec, child;
const chalk = require('chalk');

const functions = require('./functions');

module.exports = {
    gitStatus: () => {
        child = exec('git status',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            console.log(chalk.blue('stdout: ' + stdout));
            
			if (functions.testEmpty(stderr) !== 'empty-yes') {
				console.log(chalk.yellow('stderr: ' + stderr));
			}
            if (error !== null) {
                console.log(chalk.red('exec error: ' + error));

            }
        });
    }
};

