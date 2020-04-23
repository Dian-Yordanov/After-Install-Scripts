const inquirer = require('inquirer');
var fs = require('fs');
var exec = require('child_process').exec, child;
const prompts = require('prompts');
const { execSync } = require('child_process');
const chalk = require('chalk');
var Spinner = require('cli-spinner').Spinner;
var spawn = require('child_process').spawn;

const functionsForReadingAndWritingToIniConfigFiles = require('./StartupScreen/functionsForReadingAndWritingToIniConfigFiles');

function limitStringLinesCount(string, numberOfLines){
    var stringToReturn = "";
    splittedString = string.split("\n")
    for(var i=0;i<numberOfLines;i++){
        stringToReturn = stringToReturn + splittedString[i] + "\n";
    }
    return stringToReturn;
}

function getSizeOfStringLines(string){
    var linesOfSring = string.split("\n");
    return linesOfSring.length;
}

var MakegitURLtoNormalURL = function (gitURl) 
{
    console.log("gitURl: " + gitURl);

    if (gitURl.includes("gitlab.com")) {
        var StringToReturn2 = gitURl.replace(/:/g, "/");
        return (StringToReturn2);
    }
    if (gitURl.includes("bitbucket.org")) {
        var pattern = /.*https:\/\/(.*)\@.*/gi;
        var StringToReturn1 = pattern.exec(gitURl);

        console.log("StringToReturn1: " + StringToReturn1);

        if (is_empty(StringToReturn1)){
            var pattern1 = /.*https:\/\/*/gi;
            var StringToReturn11 = pattern1.exec(gitURl);
            var StringToReturn21 = gitURl.replace(StringToReturn11[1], "").replace("@", "");
            return (StringToReturn21);
        }
        else{
            var StringToReturn2 = gitURl.replace(StringToReturn1[1], "").replace("@", "");
            return (StringToReturn2);
        }
    }
}

var MakegitURLtoNormalURL2 = function (gitURl) 
{
    console.log("gitURl: " + gitURl);

    if (gitURl.includes("gitlab.com")) {
        var StringToReturn2 = gitURl.replace('\n','') +".git";
        return (StringToReturn2);
    }
    if (gitURl.includes("bitbucket.org")) {
        var pattern = /.*https:\/\/(.*)\@.*/gi;
        var StringToReturn1 = pattern.exec(gitURl);

        console.log("StringToReturn1: " + StringToReturn1);

        if (is_empty(StringToReturn1)){
            var pattern1 = /.*https:\/\/*/gi;
            var StringToReturn11 = pattern1.exec(gitURl);
            var StringToReturn21 = gitURl.replace(StringToReturn11[1], "").replace("@", "");
            return (StringToReturn21);
        }
        else{
            var StringToReturn2 = gitURl.replace(StringToReturn1[1], "").replace("@", "");
            return (StringToReturn2);
        }
    }
}

function isNullOrEmpty(str){
    return !str||!str.trim();
}
var testEmpty = function (str) {
  if(isNullOrEmpty(str)){
    return 'empty-yes';
  } else {
    return 'empty-no';
  }
}

var is_empty = function (x) 
{
   return ( 
        (typeof x == 'undefined')
                    ||
        (x == null) 
                    ||
        (x == false)  //same as: !x
                    ||
        (x.length == 0)
                    ||
        (x == "")
                    ||
        (!/[^\s]/.test(x))
                    ||
        (/^\s*$/.test(x))
  );
}

var CleanString = function (StringValue) 
{
    var returnString = StringValue.toString()
        .replace(/\n|\0|\t|\r|\f|\v|\x0d|\x0a|\x0d\x0a|\↵/g, '')
        .replace("\\x00", null)
        .replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
        .replace(/(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g)
        .replace(/([\x7F-\x84]|[\x86-\x9F]|[\uFDD0-\uFDEF]|(?:\uD83F[\uDFFE\uDFFF])|(?:\uD87F[\uDFFE\uDFFF])|(?:\uD8BF[\uDFFE\uDFFF])|(?:\uD8FF[\uDFFE\uDFFF])|(?:\uD93F[\uDFFE\uDFFF])|(?:\uD97F[\uDFFE\uDFFF])|(?:\uD9BF[\uDFFE\uDFFF])|(?:\uD9FF[\uDFFE\uDFFF])|(?:\uDA3F[\uDFFE\uDFFF])|(?:\uDA7F[\uDFFE\uDFFF])|(?:\uDABF[\uDFFE\uDFFF])|(?:\uDAFF[\uDFFE\uDFFF])|(?:\uDB3F[\uDFFE\uDFFF])|(?:\uDB7F[\uDFFE\uDFFF])|(?:\uDBBF[\uDFFE\uDFFF])|(?:\uDBFF[\uDFFE\uDFFF])(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g, '');
    return returnString;
}

var uniq = function (a) 
{
    var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

var getUserHome = function () 
{
    const os = require('os');
    return os.homedir();
}

var gitCloneFromUrlRetryOnFailure = function (nameOfRemoteRepo) 
{
    runCmdHandler(".", "start cmd /k git clone " + nameOfRemoteRepo + '.git');
}

var spawnProcess = function (dir, cmd) 
{
    return (process.platform.toLowerCase().indexOf("win") >= 0) 
      ? spawnWindowsProcess(dir, cmd)
      : spawnLinuxProcess(dir, cmd);
}
    
var spawnWindowsProcess = function (dir, cmd) 
{
    return spawn("cmd.exe", ["/c", cmd], {cwd: dir});
}

var spawnLinuxProcess = function (dir, cmd) 
{
    var cmdParts = cmd.split(/\s+/);

    return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir});
}

var runCmdHandler = function (dir, cmd) 
{
    var process = null;

    try {
        process = spawnProcess(dir, cmd);
    } catch (e) {
        console.error("Error trying to execute command '" + cmd + "' in directory '" + dir + "'");
        console.error(e);
        console.log("error", e.message);
        console.log("finished");
        return;
    }

    process.stdout.on('data', function (data) {
        console.log("progress", data.toString('utf-8'));
    });

    process.stderr.on('data', function (data) {
        console.log("error", data.toString('utf-8'));
    });

    process.on('exit', function (code) {
        console.log("finished");
    });
}

var gitPull_ExternalCall = function () 
{
    runCmdHandler(".", "start cmd /k git pull origin master");
};

var gitPush_ExternalCall = function () 
{
    // runCmdHandler(".", "start cmd /k git push");
    // try{
    child = exec("git push",
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log(stdout);
        if (error.toString().includes("fatal: TypeLoadException encountered.")) {
            runCmdHandler(".", "start cmd /k git push");
        }
        if (stderr !== null && !stderr.toString().includes("fatal: The current branch") && !stderr.toString().includes("fatal: TypeLoadException encountered.")) {
            console.log('stderr: ' + stderr);
        }
        if (error !== null && !error.toString().includes("fatal: The current branch") && !error.toString().includes("fatal: TypeLoadException encountered.")) {
            console.log('exec error: ' + error);
        }
        if (stderr.toString().includes("fatal: The current branch")) {
            // console.log('dddd');
            // git push --set-upstream origin TestingBranching2 

            child = exec("git rev-parse --abbrev-ref HEAD",
            { maxBuffer: 1024 * 1024 },
            function (error, stdout, stderr) {

                stdout = stdout.replace('\n','');

                console.log(' The current branch '+ stdout + ' has no upstream branch. Do you want to execute ' 
                + chalk.blue('git push --set-upstream origin ' + stdout ) + ' to create upstream branch? ');

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'option',
                            pageSize: '40',
                            choices:  [
                                chalk.green('YES'),
                                chalk.red('NO')],
                        },
                    ])
                    .then(answers => {
                                    
                        if (answers.option == chalk.green('YES')) {
                            // console.log('YES');
                            // runCmdHandler(".", "start cmd /k git push --set-upstream origin " + stdout);


                            child = exec("git push --set-upstream origin " + stdout,
                                { maxBuffer: 1024 * 1024 },
                                function (error, stdout, stderr) {
                                    console.log(stdout);
                                    if (stderr !== null) {
                                        console.log('stderr: ' + stderr);
                                    }
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                    if (stderr === null && error === null) {

                                        console.log(' remote branch has been successfully created. Do you want to try to push now?');
                        
                                        inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'option',
                                                pageSize: '40',
                                                choices:  [
                                                    chalk.green('YES'),
                                                    chalk.red('NO')],
                                            },
                                        ])
                                        .then(answers => {
                                                        
                                            if (answers.option == chalk.green('YES')) {
                                                // console.log('YES');
                                                runCmdHandler(".", "start cmd /k git push");
                                                
                                            }
                                            if (answers.option == chalk.red('NO')) {
                                                console.log(chalk.red('Ok'));
                                            }
                                        });

                                    }
                                    
                                });


        
                        
                        }
                        if (answers.option == chalk.red('NO')) {
                            console.log(chalk.red('Ok, but without upstream branch, you cannot push to remote.'));
                        }
                    });

                });
        }
    });
    // }
    // catch(e){
    //     if (e.toString().includes("fatal: TypeLoadException encountered.")) {
    //         runCmdHandler(".", "start cmd /k git push");
    //     }
    // }

};

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

var MakeTerminalCallFromMenuName = function (TerminalCall) 
{
    child = exec(TerminalCall,
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            console.log(stdout);
             if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
}

var GetListOfRepos = function (answers, answersOption, PseudoBooleanOperationControl) 
{
    console.log(answers);
    console.log(answers.option);
    if (answers.option == answersOption) {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'option',
                    message: 'Choose an option:',
                    pageSize: '16',
                    choices: ['Github', 'Bitbucket', 'Gitlab'],
                },
            ])
            .then(answers => {
                if (answers.option == "Github") {
                    const questions = [
                        {
                            type: 'text',
                            name: 'username',
                            pageSize: '50',
                            message: 'What is your username?'
                        }
                        ,
                        {
                            type: 'password',
                            name: 'password',
                            message: 'What is your password?'
                        }
                    ];
                    (async () => {
                        const response = await prompts(questions);

                        let output = "";
                        let emptyLines = 0;
                        for (var i = 0; i < 10; i++) {
                            var execSyncOutput = execSync('curl -u' + '"' + response.username + ':' + response.password + '" '
                                + '"https://api.github.com/user/repos?page="' + [i] + '"&per_page=100"');

                            if (execSyncOutput.toString().slice(0, -1).length < 5) {
                                emptyLines += 1;
                            }

                            try {
                                output = output.concat(execSyncOutput.toString().slice(0, -1));
                            }
                            catch (err) {

                            }

                        }

                        console.log(emptyLines);
                        console.log(emptyLines * 3 + 1);
                        var outputFromCurl = output.replace(/\]\[/g, ',').toString().slice(0, -(emptyLines * 3 + 1)) + "]";

                        var objstdout = JSON.parse(outputFromCurl);

                        var gitURLList = [];

                        for (ii = 0; ii < objstdout.length; ii++) {

                            gitURLList.push(objstdout[ii].html_url);

                        }

                        for (var i = 0; i < gitURLList.length; i++) {
                            gitURLList[i] = i + ". " + gitURLList[i];
                        }

                        if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanYes") {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'option',
                                        message: 'Choose an option:',
                                        pageSize: '50',
                                        choices: gitURLList,
                                    },
                                ])
                                .then(answers => {
                                    var answersString = answers.option;
                                    console.log(answersString);

                                    dirString = answersString.split(" ");
                                    console.log(dirString[0]);
                                    console.log(dirString[1]);
                                    if (opsys == "darwin") {
                                        opsys = "MacOS";
                                    }
                                    else if (opsys == "win32" || opsys == "win64") {
                                        console.log(answers.option);

                                    }
                                    else if (opsys == "linux") {
                                        // This is made to work on Ubuntu/Mint
                                        console.log(answers.option);

                                    }
                                });
                        }

                        if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanNo") {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'option',
                                        message: 'Choose an option:',
                                        pageSize: '50',
                                        choices: gitURLList,
                                    },
                                ])
                                .then(answers => {
                                    var answersString = answers.option;
                                    var opsys = process.platform;
                                    console.log(answersString);

                                    dirString = answersString.split(" ");
                                    console.log(dirString[0]);
                                    if (opsys == "darwin") {
                                        opsys = "MacOS";
                                    }
                                    else if (opsys == "win32" || opsys == "win64") {

                                        child = exec('git clone ' + dirString[1],
                                            { maxBuffer: 1024 * 1024 },
                                            function (error, stdout, stderr) {
                                                console.log(stdout);
                                                 if (testEmpty(stderr) !== 'empty-yes') {
                                                    console.log('stderr: ' + stderr);
                                                }
                                                if (error !== null) {
                                                    console.log('exec error: ' + error);

                                                    // If it fails
                                                    functions.gitCloneFromUrlRetryOnFailure(dirString[1])
                                                }
                                            });

                                    }
                                    else if (opsys == "linux") {
                                        child = exec('git clone ' + dirString[1],
                                            { maxBuffer: 1024 * 1024 },
                                            function (error, stdout, stderr) {
                                                console.log(stdout);
                                                 if (testEmpty(stderr) !== 'empty-yes') {
                                                    console.log('stderr: ' + stderr);
                                                }
                                                if (error !== null) {
                                                    console.log('exec error: ' + error);
                                                }
                                            });

                                    }
                                });
                        }
                    })();
                }
                if (answers.option == "Bitbucket") {
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'option',
                                message: 'Choose an option:',
                                pageSize: '16',
                                choices: ['Public repos', 'Private repos'],
                            },
                        ])
                        .then(answers => {
                            if (answers.option == "Public repos") {
                                const questions = [
                                    {
                                        type: 'text',
                                        name: 'username',
                                        pageSize: '50',
                                        message: 'What is your username?'
                                    }
                                ];
                                (async () => {
                                    const response = await prompts(questions);

                                    let output = "";
                                    let emptyLines = 0;
                                    for (var i = 1; i < 11; i++) {
                                        var execSyncOutput = execSync('curl "https://api.bitbucket.org/2.0/repositories/'
                                            + response.username + '?pagelen=100&limit=10000&page=' + [i] + '"');

                                        // console.log( execSyncOutput.toString().replace(/\n|\0|\t|\r|\f|\s/gim, ''));

                                        execSyncOutput = functions.CleanString(execSyncOutput.toString());

                                        if (execSyncOutput.toString().slice(0, -1).length < 5) {
                                            emptyLines += 1;
                                        }

                                        try {

                                            output = output + execSyncOutput.toString();
                                            if (i != 10) {
                                                output = output + ",";
                                            }
                                        }
                                        catch (err) {

                                        }

                                    }

                                    output = "[" + output + "]";

                                    console.log(emptyLines);
                                    console.log(emptyLines * 3 + 1);


                                    var objstdout = JSON.parse(output.toString());
                                    var gitURLList = [];


                                    for (var iii = 0; iii < 10; iii++) {


                                        for (ii = 0; ii < objstdout[iii].values.length; ii++) {

                                            gitURLList.push(objstdout[iii].values[ii].links.self.href);

                                        }
                                    }

                                    for (var i = 0; i < gitURLList.length; i++) {
                                        gitURLList[i] = i + ". " + gitURLList[i];
                                    }

                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'option',
                                                message: 'Choose an option:',
                                                pageSize: '50',
                                                choices: gitURLList,
                                            },
                                        ])
                                        .then(answers => {
                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanYes") {
                                                var answersString = answers.option;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");
                                                console.log(dirString[0]);
                                                console.log(dirString[1]);
                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {
                                                    console.log(answers.option);

                                                }
                                                else if (opsys == "linux") {
                                                    // This is made to work on Ubuntu/Mint
                                                    console.log(answers.option);

                                                }
                                            }

                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanNo") {

                                                var answersString = answers.option;
                                                var opsys = process.platform;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");
                                                // console.log(dirString[0]);
                                                dirStringCleanValue = dirString[1].replace("https://api.bitbucket.org/2.0/repositories/", "https://bitbucket.org/");

                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {

                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                functions.gitCloneFromUrlRetryOnFailure(dirStringCleanValue)

                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                            }
                                                        });

                                                }

                                            }
                                        });
                                })();
                            }
                            if (answers.option == "Private repos") {
                                const questions = [
                                    {
                                        type: 'text',
                                        name: 'username',
                                        message: 'What is your username?'
                                    }
                                    ,
                                    {
                                        type: 'password',
                                        name: 'password',
                                        message: 'What is your password?'
                                    }

                                ];
                                (async () => {
                                    const response = await prompts(questions);

                                    let output = "";
                                    let emptyLines = 0;
                                    for (var i = 1; i < 11; i++) {
                                        var execSyncOutput = execSync('curl "https://api.bitbucket.org/2.0/repositories/' + response.username + '?pagelen=100&limit=10000&page='
                                            + [i] + '"' + ' -u ' + '"' + response.username + ':' + response.password + '"');

                                        execSyncOutput = functions.CleanString(execSyncOutput.toString());

                                        if (execSyncOutput.toString().slice(0, -1).length < 5) {
                                            emptyLines += 1;
                                        }

                                        try {

                                            output = output + execSyncOutput.toString();
                                            if (i != 10) {
                                                output = output + ",";
                                            }
                                        }
                                        catch (err) {

                                        }

                                    }

                                    output = "[" + output + "]";

                                    console.log(emptyLines);
                                    console.log(emptyLines * 3 + 1);


                                    var objstdout = JSON.parse(output.toString());
                                    var gitURLList = [];


                                    for (var iii = 0; iii < 10; iii++) {



                                        for (ii = 0; ii < objstdout[iii].values.length; ii++) {

                                            gitURLList.push(objstdout[iii].values[ii].links.self.href);
                                            // console.log(objstdout.values[ii]);
                                        }
                                    }

                                    for (var i = 0; i < gitURLList.length; i++) {
                                        gitURLList[i] = i + ". " + gitURLList[i];
                                    }

                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'option',
                                                message: 'Choose an option:',
                                                pageSize: '50',
                                                choices: gitURLList,
                                            },
                                        ])
                                        .then(answers => {
                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanYes") {
                                                var answersString = answers.option;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");
                                                console.log(dirString[0]);
                                                console.log(dirString[1]);
                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {
                                                    console.log(answers.option);

                                                }
                                                else if (opsys == "linux") {
                                                    // This is made to work on Ubuntu/Mint
                                                    console.log(answers.option);

                                                }
                                            }

                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanNo") {

                                                var answersString = answers.option;
                                                var opsys = process.platform;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");

                                                dirStringCleanValue = dirString[1].replace("https://api.bitbucket.org/2.0/repositories/", "https://bitbucket.org/");


                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {

                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                functions.gitCloneFromUrlRetryOnFailure(dirStringCleanValue)

                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {

                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                            }
                                                        });

                                                }
                                            }
                                        });
                                })();
                            }
                        });

                }
                if (answers.option == "Gitlab") {
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'option',
                                message: 'Choose an option:',
                                pageSize: '16',
                                choices: ['Public repos', 'Private repos'],
                            },
                        ])
                        .then(answers => {
                            if (answers.option == "Public repos") {
                                const questions = [
                                    {
                                        type: 'text',
                                        name: 'username',
                                        pageSize: '50',
                                        message: 'What is your username?'
                                    }
                                ];
                                (async () => {
                                    const response = await prompts(questions);

                                    let output = "";
                                    let emptyLines = 0;
                                    for (var i = 0; i < 10; i++) {
                                        var execSyncOutput = execSync('curl "https://gitlab.com/api/v4/users/'
                                            + response.username + '/projects?page=' + i + '&per_page=100" ');

                                        execSyncOutput = functions.CleanString(execSyncOutput);
                                        var objstdout = JSON.parse(execSyncOutput);

                                        if (execSyncOutput.toString().slice(0, -1).length < 5) {
                                            emptyLines += 1;
                                        }

                                        try {

                                            for (var ii = 0; ii < objstdout.length; ii++) {

                                                output = output.concat(objstdout[ii].web_url + " ");
                                            }

                                        }
                                        catch (err) {

                                        }
                                    }


                                    var gitURLList = output.split(" ");

                                    var uniqueArray = gitURLList.filter(function (item, pos) {
                                        return gitURLList.indexOf(item) == pos;
                                    });

                                    var filtered = uniqueArray.filter(function (el) {
                                        if (el != "") {
                                            return el != null;
                                        }
                                    });

                                    gitURLList = filtered;

                                    for (var i = 0; i < gitURLList.length; i++) {
                                        gitURLList[i] = i + ". " + gitURLList[i];
                                    }

                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'option',
                                                message: 'Choose an option:',
                                                pageSize: '50',
                                                choices: gitURLList,
                                            },
                                        ])
                                        .then(answers => {
                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanYes") {
                                                var answersString = answers.option;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");
                                                console.log(dirString[0]);
                                                console.log(dirString[1]);
                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {
                                                    console.log(answers.option);

                                                }
                                                else if (opsys == "linux") {
                                                    // This is made to work on Ubuntu/Mint
                                                    console.log(answers.option);

                                                }
                                            }

                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanNo") {

                                                var answersString = answers.option;
                                                var opsys = process.platform;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");

                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {

                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                functions.gitCloneFromUrlRetryOnFailure(dirString[1])
                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                            }
                                                        });

                                                }

                                            }
                                        });
                                })();
                            }
                            if (answers.option == "Private repos") {
                                const questions = [
                                    {
                                        type: 'text',
                                        name: 'username',
                                        message: 'What is your username?'
                                    }
                                    ,
                                    {
                                        type: 'password',
                                        name: 'private_token',
                                        message: 'What is your private token?'
                                    }
                                ];

                                (async () => {
                                    const response = await prompts(questions);

                                    let output = "";
                                    let emptyLines = 0;
                                    for (var i = 0; i < 10; i++) {
                                        var execSyncOutput = execSync('curl "https://gitlab.com/api/v4/users/'
                                            + response.username + '/projects?private_token=' + response.private_token
                                            + '&page=' + i + '&per_page=100" ');

                                        execSyncOutput = functions.CleanString(execSyncOutput);
                                        var objstdout = JSON.parse(execSyncOutput);


                                        if (execSyncOutput.toString().slice(0, -1).length < 5) {
                                            emptyLines += 1;
                                        }

                                        try {

                                            for (var ii = 0; ii < objstdout.length; ii++) {

                                                output = output.concat(objstdout[ii].web_url + " ");
                                            }

                                        }
                                        catch (err) {

                                        }
                                    }



                                    var gitURLList = output.split(" ");

                                    var uniqueArray = gitURLList.filter(function (item, pos) {
                                        return gitURLList.indexOf(item) == pos;
                                    });

                                    var filtered = uniqueArray.filter(function (el) {
                                        if (el != "") {
                                            return el != null;
                                        }
                                    });

                                    gitURLList = filtered;

                                    for (var i = 0; i < gitURLList.length; i++) {
                                        gitURLList[i] = i + ". " + gitURLList[i];
                                    }

                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'option',
                                                message: 'Choose an option:',
                                                pageSize: '50',
                                                choices: gitURLList,
                                            },
                                        ])
                                        .then(answers => {
                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanYes") {
                                                var answersString = answers.option;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");
                                                console.log(dirString[0]);
                                                console.log(dirString[1]);
                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {
                                                    console.log(answers.option);

                                                }
                                                else if (opsys == "linux") {
                                                    // This is made to work on Ubuntu/Mint
                                                    console.log(answers.option);

                                                }
                                            }

                                            if (PseudoBooleanOperationControl == "EndHerePseudo-BooleanNo") {

                                                var answersString = answers.option;
                                                var opsys = process.platform;
                                                console.log(answersString);

                                                dirString = answersString.split(" ");

                                                if (opsys == "darwin") {
                                                    opsys = "MacOS";
                                                }
                                                else if (opsys == "win32" || opsys == "win64") {

                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                                
                                                                // If it fails
                                                                functions.gitCloneFromUrlRetryOnFailure(dirString[1])

                                                            }
                                                        });
                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log(stdout);
                                                             if (testEmpty(stderr) !== 'empty-yes') {
                                                                console.log('stderr: ' + stderr);
                                                            }
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                            }
                                                        });
                                                }
                                            }
                                        });
                                })();
                            }
                        });
                }
            });
    }
}

var TestFunctionForSimplegit = function ()
{
    // https://www.npmjs.com/package/simple-git


    // const simplegit = require('simple-git')(workingDirPath);
    // git().pull('origin', 'master', {'--no-rebase': null})

    // require('simple-git')()
    // .listRemote(['--get-url'], (err, data) => {
    //     if (!err) {
    //         console.log('Remote url for repository at ' + __dirname + ':');
    //         console.log(data);

    //         require('simple-git')()
    // .log((err, log) => console.log(log))

    //     }
    // });



    



    // require('simple-git')().push('origin', 'master')
    require('simple-git')().commit('message')
    

}

var TestFunctionForSimplegit = function ()
{

    runCmdHandler(".", "git status");
    
    child = exec('git add . && git add -A  && git commit -m"' + ArgumentStringThree + '" && start cmd /k git push',
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log(stdout);
         if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
        if (error !== null) {
            console.log('exec error: ' + error);

        }
    });
    
}

var OpenLocalRepo = function (answersOption)
{
    // if (answers.option == answersOption) {
        var opsys = process.platform;
        if (opsys == "darwin") {
            opsys = "MacOS";
        }
        else if (opsys == "win32" || opsys == "win64") {
            WinUserName = getUserHome();
            var dir = WinUserName + '/Documents/GitRepoList';

            var FileDir = dir + "/List.txt";
            if (fs.existsSync(FileDir)) {
                FileText = fs.readFileSync(dir + "/List.txt");
                var fileSet = uniq(FileText.toString().split(/\r?\n/).clean(''));
                // console.log(fileSet);

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'option',
                            message: 'Choose an option:',
                            pageSize: '16',
                            choices: fileSet,
                        },
                    ])
                    .then(answers => {
                        var answersString = answers.option;
                        console.log(answersString);

                        dirString = answersString.split(" ");
                        console.log(dirString[0]);

                        require('child_process').exec('start "" ' + dirString[0]);

                    });

            }
        }
        else if (opsys == "linux") {
            LinuxUserName = getUserHome();
            var dir = LinuxUserName + '/GitRepoList';

            var FileDir = dir + "/List.txt";
            if (fs.existsSync(FileDir)) {
                FileText = fs.readFileSync(dir + "/List.txt");
                var fileSet = uniq(FileText.toString().split(/\r?\n/).clean(''));
                // console.log(fileSet);

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'option',
                            message: 'Choose an option:',
                            pageSize: '16',
                            choices: fileSet,
                        },
                    ])
                    .then(answers => {
                        var answersString = answers.option;
                        console.log(answersString);

                        dirString = answersString.split(" ");
                        console.log(dirString[0]);
                        if (opsys == "darwin") {
                            opsys = "MacOS";
                        }
                        else if (opsys == "win32" || opsys == "win64") {
                            require('child_process').exec('start "" ' + dirString[0]);
                        }
                        else if (opsys == "linux") {
                            // This is made to work on Ubuntu/Mint
                            require('child_process').exec('nemo ' + dirString[0]);
                        }

                    });
            }
        }
    // }
}

var RegisterRepo = function (answersOption)
{
    // if (answers.option == answersOption) {

        var opsys = process.platform;
        if (opsys == "darwin") {
            opsys = "MacOS";
        } else if (opsys == "win32" || opsys == "win64") {
            WinUserName = getUserHome();
            console.log(WinUserName);
            opsys = "Windows";
            var dir = WinUserName + '/Documents/GitRepoList';

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            var readableURL = "";
            child = exec('git config --get remote.origin.url',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log(stdout);
                     if (testEmpty(stderr) !== 'empty-yes') {
                        console.log('stderr: ' + stderr);
                    }
                    readableURL = MakegitURLtoNormalURL(stdout);
                    var currentPath = __dirname;

                    var outputVar = currentPath + " " + readableURL;
                    console.log(outputVar);

                    try {
                        if (fs.existsSync(dir + "/List.txt")) {

                            FileText = fs.readFileSync(dir + "/List.txt");
                            var fileSet = uniq(FileText.toString().split(/\r?\n/).clean(''));

                            let uniqueArray = new Set();
                            fileSet.forEach(function (entry) {
                                uniqueArray.add(entry);
                            });

                            var stream = fs.createWriteStream(dir + "/List.txt");
                            stream.once('open', function (fd) {

                                stream.write(Array.from(uniqueArray).toString().replace("\r\n", "").replace(/,/g, "\r\n"));
                                stream.write("\r\n");
                                stream.write(outputVar);
                                stream.end();
                            });

                        }
                        else {
                            fs.writeFile(dir + "/List.txt", "", { flag: 'wx' }, function (err) {
                                console.log("File created");
                            });
                        }
                    }
                    catch (err) {

                    }
                });

        } else if (opsys == "linux") {
            LinuxUserName = getUserHome();
            console.log(LinuxUserName);

            var dir = LinuxUserName + '/GitRepoList';

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            var readableURL = "";
            child = exec('git config --get remote.origin.url',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log(stdout);
                     if (testEmpty(stderr) !== 'empty-yes') {
                        console.log('stderr: ' + stderr);
                    }
                    readableURL = MakegitURLtoNormalURL(stdout);
                    var currentPath = __dirname;

                    var outputVar = currentPath + " " + readableURL;
                    console.log(outputVar);

                    try {
                        if (fs.existsSync(dir + "/List.txt")) {

                            FileText = fs.readFileSync(dir + "/List.txt");
                            var fileSet = uniq(FileText.toString().split(/\r?\n/).clean(''));

                            let uniqueArray = new Set();
                            fileSet.forEach(function (entry) {
                                uniqueArray.add(entry);
                            });

                            var stream = fs.createWriteStream(dir + "/List.txt");
                            stream.once('open', function (fd) {


                                stream.write(Array.from(uniqueArray).toString().replace("\r\n", "").replace(/,/g, "\r\n"));
                                stream.write("\r\n");
                                stream.write(outputVar);
                                stream.end();
                            });

                        }
                        else {
                            fs.writeFile(dir + "/List.txt", "", { flag: 'wx' }, function (err) {
                                console.log("File created");
                            });
                        }
                    }
                    catch (err) {

                    }
                });
        }
    // }
}

var MakeNewBranches = function () 
{
    var arg1var;

    var questions1 = [{
        type: 'input',
        name: 'arg1',
        message: "Write the name of the new branch:",
    }]
    inquirer.prompt(questions1).then(answers => {
        arg1var = (`${answers['arg1']}`);
        
        var spinner = new Spinner('executing the git commands');
        spinner.setSpinnerString('|/-\\');
        spinner.start();

        child = exec('git checkout -b ' + arg1var,
        { maxBuffer: 1024 * 2048},
        function (error, stdout, stderr) {

            console.log('stdout: ' + stdout);
             if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }

            spinner.stop();
        });
    })
}

var SwitchBranches = function () 
{
    child = exec('git branch',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            // console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)
            // console.log(stdoutList);

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a branch:',
                        pageSize: '16',
                        choices: stdoutList,
                    },
                ])
                .then(answers => {
                    var answersString = answers.option;

                    child = exec('git checkout ' + answersString,
                        { maxBuffer: 1024 * 1024 },
                        function (error, stdout, stderr) {
                            console.log(stdout);
                             if (testEmpty(stderr) !== 'empty-yes') {
                                console.log('stderr: ' + stderr);
                            }
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                
                });
        });
}

var RemoveBranch = function () 
{
    child = exec('git branch',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            // console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)
            // console.log(stdoutList);

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a branch:',
                        pageSize: '16',
                        choices: stdoutList,
                    },
                ])
                .then(answers => {
                    var answersString = answers.option;

                    child = exec('git branch -D ' + answersString,
                        { maxBuffer: 1024 * 1024 },
                        function (error, stdout, stderr) {
                            console.log(stdout);
                             if (testEmpty(stderr) !== 'empty-yes') {
                                console.log('stderr: ' + stderr);
                            }
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });

                    // runCmdHandler(".", 'git branch \-\D ' + answersString);
                
                });
        });
}

var Removeremotebranch = function () 
{
    child = exec('git branch -a | grep remotes/*',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)

            var LinkedList = require('./linkedlist')

            var remoteNameForEntry = new LinkedList();
            var originNameForEntry = new LinkedList();
            var branchNameForEntry = new LinkedList();


            stdoutList.forEach(function(entry) {
                remoteNameForEntry.push(entry.split('/')[0]);
                originNameForEntry.push(entry.split('/')[1]);
                branchNameForEntry.push(entry.split('/')[2]);

            });

            var changeCheckRemoteNameForEntry = new LinkedList();
            while (remoteNameForEntry.next()) {
                if(remoteNameForEntry.current!=changeCheckRemoteNameForEntry.head){
                    changeCheckRemoteNameForEntry.push(remoteNameForEntry.current);
                }
            }

            var ArrayForchangeCheckRemoteNameForEntry = [];
            for (var i =0; i<changeCheckRemoteNameForEntry.length ;i++){
                changeCheckRemoteNameForEntry.next();
                ArrayForchangeCheckRemoteNameForEntry[i] = changeCheckRemoteNameForEntry.current;
                
            }


            var originNameForEntryForEntry = new LinkedList();
            while (originNameForEntry.next()) {
                if(originNameForEntry.current!=originNameForEntryForEntry.head){
                    originNameForEntryForEntry.push(originNameForEntry.current);
                }
            }

            var ArrayFororiginNameForEntryForEntry = [];
            for (var i =0; i<originNameForEntryForEntry.length ;i++){
                originNameForEntryForEntry.next();
                ArrayFororiginNameForEntryForEntry[i] = originNameForEntryForEntry.current;
                
            }

            var branchNameForEntryNameForEntry = new LinkedList();
            while (branchNameForEntry.next()) {
                if(branchNameForEntry.current!=branchNameForEntryNameForEntry.head){
                    branchNameForEntryNameForEntry.push(branchNameForEntry.current);
                }
            }

            var ArrayForbranchNameForEntryNameForEntry = [];
            for (var i =0; i<branchNameForEntryNameForEntry.length ;i++){
                branchNameForEntryNameForEntry.next();
                ArrayForbranchNameForEntryNameForEntry[i] = branchNameForEntryNameForEntry.current;
                
            }

            var chosenRemote = "";
            var chosenOrigin = "";
            var chosenBranch = "";

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a remote:',
                        pageSize: '16',
                        choices: ArrayForchangeCheckRemoteNameForEntry,
                    },
                ])
                .then(answers => {
                    chosenRemote = answers.option;
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'option',
                                message: 'Choose an origin:',
                                pageSize: '16',
                                choices: ArrayFororiginNameForEntryForEntry,
                            },
                        ])
                        .then(answers => {
                            chosenOrigin = answers.option;
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'option',
                                        message: 'Choose a branch:',
                                        pageSize: '16',
                                        choices: ArrayForbranchNameForEntryNameForEntry,
                                    },
                                ])
                                .then(answers => {
                                    chosenBranch = answers.option;

                                    console.log("chosenRemote: " + chosenRemote)
                                    console.log("chosenOrigin: " + chosenOrigin)
                                    console.log("chosenBranch: " + chosenBranch)

                                    // "git push " + chosenOrigin + " --delete " + chosenBranch
                                    child = exec("git push " + chosenOrigin + " --delete " + chosenBranch,
                                    { maxBuffer: 1024 * 1024 },
                                    function (error, stdout, stderr) {
                                        console.log(stdout);
                                            if (testEmpty(stderr) !== 'empty-yes') {
                                            console.log('stderr: ' + stderr);
                                        }
                                        if (error !== null) {
                                            console.log('exec error: ' + error);
                                        }

                                        if(stderr.includes("fatal: could not read Username for")){
                                            // console.log("Test");

                                                child = exec('start cmd /k git push ' + chosenOrigin + ' --delete ' + chosenBranch,
                                                { maxBuffer: 1024 * 1024 },
                                                function (error, stdout, stderr) {
                                                console.log(stdout);
                                                    if (testEmpty(stderr) !== 'empty-yes') {
                                                    console.log('stderr: ' + stderr);
                                                }
                                                if (error !== null) {
                                                    console.log('exec error: ' + error);
                                                }

                                                if(stderr.includes("fatal: could not read Username for")){
                                                    console.log("Test");

                                                }

                                            });
                                        }
                                    });
                            });
                    });
            });
        });
}

var MergeBranches = function () 
{
    // console.log('execggggg');
    child = exec('git branch',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {
            // console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)
            // console.log(stdoutList);

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a branch:',
                        pageSize: '16',
                        choices: stdoutList,
                    },
                ])
                .then(answers => {
                    var answersString = answers.option;

                    child = exec('git merge ' + answersString,
                        { maxBuffer: 1024 * 1024 },
                        function (error, stdout, stderr) {
                            console.log(stdout);
                             if (testEmpty(stderr) !== 'empty-yes') {
                                console.log('stderr: ' + stderr);
                            }
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });

                    // runCmdHandler(".", 'git branch \-\D ' + answersString);
                
                });
        });
}

var REVERTHeadAndLastCommit = function () 
{

    MakeTerminalCallFromMenuName('git reset HEAD~1');

}

var REVERTHeadAndLastCommitSoft = function () 
{

    // console.log('execggggg1');
    MakeTerminalCallFromMenuName('git reset --soft HEAD~1');

}

var REVERTHeadAndLastCommitHard = function () 
{

    // console.log('execggggg2');
    MakeTerminalCallFromMenuName('git reset --hard HEAD~1');

}


var TaggingShow = function () 
{
    // console.log('TaggingShow dddddddddddd');
    // console.log('execggggg');
    child = exec('git tag',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {

            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a branch:',
                        pageSize: '16',
                        choices: stdoutList,
                    },
                ])
                .then(answers => {
                    var answersString = answers.option;

                    child = exec('git show ' + answersString,
                        { maxBuffer: 1024 * 1024 },
                        function (error, stdout, stderr) {
                            console.log(stdout);
                             if (testEmpty(stderr) !== 'empty-yes') {
                                console.log('stderr: ' + stderr);
                            }
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });

                });
        });
}

var TaggingDeleteTags = function () 
{
    // console.log('TaggingShow dddddddddddd');
    // console.log('execggggg');
    child = exec('git tag',
        { maxBuffer: 1024 * 1024 },
        function (error, stdout, stderr) {

            if (testEmpty(stderr) !== 'empty-yes') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            stdoutList = stdout.replace('*','').replace(' ','');
            stdoutList = stdoutList.replace(/[\x20]/g,"");
            stdoutList = stdoutList.split(/\r?\n/);
            stdoutList = stdoutList.filter(n => n)

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'Choose a branch:',
                        pageSize: '16',
                        choices: stdoutList,
                    },
                ])
                .then(answers => {
                    var answersString = answers.option;

                    child = exec('git tag -d ' + answersString,
                        { maxBuffer: 1024 * 1024 },
                        function (error, stdout, stderr) {
                            console.log(stdout);
                             if (testEmpty(stderr) !== 'empty-yes') {
                                console.log('stderr: ' + stderr);
                            }
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });

                });
        });
}

var TaggingCreateAnnotatedTags = function () 
{
    var arg1var;
    var arg2var;

    var questions1 = [{
        type: 'input',
        name: 'arg1',
        message: "Input tag name (-a):",
        
    },{
        type: 'input',
        name: 'arg2',
        message: "Input tag message (-m):",
    }]

    // var questions2 = [{
    //     type: 'input',
    //     name: 'arg2',
    //     message: "Input tag message (-m):",
    // }]

    inquirer.prompt(questions1).then(answers => {
        arg1var = (`${answers['arg1']}`);
        arg2var = (`${answers['arg2']}`);
        
        var spinner = new Spinner('executing the git commands');
        spinner.setSpinnerString('|/-\\');
        spinner.start();

        child = exec('git tag -a ' +  arg1var + ' -m "' + arg2var +'"',
        { maxBuffer: 1024 * 2048},
        function (error, stdout, stderr) {
            console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
               console.log('stderr: ' + stderr);
            }
            if (error !== null) {
               console.log('exec error: ' + error);
            }
            spinner.stop();
        });
    })
}

var TaggingCreateLightweightTags = function () 
{
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

        child = exec('git tag ' + arg1var,
        { maxBuffer: 1024 * 2048},
        function (error, stdout, stderr) {
            console.log(stdout);
            if (testEmpty(stderr) !== 'empty-yes') {
               console.log('stderr: ' + stderr);
            }
            if (error !== null) {
               console.log('exec error: ' + error);
            }
            spinner.stop();
        });
    })
}

var SETTINGSEnableordisablestartupdatafields = function () 
{

    var AppVersionVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('AppVersion','./libEasyGit/StartupScreen/easyGitConfig.ini');
    var gitBranchesVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitBranches','./libEasyGit/StartupScreen/easyGitConfig.ini');
    var gitStatusVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini');
    var localReposVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('localRepos','./libEasyGit/StartupScreen/easyGitConfig.ini');

    if(AppVersionVariable === "'Yes'"){
        AppVersionVariable = 'true';
    }
    if(AppVersionVariable === "'No'"){
        AppVersionVariable = 'false';
    }
    if(gitBranchesVariable === "'Yes'"){
        gitBranchesVariable = 'true';
    }
    if(gitBranchesVariable === "'No'"){
        gitBranchesVariable = 'false';
    }
    if(gitStatusVariable === "'Yes'"){
        gitStatusVariable = 'true';
    }
    if(gitStatusVariable === "'No'"){
        gitStatusVariable = 'false';
    }
    if(localReposVariable === "'Yes'"){
        localReposVariable = 'true';
    }
    if(localReposVariable === "'No'"){
        localReposVariable = 'false';
    }

    // console.log(AppVersionVariable);
    // console.log(gitBranchesVariable);
    // console.log(gitStatusVariable);

    var result1 = "";
    inquirer.prompt([{
        type: 'checkbox',
        message: 'Select command line options',
        name: 'options',
        pageSize: '100',
        choices: [
        new inquirer.Separator('Choose which parts of the startup screen to show (use SPACE to check and unckeck): '),
            {
                name: 'AppVersion',
                checked: eval(AppVersionVariable)
            },
            {
                name: 'gitBranches',
                checked: eval(gitBranchesVariable)
            },
            {
                name: 'gitStatus',
                checked: eval(gitStatusVariable)
            },        
            {
                name: 'localRepos',
                checked: eval(localReposVariable)
            },   
        ],
      }
    ])
    .then(answers => {
        console.log(answers.options);

        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'AppVersion','./libEasyGit/StartupScreen/easyGitConfig.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'gitBranches','./libEasyGit/StartupScreen/easyGitConfig.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'localRepos','./libEasyGit/StartupScreen/easyGitConfig.ini')
        
        answers.options.forEach(function(entry) {
            functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'Yes'",entry,'./libEasyGit/StartupScreen/easyGitConfig.ini')
        });
      
        });

}

var SETTINGSEnableordisableStatusVisualisationTypes = function () 
{
    
    var gitStatusTypeSimpleFilesTrackingVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatusTypeSimpleFilesTracking','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini');
    var gitStatusTypeOnelineGraphDecorateColorShortstatVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatusTypeOnelineGraphDecorateColorShortstat','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini');
    var gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitLogAbbreviatedCommitsInAshortstatOneLineGraph','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini');
    var ShowCommitsPerDayInANiceFormattedWayVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('ShowCommitsPerDayInANiceFormattedWay','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini');
    

    if(gitStatusTypeSimpleFilesTrackingVariable === "'Yes'"){
        gitStatusTypeSimpleFilesTrackingVariable = 'true';
    }
    if(gitStatusTypeSimpleFilesTrackingVariable === "'No'"){
        gitStatusTypeSimpleFilesTrackingVariable = 'false';
    }

    if(gitStatusTypeOnelineGraphDecorateColorShortstatVariable === "'Yes'"){
        gitStatusTypeOnelineGraphDecorateColorShortstatVariable = 'true';
    }
    if(gitStatusTypeOnelineGraphDecorateColorShortstatVariable === "'No'"){
        gitStatusTypeOnelineGraphDecorateColorShortstatVariable = 'false';
    }

    if(gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable === "'Yes'"){
        gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable = 'true';
    }
    if(gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable === "'No'"){
        gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable = 'false';
    }

    if(ShowCommitsPerDayInANiceFormattedWayVariable === "'Yes'"){
        ShowCommitsPerDayInANiceFormattedWayVariable = 'true';
    }
    if(ShowCommitsPerDayInANiceFormattedWayVariable === "'No'"){
        ShowCommitsPerDayInANiceFormattedWayVariable = 'false';
    }

    inquirer.prompt([{
        type: 'checkbox',
        message: 'Select command line options',
        name: 'options',
        pageSize: '100',
        choices: [
        new inquirer.Separator('Choose which status types to be shown: '),
            {
                name: 'gitStatusTypeSimpleFilesTracking',
                checked: eval(gitStatusTypeSimpleFilesTrackingVariable)
            },
            {
                name: 'gitStatusTypeOnelineGraphDecorateColorShortstat',
                checked: eval(gitStatusTypeOnelineGraphDecorateColorShortstatVariable)
            },
            {
                name: 'gitLogAbbreviatedCommitsInAshortstatOneLineGraph',
                checked: eval(gitLogAbbreviatedCommitsInAshortstatOneLineGraphVariable)
            },
            {
                name: 'ShowCommitsPerDayInANiceFormattedWay',
                checked: eval(ShowCommitsPerDayInANiceFormattedWayVariable)
            },
        ],
      }
    ])
    .then(answers => {
        console.log(answers.options);

        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'gitStatusTypeSimpleFilesTracking','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'gitStatusTypeOnelineGraphDecorateColorShortstat','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'gitLogAbbreviatedCommitsInAshortstatOneLineGraph','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini')
        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'ShowCommitsPerDayInANiceFormattedWay','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini')

        answers.options.forEach(function(entry) {
            functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'Yes'",entry,'./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini')
        });

    });
}

var SETTINGSEnableordisableMiscellaneousSettings = function () 
{
    var topNumberOfLinesToDisplayVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('topNumberOfLinesToDisplay','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini');
    var truncationVariable = functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('truncation','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini');

    if(truncationVariable === "'Yes'"){
        truncationVariable = 'true';
    }
    if(truncationVariable === "'No'"){
        truncationVariable = 'false';
    }

    var result1 = "";

    inquirer.prompt([{
        type: 'checkbox',
        message: 'Select command line options',
        name: 'options',
        pageSize: '100',
        choices: [
        new inquirer.Separator('Choose which status types to be shown: '),
            {
                name: 'truncation',
                checked: eval(truncationVariable)
            },
        ],
      }
    ])
    .then(answers => {
        console.log(answers.options);

        functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'No'",'truncation','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini')

        answers.options.forEach(function(entry) {
            functionsForReadingAndWritingToIniConfigFiles.WriteToFile("'Yes'",entry,'./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini')
        });

        inquirer.prompt([{
            type: 'number',
            message: 'Choose maximum number of lines displayed: ',
            name: 'maxNumberOfLines',
            pageSize: '100'
          }
        ])
        .then(answers => {
            var answersString2 = answers.maxNumberOfLines;
            console.log(answersString2);

            functionsForReadingAndWritingToIniConfigFiles.WriteToFile(answersString2,'topNumberOfLinesToDisplay','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini')
            
            }); 
        });
}

function splitString(str) {
    var middle = Math.ceil(str.length / 2);
    var s1 = str.slice(0, middle);
    return s1;
    };

// function validURL(str) {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//         '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//         '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//         '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//     return !!pattern.test(str);
//     }

function validURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
}

module.exports = {
    limitStringLinesCount:limitStringLinesCount, 
    getSizeOfStringLines:getSizeOfStringLines,
    testEmpty: testEmpty,
    MakegitURLtoNormalURL: MakegitURLtoNormalURL,
    MakegitURLtoNormalURL2: MakegitURLtoNormalURL2,
    is_empty: is_empty,
    CleanString: CleanString,
    uniq: uniq,
    validURL:validURL,
    getUserHome: getUserHome,
    gitCloneFromUrlRetryOnFailure: gitCloneFromUrlRetryOnFailure,
    spawnProcess: spawnProcess,
    spawnWindowsProcess: spawnWindowsProcess,
    spawnLinuxProcess: spawnLinuxProcess,
    runCmdHandler: runCmdHandler,
    gitPull_ExternalCall: gitPull_ExternalCall,
    gitPush_ExternalCall: gitPush_ExternalCall,
    MakeTerminalCallFromMenuName: MakeTerminalCallFromMenuName,
    GetListOfRepos: GetListOfRepos,
    TestFunctionForSimplegit: TestFunctionForSimplegit,
    OpenLocalRepo: OpenLocalRepo,
    RegisterRepo: RegisterRepo,
    MakeNewBranches: MakeNewBranches,
    SwitchBranches: SwitchBranches,
    RemoveBranch: RemoveBranch,
    MergeBranches: MergeBranches,
    REVERTHeadAndLastCommit: REVERTHeadAndLastCommit,
    REVERTHeadAndLastCommitSoft: REVERTHeadAndLastCommitSoft,
    REVERTHeadAndLastCommitHard: REVERTHeadAndLastCommitHard,
    TaggingShow: TaggingShow,
    TaggingCreateAnnotatedTags: TaggingCreateAnnotatedTags,
    TaggingCreateLightweightTags: TaggingCreateLightweightTags,
    TaggingDeleteTags: TaggingDeleteTags,
    Removeremotebranch: Removeremotebranch,
    SETTINGSEnableordisablestartupdatafields: SETTINGSEnableordisablestartupdatafields,
    SETTINGSEnableordisableStatusVisualisationTypes: SETTINGSEnableordisableStatusVisualisationTypes,
    SETTINGSEnableordisableMiscellaneousSettings: SETTINGSEnableordisableMiscellaneousSettings,
    splitString:splitString
  }

