const inquirer = require('inquirer');
var fs = require('fs');
var exec = require('child_process').exec, child;
const prompts = require('prompts');
const { execSync } = require('child_process');
const chalk = require('chalk');

var Spinner = require('cli-spinner').Spinner;

var spawn = require('child_process').spawn;

var clear = require('clear');
clear();

// var cmd=require('node-cmd');

console.log(chalk.yellow("Version: 1.1.2"))

gitStatusOnStartUp();

function gitStatusOnStartUp()
{
    
    child = exec('git status',
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log(chalk.blue('\n'));
        
        try {
            
            stdout = stdout.replace('Changes not staged for commit:','');
            stdout = stdout.replace('(use "git add/rm <file>..." to update what will be committed)','');
            stdout = stdout.replace('(use "git restore <file>..." to discard changes in working directory)','');
            stdout = stdout.replace('(use "git add <file>..." to update what will be committed)','');
            stdout = stdout.replace('On branch master','');
            stdout = stdout.replace("Your branch is up to date with 'origin/master'.",'');
            stdout = stdout.replace('(use "git add <file>..." to include in what will be committed)','');
            stdout = stdout.replace('no changes added to commit (use "git add" and/or "git commit -a")','');

            const strCopy = stdout.split('\n\n'); 
            // console.log(stdout); 
            // console.log(strCopy); 

            var strCopy1 = strCopy[1].split('\n');

            // var strCopy1 = strCopy[1].trim();

            var lenghtOfModifiedOrRemovedFiles = strCopy1.length;
            var strCopy2 = strCopy[3].split('\n');
            
            // var strCopy2 = strCopy[2].trim();

            // console.log(strCopy1); 
            // console.log(strCopy2); 
        

            if(lenghtOfModifiedOrRemovedFiles > 0)
            {
                console.log(chalk.yellow('Number of changed or modified files: ' + lenghtOfModifiedOrRemovedFiles));
                // console.log('\n');
            }
            if(lenghtOfModifiedOrRemovedFiles == 0)
            {
                console.log(chalk.green('Number of changed or modified files: ' + lenghtOfModifiedOrRemovedFiles));
                // console.log('\n');
            }
            
            strCopy.forEach(function(entry) {

                entry = entry.trim();
                if(entry.includes('modified'))
                {
                    console.log(chalk.rgb(0, 124, 255)(entry.replace(/modified:/g,'m: ')));
                }

            });
            strCopy.forEach(function(entry) {

                entry = entry.trim();
                if(entry.includes('deleted'))
                {
                    console.log(chalk.rgb(123, 45, 67)(entry.replace(/deleted:/g,'d: ')));
                }
                
            });
            strCopy.forEach(function(entry) {

                entry = entry.trim();
                if(!entry.includes('modified') && !entry.includes('deleted') && entry!== null && entry!=="" && entry!== " " && entry!== "  ")
                {
                    console.log(chalk.rgb(123, 255, 67)(entry));
                }

                
            });

            strCopy2.forEach(function(entry) {

                entry = entry.trim();
                if(entry!=="" && entry!== " " && entry!== "  " && entry!== null){
                    console.log(chalk.gray("U: " + entry));
                }
            });
            
            if (stderr !== "") {
            console.log(chalk.yellow('stderr: ' + stderr));

            }
            if (error !== null) {
                console.log(chalk.red('exec error: ' + error));

            }

        }
        catch (e) {
            if(!stdout.includes("nothing to commit, working tree clean")){
            console.log(e);
            }
            if (e.name == 'TypeError') {
                console.log(chalk.blue(stdout));
            }
        }

        // In order to have statusbar in the beginning you have to have the main function called here.
        main();

    });

}

function main(){

inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            pageSize: '16',
            choices: ['Make a commit and push', 'git push', 'git pull origin master', 'Visualise git', 'Go to origin', 'git-clone from url'
                , 'git-clone from list of repos'
                , 'Get list of repos', 'Show infographic', 'Show ohshitgit.com', 'git config core.autocrlf true ( for Windows )'
                , 'Register repo', 'Open local repo', 'git status', 'Test: use of simple-git functions'],
        },
    ])
    .then(answers => {
        if (answers.option == "Make a commit and push") {
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

                    // req.on('response', function(res){
                    //     var len = parseInt(res.headers['content-length'], 10);
                      
                    //     console.log();
                    //     var bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
                    //       complete: '=',
                    //       incomplete: ' ',
                    //       width: 20,
                    //       total: len
                    //     });
                      
                    //     res.on('data', function (chunk) {
                    //       bar.tick(chunk.length);
                    //     });
                      
                    //     res.on('end', function () {
                    //       console.log('\n');
                    //     });
                    //   });
                      
                    //   req.end();
                    
                    var spinner = new Spinner('executing the git commands');
                    spinner.setSpinnerString('|/-\\');
                    spinner.start();

                    // req.on('response', function(res){

                    child = exec('git add . && git add -A  && git commit -m"' + arg1var + '" && start cmd /k git push',
                    { maxBuffer: 1024 * 2048},
                    function (error, stdout, stderr) {



                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);

                            if (String(error).includes("Error: Command failed:"))
                            {
                                gitPush_ExternalCall()
                                
                            }

                        }
                        if (String(stderr).includes("fatal: could not read Password for"))
                        {
                            gitPush_ExternalCall()
                            
                        }
                        if (String(stderr).includes("Your branch is ahead of"))
                        {
                            gitPush_ExternalCall()
                            
                        }
                        if (String(stderr).includes("failed to push some refs to"))
                        {
                            child = exec('git add --ignore-errors . && git commit -m "initial commit" && git push -u origin master',
                            { maxBuffer: 1024 * 2048},
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                
                            });
                        }
                        
                        spinner.stop();

                    });
                   

                    // });
                    // req.end();
                        
                    // }
                    // });
                        
                    
                    


                })

                
            }
            if (process.argv.length > 2) {
                var ArgumentStringTwo = JSON.stringify(args).slice(6, JSON.stringify(args).length - 2);
                var ArgumentStringThree = ArgumentStringTwo.split("\",\"").join(' ').slice(1, ArgumentStringTwo.split("\",\"").join(' ').length - 1);;
                console.log('ArgumentStringThree: ' + ArgumentStringThree);
                child = exec('git add . && git add -A  && git commit -m"' + ArgumentStringThree + '" && start cmd /k git push',
                    { maxBuffer: 1024 * 1024 },
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);

                        }
                    });
            }
        }
        if (answers.option == "git pull origin master") {

                child = exec('git pull origin master',
                    { maxBuffer: 1024 * 1024 },
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);

                        }

                        if (String(stderr).includes("fatal: could not read Password for"))
                        {
                            gitPull_ExternalCall()
                        }
                        if (String(stderr).includes("Your branch is ahead of"))
                        {
                            gitPull_ExternalCall()
                        }
                        if (String(stderr).includes('could not read Username'))
                        {
                            gitPull_ExternalCall()
                        }

                        
                    });
        }
        
        MakeTerminalCallFromMenuName(answers, "Visualise git", 'git log --graph');
        if (answers.option == "Go to origin") {
            child = exec('git config --get remote.origin.url',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    var opsys = process.platform;
                    if (opsys == "darwin") {
                        opsys = "MacOS";
                    } else if (opsys == "win32" || opsys == "win64") {
                        opsys = "Windows";
                        var readableURL = MakegitURLtoNormalURL(stdout);
                        child = exec('start ' + readableURL,
                            { maxBuffer: 1024 * 1024 },
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });
                    } else if (opsys == "linux") {
                        var readableURL = MakegitURLtoNormalURL(stdout);
                        child = exec('firefox ' + readableURL,
                            { maxBuffer: 1024 * 1024 },
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });
                    }
                    console.log(opsys) // I don't know what linux is.
                });
        }
        GetListOfRepos(answers, 'Get list of repos', "EndHerePseudo-BooleanYes");
        if (answers.option == "Show infographic") {
            var opsys = process.platform;
            if (opsys == "darwin") {
                opsys = "MacOS";
            } else if (opsys == "win32" || opsys == "win64") {
                opsys = "Windows";
                child = exec('start http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf',
                    { maxBuffer: 1024 * 1024 },
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });
            } else if (opsys == "linux") {
                opsys = "Linux";
                child = exec('firefox http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf',
                    { maxBuffer: 1024 * 1024 },
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });
            }
            console.log(opsys) // I don't know what linux is.
        }
        if (answers.option == "Show ohshitgit.com") {
            var opsys = process.platform;
            if (opsys == "darwin") {
                opsys = "MacOS";
            } else if (opsys == "win32" || opsys == "win64") {
                opsys = "Windows";
                child = exec('start https://ohshitgit.com/',
                    { maxBuffer: 1024 * 1024 },
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
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
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });
            }
            console.log(opsys) // I don't know what linux is.
        }
        MakeTerminalCallFromMenuName(answers, "git config core.autocrlf true ( for Windows )", 'git config core.autocrlf true');
        RegisterRepo(answers, 'Register repo');
        OpenLocalRepo(answers, 'Open local repo');
        if (answers.option == "git-clone from url") {
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
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                            console.log('response.url ' + response.url + '.git');
                            
                            // If it fails
                            gitCloneFromUrlRetryOnFailure(response.url)
                        }
                    });

            })();
        }
        if (answers.option == "git-clone from list of repos") {
            GetListOfRepos(answers, 'git-clone from list of repos', "EndHerePseudo-BooleanNo");
        }
        if (answers.option == "git push") {
            gitPush_ExternalCall();   
        }
        if (answers.option == "Test: use of simple-git functions") {
            TestFunctionForSimplegit();   
        }
        if (answers.option == "git status") {
            gitStatus();   
        }
        
    });

}

function spawnProcess(dir, cmd) {
    return (process.platform.toLowerCase().indexOf("win") >= 0) 
      ? spawnWindowsProcess(dir, cmd)
      : spawnLinuxProcess(dir, cmd);
  }
  
  function spawnWindowsProcess(dir, cmd) {
    return spawn("cmd.exe", ["/c", cmd], {cwd: dir});
  }
  
  function spawnLinuxProcess(dir, cmd) {
    var cmdParts = cmd.split(/\s+/);
  
    return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir});
  }
  
  function runCmdHandler(dir, cmd) {
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

function gitPush_ExternalCall(){
    runCmdHandler(".", "start cmd /k git push");
};

function gitPull_ExternalCall(){
    runCmdHandler(".", "start cmd /k git pull origin master");
};

function MakegitURLtoNormalURL(gitURl) {

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

function TestFunctionForSimplegit()
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

function gitStatus()
{

    child = exec('git status',
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log(chalk.blue('stdout: ' + stdout));
        console.log(chalk.yellow('stderr: ' + stderr));
        if (error !== null) {
            console.log(chalk.red('exec error: ' + error));

        }
    });

    
    
}

function TestFunctionForSimplegit()
{

    runCmdHandler(".", "git status");
    
    child = exec('git add . && git add -A  && git commit -m"' + ArgumentStringThree + '" && start cmd /k git push',
    { maxBuffer: 1024 * 1024 },
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);

        }
    });
    
}

function is_empty(x)
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

function MakeTerminalCallFromMenuName(answers, answersOption, TerminalCall) {
    if (answers.option == answersOption) {
        child = exec(TerminalCall,
            { maxBuffer: 1024 * 1024 },
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }
}

function gitCloneFromUrlRetryOnFailure(nameOfRemoteRepo){
    runCmdHandler(".", "start cmd /k git clone " + nameOfRemoteRepo + '.git');
}

function RegisterRepo(answers, answersOption) {
    if (answers.option == answersOption) {

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
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
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
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
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
    }
}

function getUserHome() {
    const os = require('os');
    return os.homedir();
}

function OpenLocalRepo(answers, answersOption) {
    if (answers.option == answersOption) {
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
    }
}

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function uniq(a) {
    var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function GetListOfRepos(answers, answersOption, PseudoBooleanOperationControl) {
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
                                                console.log('stdout: ' + stdout);
                                                console.log('stderr: ' + stderr);
                                                if (error !== null) {
                                                    console.log('exec error: ' + error);

                                                    // If it fails
                                                    gitCloneFromUrlRetryOnFailure(dirString[1])
                                                }
                                            });

                                    }
                                    else if (opsys == "linux") {
                                        child = exec('git clone ' + dirString[1],
                                            { maxBuffer: 1024 * 1024 },
                                            function (error, stdout, stderr) {
                                                console.log('stdout: ' + stdout);
                                                console.log('stderr: ' + stderr);
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

                                        execSyncOutput = CleanString(execSyncOutput.toString());

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
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                gitCloneFromUrlRetryOnFailure(dirStringCleanValue)

                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
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

                                        execSyncOutput = CleanString(execSyncOutput.toString());

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
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                gitCloneFromUrlRetryOnFailure(dirStringCleanValue)

                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {

                                                    child = exec('git clone ' + dirStringCleanValue,
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
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

                                        execSyncOutput = CleanString(execSyncOutput);
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
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);

                                                                // If it fails
                                                                gitCloneFromUrlRetryOnFailure(dirString[1])
                                                            }
                                                        });

                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
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

                                        execSyncOutput = CleanString(execSyncOutput);
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
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
                                                            if (error !== null) {
                                                                console.log('exec error: ' + error);
                                                                
                                                                // If it fails
                                                                gitCloneFromUrlRetryOnFailure(dirString[1])

                                                            }
                                                        });
                                                }
                                                else if (opsys == "linux") {
                                                    child = exec('git clone ' + dirString[1],
                                                        { maxBuffer: 1024 * 1024 },
                                                        function (error, stdout, stderr) {
                                                            console.log('stdout: ' + stdout);
                                                            console.log('stderr: ' + stderr);
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

function CleanString(StringValue) {
    var returnString = StringValue.toString()
        .replace(/\n|\0|\t|\r|\f|\v|\x0d|\x0a|\x0d\x0a|\↵/g, '')
        .replace("\\x00", null)
        .replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
        .replace(/(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g)
        .replace(/([\x7F-\x84]|[\x86-\x9F]|[\uFDD0-\uFDEF]|(?:\uD83F[\uDFFE\uDFFF])|(?:\uD87F[\uDFFE\uDFFF])|(?:\uD8BF[\uDFFE\uDFFF])|(?:\uD8FF[\uDFFE\uDFFF])|(?:\uD93F[\uDFFE\uDFFF])|(?:\uD97F[\uDFFE\uDFFF])|(?:\uD9BF[\uDFFE\uDFFF])|(?:\uD9FF[\uDFFE\uDFFF])|(?:\uDA3F[\uDFFE\uDFFF])|(?:\uDA7F[\uDFFE\uDFFF])|(?:\uDABF[\uDFFE\uDFFF])|(?:\uDAFF[\uDFFE\uDFFF])|(?:\uDB3F[\uDFFE\uDFFF])|(?:\uDB7F[\uDFFE\uDFFF])|(?:\uDBBF[\uDFFE\uDFFF])|(?:\uDBFF[\uDFFE\uDFFF])(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g, '');
    return returnString;
}