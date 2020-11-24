var exec = require('child_process').exec, child;
const inquirer = require('inquirer');
var Spinner = require('cli-spinner').Spinner;

const functions = require('./functions');

module.exports = {
    Commit: () => {
     const args = require('minimist')(process.argv.slice(2));

            if (process.argv.length == 2) {
                var arg1var;

                var questions1 = [{
                    type: 'input',
                    name: 'arg1',
                    message: "Input argument 1:",
                }]
                inquirer.prompt(questions1).then(answers => {
                    arg1var = (`${answers['arg1']}`);
                    
                    var spinner = new Spinner('executing the git commands');
                    spinner.setSpinnerString('|/-\\');
                    spinner.start();

                    child = exec('git add . && git add -A  && git commit -m"' + arg1var,
                    { maxBuffer: 1024 * 2048},
                    function (error, stdout, stderr) {



                        console.log('stdout: ' + stdout);
						if (functions.testEmpty(stderr) !== 'empty-yes') {
							console.log('stderr: ' + stderr);
						}
                        if (error !== null) {
                            console.log('exec error: ' + error);

                            if (String(error).includes("Error: Command failed:"))
                            {
                                functions.gitPush_ExternalCall()
                                
                            }

                        }
                        if (String(stderr).includes("fatal: could not read Password for"))
                        {
                            functions.gitPush_ExternalCall()
                            
                        }
                        if (String(stderr).includes("Your branch is ahead of"))
                        {
                            functions.gitPush_ExternalCall()
                            
                        }
                        if (String(stderr).includes("failed to push some refs to"))
                        {
                            child = exec('git add --ignore-errors . && git commit -m "initial commit"',
                            { maxBuffer: 1024 * 2048},
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                if (functions.testEmpty(stderr) !== 'empty-yes') {
									console.log('stderr: ' + stderr);
								}
                                
                            });
                        }
                        
                        spinner.stop();

                    });

                })

                
            }
            if (process.argv.length > 2) {
                var ArgumentStringTwo = JSON.stringify(args).slice(6, JSON.stringify(args).length - 2);
                var ArgumentStringThree = ArgumentStringTwo.split("\",\"").join(' ').slice(1, ArgumentStringTwo.split("\",\"").join(' ').length - 1);;
                console.log('ArgumentStringThree: ' + ArgumentStringThree);
                child = exec('git add . && git add -A  && git commit -m"' + ArgumentStringThree,
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
    }
};

