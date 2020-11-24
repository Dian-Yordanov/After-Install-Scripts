const inquirer = require('inquirer');
var fs = require('fs');
var exec = require('child_process').exec, child;
const prompts = require('prompts');
const { execSync } = require('child_process');

var figlet = require('figlet');
const chalk = require('chalk');

var Spinner = require('cli-spinner').Spinner;
var spawn = require('child_process').spawn;

const gradient = require('gradient-string');
const CFonts = require('cfonts');
const functions = require('./libEasyGit/functions');

const SYNCMakeacommitandpush = require('./libEasyGit/SYNC-Make-a-commit-and-push');
const SYNCMakeacommit = require('./libEasyGit/SYNCMakeacommit');
const SYNCgitpush = require('./libEasyGit/SYNC-git-push');
const SYNCgitpulloriginmaster = require('./libEasyGit/SYNC-git-pull-origin-master');
const SYNCgitpullrebase = require('./libEasyGit/SYNC-git-pull-rebase');
const SYNCgitpull = require('./libEasyGit/SYNC-git-pull');
const SYNCgitclonefromurl = require('./libEasyGit/SYNC-git-clone-from-url');
const SYNCgitclonefromlistofrepos = require('./libEasyGit/SYNC-git-clone-from-list-of-repos');
const BRANCHINGmakenewbranches = require('./libEasyGit/BRANCHING-make-new-branches');
const BRANCHINGShowbranches = require('./libEasyGit/BRANCHING-Show-branches');
const BRANCHINGSwitchbranches = require('./libEasyGit/BRANCHING-Switch-branches');
const BRANCHINGRemovebranch = require('./libEasyGit/BRANCHING-Remove-branch');
const BRANCHINGMergebranch = require('./libEasyGit/BRANCHING-Merge-branch');
const REVERTHeadAndLastCommitSoft = require('./libEasyGit/REVERTHeadAndLastCommitSoft');
const REVERTHeadAndLastCommitHard = require('./libEasyGit/REVERTHeadAndLastCommitHard');
const REVERTReturnthelastcommit = require('./libEasyGit/REVERTReturnthelastcommit');
const INFOVisualisegit = require('./libEasyGit/INFO-Visualise-git');
const INFOGotoorigin = require('./libEasyGit/INFO-Go-to-origin');
const INFOGetlistofrepos = require('./libEasyGit/INFO-Get-list-of-repos');
const INFOGitlog = require('./libEasyGit/INFO-git-log');
const INFOGitReflog = require('./libEasyGit/INFO-GitReflog');
const INFOGitshow = require('./libEasyGit/INFO-git-show');
const INFOGitdiff = require('./libEasyGit/INFO-git-diff');
const INFOGitStatus = require('./libEasyGit/INFO-git-status');
const TaggingListAllTags = require('./libEasyGit/TaggingListAllTags');
const TaggingShow = require('./libEasyGit/TaggingShow');
const TaggingCreateLightweightTags = require('./libEasyGit/TaggingCreateLightweightTags');
const TaggingCreateAnnotatedTags = require('./libEasyGit/TaggingCreateAnnotatedTags');
const TaggingPusAllhTagsToRemote = require('./libEasyGit/TaggingPusAllhTagsToRemote');
const TaggingDeleteTags = require('./libEasyGit/TaggingDeleteTags');
const MANAGEMENTRegisterrepo = require('./libEasyGit/MANAGEMENT-Register-repo');
const MANAGEMENTOpenlocalrepo = require('./libEasyGit/MANAGEMENT-Open-local-repo');
const UTILITYgitconfigcoreautocrlftrueforWindows = require('./libEasyGit/UTILITY-git-config-core.autocrlf-true-(-for-Windows-)');
const UTILITYTestuseofsimplegitfunctionss = require('./libEasyGit/UTILITY-Test-use-of-simple-git-functionss');
const HELPShowinfographic = require('./libEasyGit/HELP-Show-infographic');
const HELPShowohshitgit = require('./libEasyGit/HELP-Show-ohshitgit.com');
const SETTINGSEnableordisablestartupdatafields = require('./libEasyGit/SETTINGS-Enable-or-disable-startup-data-fields');
const SETTINGSEnableordisableStatusVisualisationTypes = require('./libEasyGit/SETTINGS-Enable-or-disable-Status-Visualisation-Types');
const SETTINGSEnableordisableMiscellaneousSettings = require('./libEasyGit/SETTINGS-MiscellaneousSettings');
const BRANCHINGRemoveremotebranch = require('./libEasyGit/BRANCHING-Remove-remote-branch');

// var clear = require('clear');
// clear();

// const clear = require('console-clear');
 
// clear(true);
//=> allow scrollback
 
// clear();
//=> no scrollback, if supported

var clearTerminal = require("clear-terminal")

clearTerminal()

const functionsForReadingAndWritingToIniConfigFiles = require('./libEasyGit/StartupScreen/functionsForReadingAndWritingToIniConfigFiles');
var topNumberOfLinesToDisplay = 15;
var truncation = "'Yes'";

topNumberOfLinesToDisplay=functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('topNumberOfLinesToDisplay','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini');
truncation=functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('truncation','./libEasyGit/StartupScreen/easyGitMiscellaneousSettings.ini');
topNumberOfLinesToDisplay = parseInt(topNumberOfLinesToDisplay);

let chain = Promise.resolve(); 
chain = chain.then(() => AppVersion())
chain = chain.then(() => gitBranch())
chain = chain.then(() => localRepos())
chain = chain.then(() => gitStatusTypeSimpleFilesTrackingCallingFunction())
chain = chain.then(() => gitStatusTypeOnelineGraphDecorateColorShortstatCallingFunction())
chain = chain.then(() => gitLogAbbreviatedCommitsInAshortstatOneLineGraph())
chain = chain.then(() => ShowCommitsPerDayInANiceFormattedWay())
chain = chain.then(() => main())

function AppVersion(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('AppVersion','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            // console.log(chalk.black.bgBlue(" App Version - 1.4.1                                                                                                                                                           "))
            console.log(gradient.summer(' App Version - 1.4.1                                                                                                                                                           '));
        }
        resolve();
    });
}

function gitBranch(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitBranches','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            console.log(chalk.black.bgGreen(' git branches -                                                                                                                                                                \n'));
            child = exec(' git branch -a --color',
                    { maxBuffer: 512 * 512 },
                    function (error, stdout, stderr) {
                        console.log(stdout);
                        resolve();
                }
            );
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitBranches','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function localRepos(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('localRepos','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            // if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('localRepos','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini') === "'Yes'"){
            
            console.log(chalk.black.bgCyan(' List of local repos on this PC, registered in easyGit                                                                                                                         \n'));

            var opsys = process.platform;
            if (opsys == "darwin") {
                opsys = "MacOS";
            }
            else if (opsys == "win32" || opsys == "win64") {
                WinUserName = functions.getUserHome();
                var dir = WinUserName + '/Documents/GitRepoList';
    
                var FileDir = dir + "/List.txt";
                if (fs.existsSync(FileDir)) {
                    FileText = fs.readFileSync(dir + "/List.txt");
                    var fileSet = functions.uniq(FileText.toString().split(/\r?\n/).clean(''));

                    console.log(chalk.blue("Repository's local directory") + "                                        |" + chalk.cyan(" Remote hosting website") + "                                    |"+chalk.green(" Project name")                        );

                    for (var i=0;i<fileSet.length;i++){
                        console.log(chalk.blue(fileSet[i].replace(/,/g,'\n').split(' ')[0].padEnd(70, ' ')) 
                        + chalk.cyan(fileSet[i].replace(/,/g,'\n').split(' ')[1].replace('https://','').replace('https:////','').replace('https////','').replace('https///','').split('/')[0].padEnd(60, ' ')) 
                        + chalk.green(fileSet[i].replace(/,/g,'\n').split(' ')[1].replace('https://','').replace('https:////','').replace('https////','').replace('https///','').split('/')[fileSet[i].replace(/,/g,'\n').split(' ').length]));
                    }
    
                    console.log("");
                    resolve();

                }
            }
            else if (opsys == "linux") {
                LinuxUserName = functions.getUserHome();
                var dir = LinuxUserName + '/GitRepoList';
    
                var FileDir = dir + "/List.txt";
                if (fs.existsSync(FileDir)) {
                    FileText = fs.readFileSync(dir + "/List.txt");
                    var fileSet = functions.uniq(FileText.toString().split(/\r?\n/).clean(''));

                    console.log(chalk.blue("Repository's local directory") + "                                        |" + chalk.cyan(" Remote hosting website") + "                                     |"+chalk.green(" Project name")                        );

                    for (var i=0;i<fileSet.length;i++){
                        console.log(chalk.blue(fileSet[i].replace(/,/g,'\n').split(' ')[0].padEnd(70, ' ')) 
                        + chalk.cyan(fileSet[i].replace(/,/g,'\n').split(' ')[1].replace('https://','').replace('https:////','').replace('https////','').replace('https///','').split('/')[0].padEnd(60, ' ')) 
                        + chalk.green(fileSet[i].replace(/,/g,'\n').split(' ')[1].replace('https://','').replace('https:////','').replace('https////','').replace('https///','').split('/')[fileSet[i].replace(/,/g,'\n').split(' ').length]));
                    }
    
                    console.log("");
                    resolve();

                }
            }
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('localRepos','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function gitStatusTypeSimpleFilesTrackingCallingFunction(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatusTypeSimpleFilesTracking','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini') === "'Yes'"){
                child = exec('git status',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    // console.log(chalk.blue('\n'));

                    console.log(chalk.black.bgMagenta(' git status simple file tracking type -                                                                                                                                        \n'));
                    try {
                        
                        stdout = stdout.replace('Changes not staged for commit:','');
                        stdout = stdout.replace('(use "git add/rm <file>..." to update what will be committed)','');
                        stdout = stdout.replace('(use "git restore <file>..." to discard changes in working directory)','');
                        stdout = stdout.replace('(use "git add <file>..." to update what will be committed)','');
                        stdout = stdout.replace('On branch master','');
                        stdout = stdout.replace("Your branch is up to date with 'origin/master'.",'');
                        stdout = stdout.replace('(use "git add <file>..." to include in what will be committed)','');
                        stdout = stdout.replace('no changes added to commit (use "git add" and/or "git commit -a")','');

                        // console.log(stdout);


                        const strCopy = stdout.split('\n\n'); 
                        var strCopy1 = strCopy[1].split('\n');
                        

                        var filtered = strCopy.filter(function (el) {
                            return el != null && el != "" && el != "\n";
                          });

                        var lenghtOfModifiedOrRemovedFiles = filtered.length;

                        // console.log(filtered);
                        // console.log("cc " + strCopy[2]);
                        // if (lenghtOfModifiedOrRemovedFiles<50){

                            // console.log("cc1 " + strCopy[3]);
                        // console.log("cc1 " + strCopy[2].length);
                        // console.log("cc3 " + lenghtOfModifiedOrRemovedFiles);
                        // console.log("cc2 " + strCopy[3].length);
                        
                        if (lenghtOfModifiedOrRemovedFiles<50 && strCopy[2].length < 1000 && strCopy[3] !== undefined){
                            try {
                                if(strCopy[3].split('\n')!=null){
                                    var strCopy2 = strCopy[3].split('\n');

                                    // console.log("sssssssssssss");
                                    // console.log(strCopy.length);
                                    // console.log(strCopy2);

                                    // console.log(strCopy.toString().replace(/\t/g,' '));
                                    // console.log(strCopy[2].split('\n').toString());

                                    if(lenghtOfModifiedOrRemovedFiles > 0)
                                    {
                                        console.log(chalk.yellow('Number of changed or modified files: ' + lenghtOfModifiedOrRemovedFiles));
                                    }
                                    if(lenghtOfModifiedOrRemovedFiles == 0)
                                    {
                                        console.log(chalk.green('Number of changed or modified files: ' + lenghtOfModifiedOrRemovedFiles));
                                    }

                                    for (var i=0;i<=strCopy.length;i++){

                                        var stringArray = strCopy;

                                        // console.log(strCopy.length);
                                        // try{
                                        //     console.log(strCopy[i]);
                                        // }
                                        // catch(e){
                                        //     console.log(e);
                                        // }

                                        //TODO
                                        // console.log(i);
                                        // console.log(strCopy[i]);

                                        if(strCopy[i] !== undefined){
                                            entry = strCopy[i].trim();
                                        }
                                        else{
                                            entry = strCopy[i-1].trim();
                                        }
                                        

                                        if(i === 0){
                                            console.log(chalk.rgb(0, 124, 255)("Modified files:"));
                                        }
                                        if(entry.includes('modified') && i === 0)
                                        {
                                            console.log(chalk.rgb(0, 124, 255)(entry.replace(/\t/g,'').replace(/modified:/g,'\nm: ')));
                                        }
                                        if(entry.includes('modified') && i > 0)
                                        {
                                            console.log(chalk.rgb(0, 124, 255)(entry.replace(/\t/g,'').replace(/modified:/g,'m: ')));
                                        }
                                    }

                                    for (var i=0;i<=strCopy.length;i++){

                                        if(strCopy[i] !== undefined){
                                            entry = strCopy[i].trim();
                                        }
                                        else{
                                            entry = strCopy[i-1].trim();
                                        }

                                        if(i === 0){
                                            console.log(chalk.rgb(123, 45, 67)("Deleted files:"));
                                        }
                                        if(entry.includes('deleted') && i === 0)
                                        {
                                            console.log(chalk.rgb(123, 45, 67)(entry.replace(/\t/g,'').replace(/deleted:/g,'\nd: ')));
                                        }
                                        if(entry.includes('deleted') && i > 0)
                                        {
                                            console.log(chalk.rgb(123, 45, 67)(entry.replace(/\t/g,'').replace(/deleted:/g,'d: ')));
                                        }
                                    }

                                    for (var i=0;i<=strCopy.length;i++){

                                        if(strCopy[i] !== undefined){
                                            entry = strCopy[i].trim();
                                        }
                                        else{
                                            entry = strCopy[i-1].trim();
                                        }

                                        if(!entry.includes('modified') && !entry.includes('deleted') && entry!== null && entry!=="" && entry!== " " && entry!== "  "  && i === 0)
                                        {
                                            console.log(chalk.rgb(123, 255, 67)(entry));
                                        }
                                        if(!entry.includes('modified') && !entry.includes('deleted') && entry!== null && entry!=="" && entry!== " " && entry!== "  "  && i > 0)
                                        {
                                            console.log(chalk.rgb(123, 255, 67)(entry));
                                        }
                                    }

                                    if(strCopy[2].toString().includes('Untracked files:')){

                                        var stringArray = strCopy[2].split('\n');

                                        for (var i=0;i<stringArray.length;i++){
                                            entry = stringArray[i].trim();

                                            if(i === 0){
                                                console.log(chalk.gray("Untracked files:"));
                                            }

                                            if(entry!=="" && entry!== " " && entry!== "  " && entry!== null && !entry.includes("Untracked files:")){
                                                console.log(chalk.gray("U: " + entry));
                                            }
                                        }
                                    }
                                    else if(strCopy2.includes('Untracked files:')){
                                        var stringArray = strCopy[2].split('\n');

                                        for (var i=0;i<stringArray.length;i++){
                                            entry = stringArray[i].trim();

                                            if(i === 0){
                                                console.log(chalk.gray("Untracked files:"));
                                            }

                                            if(entry!=="" && entry!== " " && entry!== "  " && entry!== null && !entry.includes("Untracked files:")){
                                                console.log(chalk.gray("U: " + entry));
                                            }
                                        }
                                    }

                                    if (stderr !== "") {
                                        console.log(chalk.yellow('stderr: ' + stderr));

                                    }
                                    if (error !== null) {
                                        console.log(chalk.red('exec error: ' + error));

                                    }

                                    console.log(chalk.blue(''));
                                    resolve();

                                }
                            }
                            catch (e) {
                                    console.log("x2 " + e.toString());
                                    // console.log(e);

                                    if(e.toString().includes('TypeError')){
                                        console.log(e);
                                    }

                                    // console.log("sssssssssssss");
                                    // console.log(strCopy1.length);

                                    if (strCopy1.includes("nothing to commit, working tree clean")){
                                        figlet('Everything is up to date !!!', function(err, data) {
                        
                                                
                                            if(stdout.includes("nothing to commit, working tree clean")){
                                                if (err) {
                                                    console.log('Something went wrong...');
                                                    console.dir(err);
                                
                                                    return;
                                                }
                                                console.log(data)
                                            }
                        
                                                console.log("");
                                                resolve();
        
                                        });
                                    }
                                    else if(strCopy1 != null){
                                        strCopy1 = strCopy1.filter(function(str) {
                                            return /\S/.test(str);
                                        });
                            
                                        // console.log( "strCopy2");
                                        // console.log( strCopy1);

                                        if(strCopy1.length>topNumberOfLinesToDisplay*3 && truncation === "'Yes'"){

                                            for (var i=0;i<topNumberOfLinesToDisplay*2;i++){
                                                entry = strCopy1[i].trim();
                                                if(entry.includes('modified'))
                                                {
                                                    console.log(chalk.rgb(0, 124, 255)(entry.replace(/modified:/g,'m: ')));
                                                }
                                            }
                                            for (var i=0;i<topNumberOfLinesToDisplay*2;i++){
                                                entry = strCopy1[i].trim();
                                                if(entry.includes('deleted'))
                                                {
                                                    console.log(chalk.rgb(123, 45, 67)(entry.replace(/deleted:/g,'d: ')));
                                                }
                                            }
                                            for (var i=0;i<topNumberOfLinesToDisplay*2;i++){
                                                entry = strCopy1[i].trim();
                                                if(!entry.includes('modified') && !entry.includes('deleted') && entry!== null && entry!=="" && entry!== " " && entry!== "  ")
                                                {
                                                    console.log(chalk.rgb(123, 255, 67)(entry));
                                                }
                                            }

                                            console.log("");
                                            console.log("Too many changes to display: " + strCopy1.length + " The number is bigger than " + 2*topNumberOfLinesToDisplay + " . Instead of displaying all changes normally, changes are going to be shown in a truncated way. ");
                                        
                                        }
                                        else{

                                            strCopy1.forEach(function(entry) {

                                                entry = entry.trim();
                                                if(entry.includes('modified'))
                                                {
                                                    console.log(chalk.rgb(0, 124, 255)(entry.replace(/modified:/g,'m: ')));
                                                }

                                            });
                                            strCopy1.forEach(function(entry) {

                                                entry = entry.trim();
                                                if(entry.includes('deleted'))
                                                {
                                                    console.log(chalk.rgb(123, 45, 67)(entry.replace(/deleted:/g,'d: ')));
                                                }
                                                
                                            });
                                            strCopy1.forEach(function(entry) {

                                                entry = entry.trim();
                                                if(!entry.includes('modified') && !entry.includes('deleted') && entry!== null && entry!=="" && entry!== " " && entry!== "  ")
                                                {
                                                    console.log(chalk.rgb(123, 255, 67)(entry));
                                                }
                                            });

                                        }

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
                                    
                                }
                            }
                       else{
                            console.log("There are too many changes files to display.");
                            resolve();
                            console.log("");
                       }

                    }
                    catch (e) {
                        // console.log("x1 " + e.toString());
                        if (!e.toString().includes("TypeError:")) {
                            if(!stdout.includes("nothing to commit, working tree clean")){
                                console.log(e);
                    
                                    figlet('Everything is up to date !!!', function(err, data) {
                    
                                            
                                        if(stdout.includes("nothing to commit, working tree clean")){
                                            if (err) {
                                                console.log('Something went wrong...');
                                                console.dir(err);
                            
                                                return;
                                            }
                                            console.log(data)
                                        }
                    
                    
                                        // if (BooleanTrackingIfMainHasBeenCalled === false){
                                            // In order to have statusbar in the beginning you have to have the main function called here.
                                            
                                            console.log(chalk.blue(''));
                                            // main();
                                            // callback();
                                            // callback(null, 1);
                                            resolve();
                                            // BooleanTrackingIfMainHasBeenCalled = true;
                                        // }
                    
                                    });
                                    
                                }
                                else{
                                    // if (BooleanTrackingIfMainHasBeenCalled === false){
                                        // In order to have statusbar in the beginning you have to have the main function called here.
                                        
                                        console.log(chalk.blue(''));
                                        // main();
                                        // callback();
                                        resolve();
                                        // BooleanTrackingIfMainHasBeenCalled = true;
                                    // }
                                }
                        }
                        else{
                            figlet('Everything is up to date !!!', function(err, data) {
                    
                                            
                                if(stdout.includes("nothing to commit, working tree clean")){
                                    if (err) {
                                        console.log('Something went wrong...');
                                        console.dir(err);
                                        resolve();
                                        return;
                                    }
                                    console.log(data)
                                }

                                console.log("");
                                resolve();

                            });
                                
                        }
                        
                    }

                });
            }
            else{
                resolve();
            }
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function gitStatusTypeOnelineGraphDecorateColorShortstatCallingFunction(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatusTypeOnelineGraphDecorateColorShortstat','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini') === "'Yes'"){
                child = exec('git log --oneline --all --graph --color --shortstat --name-only -5',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {

                    console.log(chalk.black.bgMagenta(' git log, one line, graph, decorate, color, shortstat, only 5 -                                                                                                                \n'));

                    // console.log(functions.getSizeOfStringLines(stdout));
                    // console.log(topNumberOfLinesToDisplay);

                    if(functions.getSizeOfStringLines(stdout) > topNumberOfLinesToDisplay  && truncation === "'Yes'"){
                        console.log(functions.limitStringLinesCount(stdout, topNumberOfLinesToDisplay));
                        console.log("There are " + functions.getSizeOfStringLines(stdout) + " lines of changes and so many cannot be displayed correctly. Because of that only the top " + topNumberOfLinesToDisplay + " are lines of output are displayed.");
                        console.log("");
                    }
                    else{
                        console.log(stdout);
                    }

                    resolve();
                    
                });
            }
            else{
                resolve();
            }
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function gitLogAbbreviatedCommitsInAshortstatOneLineGraph(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitLogAbbreviatedCommitsInAshortstatOneLineGraph','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini') === "'Yes'"){
                child = exec('git log --oneline --abbrev-commit --all --graph --decorate --shortstat --max-count=5',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {

                    console.log(chalk.black.bgMagenta(' git log, abbreviated commits in a shortstat one line graph -                                                                                                                  \n'));

                    for ( var i=0; i<stdout.split("\n").length-1;i++){
                        if(stdout.split("\n")[i].includes("*")){
                            
                            if(i%2 === 0 && i !== 0) {
                                var stringToPrintDivisibleBy2 = "";
                                stringToPrintDivisibleBy2 = stdout.split("\n")[i].substring(0,10) + chalk.magenta(stdout.split("\n")[i].substring(10,stdout.split("\n")[i].length));
                                stringToPrintDivisibleBy2 = chalk.yellow(stringToPrintDivisibleBy2.substring(0,1)) + stringToPrintDivisibleBy2.substring(1,stringToPrintDivisibleBy2.length);
                                stringToPrintDivisibleBy2 = stringToPrintDivisibleBy2.substring(0,6) + chalk.cyan(stringToPrintDivisibleBy2.substring(6,20)) + stringToPrintDivisibleBy2.substring(20,stringToPrintDivisibleBy2.length);

                                console.log(stringToPrintDivisibleBy2);
                            }
                            if(i === 0){

                                var stringToPrintNotDivisibleBy2 = "";

                                if(stdout.split("\n")[i].toString().match(/[*] \w{7} /g,"") === null){
                                    stringToPrintNotDivisibleBy2 = stdout.split("\n")[i].toString().match(/[*][ ].{8}[ ][(]([^)]+)[)]/g,"").toString();
                                    stringToPrintNotDivisibleBy3 = chalk.magenta(stdout.split("\n")[i].toString().replace(/[*][ ].{8}[ ][(]([^)]+)[)]/g,""));

                                    stringToPrintNotDivisibleBy2 = chalk.yellow(stringToPrintNotDivisibleBy2.substring(0,1)) + stringToPrintNotDivisibleBy2.substring(1,stringToPrintNotDivisibleBy2.length);
                                    stringToPrintNotDivisibleBy2 = stringToPrintNotDivisibleBy2.substring(0,6) + chalk.cyan(stringToPrintNotDivisibleBy2.substring(6,20)) 
                                    + gradient.rainbow(stringToPrintNotDivisibleBy2.substring(20,stringToPrintNotDivisibleBy2.length));

                                    stringToPrintNotDivisibleBy2 = stringToPrintNotDivisibleBy2 + stringToPrintNotDivisibleBy3;

                                }
                                else{
                                    stringToPrintNotDivisibleBy2 = stdout.split("\n")[i].toString().match(/[*] \w{7} /g,"")[0] 
                                    + gradient.rainbow(stdout.split("\n")[i].toString().match(/\(([^)]+)\)/g,"")[0]) 
                                    + chalk.magenta(stdout.split("\n")[i].toString().replace(/[*] \w{7} \(([^)]+)\)/g,""));

                                    stringToPrintNotDivisibleBy2 = chalk.yellow(stringToPrintNotDivisibleBy2.substring(0,1)) + stringToPrintNotDivisibleBy2.substring(1,stringToPrintNotDivisibleBy2.length);
                                    stringToPrintNotDivisibleBy2 = stringToPrintNotDivisibleBy2.substring(0,6) + chalk.cyan(stringToPrintNotDivisibleBy2.substring(6,20)) 
                                    + stringToPrintNotDivisibleBy2.substring(20,stringToPrintNotDivisibleBy2.length);
                                }

                                console.log(stringToPrintNotDivisibleBy2);
                            }
                            
                        }
                        else{
                            var stringToPrint = stdout.split("\n")[i];
                            stringToPrint = chalk.red(stringToPrint.substring(0,1)) + stringToPrint.substring(1,stringToPrint.length);
                            stringToPrint0 = stringToPrint.split(",")[0];
                            if (stringToPrint0 === undefined){
                                stringToPrint0 = "";
                            }
                            stringToPrint1 = stringToPrint.split(",")[1];
                            if (stringToPrint1 === undefined){
                                stringToPrint1 = "";
                            }
                            stringToPrint2 = stringToPrint.split(",")[2];
                            if (stringToPrint2 === undefined){
                                stringToPrint2 = "";
                            }
                            stringToPrint = chalk.gray(stringToPrint0) + "  " + chalk.green(stringToPrint1) + "  " + chalk.red(stringToPrint2);
                            console.log(stringToPrint);
                        }
                        
                    }

                    console.log("");
                    resolve();
                    
                });
            }
            else{
                resolve();
            }
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function ShowCommitsPerDayInANiceFormattedWay(){
    return new Promise((resolve) => {
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'Yes'"){
            if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('ShowCommitsPerDayInANiceFormattedWay','./libEasyGit/StartupScreen/easyGitStatusVisualisationType.ini') === "'Yes'"){
                child = exec('git log --date=short --pretty=format:%ad | sort -r | uniq -c',
                { maxBuffer: 1024 * 1024 },
                function (error, stdout, stderr) {
                    console.log(chalk.black.bgMagenta(' Show commits per day in a nice formatted way -                                                                                                                                \n'));

                    var dateOneWeekAgo = new Date();
                    dateOneWeekAgo.setDate(dateOneWeekAgo.getDate()-7);

                    var date30DaysAgo = new Date();
                    date30DaysAgo.setDate(date30DaysAgo.getDate()-30);

                    var notPrintedWeek = true;
                    var notPrintedMonth = true;
                    var notYetPrintedTheMessage = true;
                    var noInputHasBeenPrintedToConsoleYet = true;

                    var SummarisedWeeklyCommits = 0;
                    var SummarisedMonthlyCommits = 0;

                    var ArrayWithAllPossibleColours = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan','white','gray'
                        ,'redBright','greenBright','yellowBright','blueBright','magentaBright','cyanBright','whiteBright'];

                    var StringThatContainsTheBarsForEachWeek = "";
                    var StringThatContainsTheBarsForEachMonth = "";

                    for ( var i=0; i<stdout.split("\n").length-1;i++){

                        // console.log(stdout.split("\n")[i].trim().split(" ").length);

                        if(stdout.split("\n")[i].trim().split(" ").length === 2){

                            var dateFromArrayFromPipedGitSortedCommand = new Date(stdout.split("\n")[i].trim().split(" ")[1]);
                            
                            // if(dateFromArrayFromPipedGitSortedCommand>date30DaysAgo){
                                if(dateFromArrayFromPipedGitSortedCommand>dateOneWeekAgo){

                                    // console.log("SummarisedWeeklyCommits1");

                                    if(stdout.split("\n")[i].trim().split(" ")[0].length === 1){
                                        SummarisedWeeklyCommits = SummarisedWeeklyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                                        // console.log(SummarisedWeeklyCommits);
                                    }
                                    else{
                                        SummarisedWeeklyCommits = SummarisedWeeklyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                                        // console.log(SummarisedWeeklyCommits);
                                    }
                                    

                                }
                                else{

                                    if(stdout.split("\n")[i].trim().split(" ")[0].length === 1){
                                        SummarisedMonthlyCommits = SummarisedMonthlyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                                        // console.log(SummarisedMonthlyCommits);
                                    }
                                    else{
                                        SummarisedMonthlyCommits = SummarisedMonthlyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                                        // console.log(SummarisedMonthlyCommits);
                                    }

                                }

                            // }
                            // else{
                            //     if(dateFromArrayFromPipedGitSortedCommand>dateOneWeekAgo){

                            //         // console.log("SummarisedWeeklyCommits1");

                            //         if(stdout.split("\n")[i].trim().split(" ")[0].length === 1){
                            //             SummarisedWeeklyCommits = SummarisedWeeklyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                            //             // console.log(SummarisedWeeklyCommits);
                            //         }
                            //         else{
                            //             SummarisedWeeklyCommits = SummarisedWeeklyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                            //             // console.log(SummarisedWeeklyCommits);
                            //         }
                                    

                            //     }
                            //     else{

                            //         if(stdout.split("\n")[i].trim().split(" ")[0].length === 1){
                            //             SummarisedMonthlyCommits = SummarisedMonthlyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                            //             // console.log(SummarisedMonthlyCommits);
                            //         }
                            //         else{
                            //             SummarisedMonthlyCommits = SummarisedMonthlyCommits + Number(stdout.split("\n")[i].trim().split(" ")[0]);
                            //             // console.log(SummarisedMonthlyCommits);
                            //         }

                            //     }
                            // }

                        }
                        else{
                            // console.log("SummarisedWeeklyCommits3");
                            console.log(stdout.split("\n")[i].trim().split(" ")[0]);
                        }
                        
                    }
                    
                    for ( var i=0; i<stdout.split("\n").length-1;i++){
                        
                        if(stdout.split("\n")[i].trim().split(" ").length === 2){

                            // console.log(stdout.split("\n")[i].trim().split(" "));


                            var dateFromArrayFromPipedGitSortedCommand = new Date(stdout.split("\n")[i].trim().split(" ")[1]);

                            const CFonts = require('cfonts');

                            var prettyFont;

                            if(dateFromArrayFromPipedGitSortedCommand>date30DaysAgo){
                                if(dateFromArrayFromPipedGitSortedCommand>dateOneWeekAgo){

                                    if(notPrintedWeek){
                                        console.log(chalk.blue("Activity in the past week: " + SummarisedWeeklyCommits + " commits"));
                                        notPrintedWeek = false;
                                    }

                                    var totalNumberOfcommitsPerLineWeek = stdout.split("\n")[i].trim().split(" ")[0];
                                    var totalNumberOfcommitsPerLineDividedWithRemainerWeek = totalNumberOfcommitsPerLineWeek / 10;

                                    var mathCeilWeek =  Math.ceil(totalNumberOfcommitsPerLineDividedWithRemainerWeek);
                                    var mathFloorWeek = Math.floor(totalNumberOfcommitsPerLineDividedWithRemainerWeek);

                                    var mathCeilForCalculationWeek=  0;

                                    StringThatContainsTheBarsForEachWeek="";

                                    if (mathFloorWeek === 0){
                                        prettyFont = CFonts.render("I".repeat(totalNumberOfcommitsPerLineWeek), {
                                        font: 'tiny',              // define the font face
                                        align: 'left',             // define text alignment
                                        colors: ['cyan'],          // define all colors
                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                        letterSpacing: 0,           // define letter spacing
                                        lineHeight: 1,              // define the line height
                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                        maxLength: '0',             // define how many character can be on one line
                                        gradient: false,            // define your two gradient colors
                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                        transitionGradient: false,  // define if this is a transition between colors directly
                                        env: 'node'                 // define the environment CFonts is being executed in
                                        });

                                        prettyFont.string  // the ansi string for sexy console font
                                        prettyFont.array   // returns the array for the output
                                        prettyFont.lines   // returns the lines used
                                        prettyFont.options // returns the options used
            
                                        StringThatContainsTheBarsForEachWeek = functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());

                                        var dateObjectToGetDay = new Date(stdout.split("\n")[i].trim().split(" ")[1].replace(/-/g,"/"));
                                        
                                        try{
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false; 
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false; 
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false; 
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                        }
                                        catch(e){
                                            // console.log("x1 " + e.toString());
                                            if(e.toString().includes("TypeError:")){
                                                
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (mathFloorWeek != 0){
                                        for(var ii=0;ii<mathCeilWeek;ii++){
                                            if(mathFloorWeek != mathCeilForCalculationWeek){

                                                if(ii<15){
                                                    if (mathFloor != 0){
                                                        prettyFont = CFonts.render("I".repeat(10), {
                                                        font: 'tiny',              // define the font face
                                                        align: 'left',             // define text alignment
                                                        colors: [ArrayWithAllPossibleColours[ii]],          // define all colors
                                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                        letterSpacing: 0,           // define letter spacing
                                                        lineHeight: 1,              // define the line height
                                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                                        maxLength: '0',             // define how many character can be on one line
                                                        gradient: false,            // define your two gradient colors
                                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                        transitionGradient: false,  // define if this is a transition between colors directly
                                                        env: 'node'                 // define the environment CFonts is being executed in
                                                        });
                
                                                        prettyFont.string  // the ansi string for sexy console font
                                                        prettyFont.array   // returns the array for the output
                                                        prettyFont.lines   // returns the lines used
                                                        prettyFont.options // returns the options used
                            
                                                        StringThatContainsTheBarsForEachWeek = StringThatContainsTheBarsForEachWeek + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());
                                                        // console.log(StringThatContainsTheBarsForEachMonth);
                                                    }
                                                }
                                                else{
                                                    prettyFont = CFonts.render("I".repeat(10), {
                                                        font: 'tiny',              // define the font face
                                                        align: 'left',             // define text alignment
                                                        colors: ['blue'],          // define all colors
                                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                        letterSpacing: 0,           // define letter spacing
                                                        lineHeight: 1,              // define the line height
                                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                                        maxLength: '0',             // define how many character can be on one line
                                                        gradient: false,            // define your two gradient colors
                                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                        transitionGradient: false,  // define if this is a transition between colors directly
                                                        env: 'node'                 // define the environment CFonts is being executed in
                                                        });
                
                                                        prettyFont.string  // the ansi string for sexy console font
                                                        prettyFont.array   // returns the array for the output
                                                        prettyFont.lines   // returns the lines used
                                                        prettyFont.options // returns the options used
                            
                                                        StringThatContainsTheBarsForEachWeek = StringThatContainsTheBarsForEachWeek + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());  
                                                        // console.log(StringThatContainsTheBarsForEachMonth);
                                                }

                                                // console.log(mathCeilForCalculation);
                                                mathCeilForCalculationWeek = mathCeilForCalculationWeek + 1;
                                            }
                                            else{
                                                var remainder = totalNumberOfcommitsPerLineWeek % 10;

                                                prettyFont = CFonts.render("I".repeat(remainder), {
                                                    font: 'tiny',              // define the font face
                                                    align: 'left',             // define text alignment
                                                    colors: ['cyan'],          // define all colors
                                                    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                    letterSpacing: 0,           // define letter spacing
                                                    lineHeight: 1,              // define the line height
                                                    space: false,               // define if the output text should have empty lines on top and on the bottom
                                                    maxLength: '0',             // define how many character can be on one line
                                                    gradient: false,            // define your two gradient colors
                                                    independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                    transitionGradient: false,  // define if this is a transition between colors directly
                                                    env: 'node'                 // define the environment CFonts is being executed in
                                                    });
            
                                                    prettyFont.string  // the ansi string for sexy console font
                                                    prettyFont.array   // returns the array for the output
                                                    prettyFont.lines   // returns the lines used
                                                    prettyFont.options // returns the options used
                        
                                                    StringThatContainsTheBarsForEachWeek = StringThatContainsTheBarsForEachWeek + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());  
                                                    // console.log(StringThatContainsTheBarsForEachMonth);
                                            }
                                        }
                                        
                                        var dateObjectToGetDay = new Date(stdout.split("\n")[i].trim().split(" ")[1].replace(/-/g,"/"));
                                        
                                        try{
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLineWeek) + "  " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLineWeek) + " " + StringThatContainsTheBarsForEachWeek);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                        }
                                        catch(e){
                                            // console.log("x2 " + e.toString());
                                            if(e.toString().includes("TypeError:")){
                                                
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                    if(totalNumberOfcommitsPerLineWeek.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + " " + StringThatContainsTheBarsForEachWeek);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                            }
                                        }
                                    }       
                                }
                                else{

                                    if(notPrintedMonth){
                                        console.log("");
                                        console.log(chalk.blue("Activity in the past month (excluding last week): " + SummarisedMonthlyCommits+ " commits" + " | A total of " + (Number(SummarisedWeeklyCommits) + Number(SummarisedMonthlyCommits)) + " commits (for the whole month)"));
                                        notPrintedMonth = false;
                                    }

                                    var totalNumberOfcommitsPerLine = stdout.split("\n")[i].trim().split(" ")[0];
                                    var totalNumberOfcommitsPerLineDividedWithRemainer = totalNumberOfcommitsPerLine / 10;

                                    var mathCeil =  Math.ceil(totalNumberOfcommitsPerLineDividedWithRemainer);
                                    var mathFloor = Math.floor(totalNumberOfcommitsPerLineDividedWithRemainer);

                                    var mathCeilForCalculation =  0;

                                    StringThatContainsTheBarsForEachMonth="";

                                    if (mathFloor != 0){
                                        for(var ii=0;ii<mathCeil;ii++){
                                            if(mathFloor != mathCeilForCalculation){

                                                if(ii<15){
                                                    if (mathFloor != 0){
                                                        prettyFont = CFonts.render("I".repeat(10), {
                                                        font: 'tiny',              // define the font face
                                                        align: 'left',             // define text alignment
                                                        colors: [ArrayWithAllPossibleColours[ii]],          // define all colors
                                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                        letterSpacing: 0,           // define letter spacing
                                                        lineHeight: 1,              // define the line height
                                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                                        maxLength: '0',             // define how many character can be on one line
                                                        gradient: false,            // define your two gradient colors
                                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                        transitionGradient: false,  // define if this is a transition between colors directly
                                                        env: 'node'                 // define the environment CFonts is being executed in
                                                        });
                
                                                        prettyFont.string  // the ansi string for sexy console font
                                                        prettyFont.array   // returns the array for the output
                                                        prettyFont.lines   // returns the lines used
                                                        prettyFont.options // returns the options used
                            
                                                        StringThatContainsTheBarsForEachMonth = StringThatContainsTheBarsForEachMonth + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());
                                                        // console.log(StringThatContainsTheBarsForEachMonth);
                                                    }
                                                }
                                                else{
                                                    prettyFont = CFonts.render("I".repeat(10), {
                                                        font: 'tiny',              // define the font face
                                                        align: 'left',             // define text alignment
                                                        colors: ['blue'],          // define all colors
                                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                        letterSpacing: 0,           // define letter spacing
                                                        lineHeight: 1,              // define the line height
                                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                                        maxLength: '0',             // define how many character can be on one line
                                                        gradient: false,            // define your two gradient colors
                                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                        transitionGradient: false,  // define if this is a transition between colors directly
                                                        env: 'node'                 // define the environment CFonts is being executed in
                                                        });
                
                                                        prettyFont.string  // the ansi string for sexy console font
                                                        prettyFont.array   // returns the array for the output
                                                        prettyFont.lines   // returns the lines used
                                                        prettyFont.options // returns the options used
                            
                                                        StringThatContainsTheBarsForEachMonth = StringThatContainsTheBarsForEachMonth + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());  
                                                        // console.log(StringThatContainsTheBarsForEachMonth);
                                                }

                                                // console.log(mathCeilForCalculation);
                                                mathCeilForCalculation = mathCeilForCalculation + 1;
                                            }
                                            else{
                                                var remainder = totalNumberOfcommitsPerLine % 10;

                                                prettyFont = CFonts.render("I".repeat(remainder), {
                                                    font: 'tiny',              // define the font face
                                                    align: 'left',             // define text alignment
                                                    colors: ['cyan'],          // define all colors
                                                    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                                    letterSpacing: 0,           // define letter spacing
                                                    lineHeight: 1,              // define the line height
                                                    space: false,               // define if the output text should have empty lines on top and on the bottom
                                                    maxLength: '0',             // define how many character can be on one line
                                                    gradient: false,            // define your two gradient colors
                                                    independentGradient: false, // define if you want to recalculate the gradient for each new line
                                                    transitionGradient: false,  // define if this is a transition between colors directly
                                                    env: 'node'                 // define the environment CFonts is being executed in
                                                    });
            
                                                    prettyFont.string  // the ansi string for sexy console font
                                                    prettyFont.array   // returns the array for the output
                                                    prettyFont.lines   // returns the lines used
                                                    prettyFont.options // returns the options used
                        
                                                    StringThatContainsTheBarsForEachMonth = StringThatContainsTheBarsForEachMonth + functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());  
                                                    // console.log(StringThatContainsTheBarsForEachMonth);
                                            }
                                        }

                                        var dateObjectToGetDay = new Date(stdout.split("\n")[i].trim().split(" ")[1].replace(/-/g,"/"));

                                        try{
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                        }
                                        catch(e){
                                            // console.log("x3 " + e.toString());
                                            if(e.toString().includes("TypeError:")){
                                                
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                            }
                                        }
                                    }       

                                    if (mathFloor === 0){
                                        prettyFont = CFonts.render("I".repeat(totalNumberOfcommitsPerLine), {
                                        font: 'tiny',              // define the font face
                                        align: 'left',             // define text alignment
                                        colors: ['cyan'],          // define all colors
                                        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                                        letterSpacing: 0,           // define letter spacing
                                        lineHeight: 1,              // define the line height
                                        space: false,               // define if the output text should have empty lines on top and on the bottom
                                        maxLength: '0',             // define how many character can be on one line
                                        gradient: false,            // define your two gradient colors
                                        independentGradient: false, // define if you want to recalculate the gradient for each new line
                                        transitionGradient: false,  // define if this is a transition between colors directly
                                        env: 'node'                 // define the environment CFonts is being executed in
                                        });

                                        prettyFont.string  // the ansi string for sexy console font
                                        prettyFont.array   // returns the array for the output
                                        prettyFont.lines   // returns the lines used
                                        prettyFont.options // returns the options used
            
                                        StringThatContainsTheBarsForEachMonth = functions.splitString(prettyFont.string.replace(' ','').replace('\n','').trim());


                                        var dateObjectToGetDay = new Date(stdout.split("\n")[i].trim().split(" ")[1].replace(/-/g,"/"));
                                        
                                        try{
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "    " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "   " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + "  " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                            if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                if(totalNumberOfcommitsPerLine.length === 1){
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLine) + "  " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                                else{
                                                    console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                    + " " + chalk.red(totalNumberOfcommitsPerLine) + " " + StringThatContainsTheBarsForEachMonth);
                                                    noInputHasBeenPrintedToConsoleYet = false;  
                                                }
                                            }
                                        }
                                        catch(e){
                                            // console.log("x4 " + e.toString());
                                            if(e.toString().includes("TypeError:")){
                                                
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 6){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "    " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 7){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "   " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 8){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + "  " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                                if(dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }).length === 9){
                                                    if(totalNumberOfcommitsPerLine.length === 1){
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + "  " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                    else{
                                                        console.log(stdout.split("\n")[i].trim().split(" ")[1] + " " + dateObjectToGetDay.toLocaleDateString('en-US', { weekday: 'long' }) 
                                                        + " " + chalk.red(10) + " " + StringThatContainsTheBarsForEachMonth);
                                                        noInputHasBeenPrintedToConsoleYet = false;  
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else{
                                // console.log("SummarisedWeeklyCommits55 " + stdout.split("\n")[i].trim().split(" "));
                                if(notYetPrintedTheMessage === true){
                                    if(noInputHasBeenPrintedToConsoleYet === true){
                                        console.log("There are no commits made in the past 30 days.");
                                        notYetPrintedTheMessage = false;
                                    }
                                }

                            }

                        }
                        else{
                            console.log(stdout.split("\n")[i].trim().split(" ")[0]);
                        }
                    }

                    console.log("");
                    resolve();
                });
            }
            else{
                resolve();
            }
        }
        if (functionsForReadingAndWritingToIniConfigFiles.ReadFromFile('gitStatus','./libEasyGit/StartupScreen/easyGitConfig.ini') === "'No'"){
            resolve();
        }
    });
}

function main(){

    message: console.log(chalk.black.bgBlackBright (' Choose an option:                                                                                                                                                             '));
   
inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            pageSize: '40',
            choices:  [
                chalk.cyan('SYNC PUSH:  Make a local commit and push                     (git add . && git add -A  && git commit -m" + arg1var + " && start cmd /k git push)'),
                chalk.cyan('SYNC PUSH:  Make a local commit                              (git add . && git add -A  && git commit -m" + arg1var ")'), 
                chalk.cyan('SYNC PUSH:  Push to remote                                   (git push)'), 
                chalk.blueBright('SYNC PULL:  Pull origin master                               (git pull origin master)'), 
                chalk.blueBright('SYNC PULL:  Pull rebase                                      (git pull --rebase)'), 
                chalk.blueBright('SYNC PULL:  Pull                                             (git pull)'), 
                chalk.blueBright('SYNC PULL:  Clone from url                                   (git clone <*url*>)'), 
                chalk.blueBright('SYNC PULL:  Clone from list of repos                         (git clone <*list*>)'), 
                chalk.green('BRANCHING:  Make new branch                                  (git checkout -b <*name*>)'),
                chalk.green('BRANCHING:  Show branches                                    (git branch -a)'),
                chalk.green('BRANCHING:  Switch branches                                  (git checkout <*name*>)'),
                chalk.green('BRANCHING:  Remove branch                                    (git branch -D <*name*>)'),
                chalk.green('BRANCHING:  Remove remote branch                             (git push <listOfRemote/origin> --delete <*name*>)'),
                chalk.green('BRANCHING:  Merge branch current branch with another         (git merge <*name*>)'),
                chalk.redBright('REVERT:     Reverts the HEAD and the last commit             (git reset HEAD~1)'),
                chalk.redBright('REVERT:     Like above, but leaves your files and your index (git reset --soft HEAD~1)'),
                chalk.redBright('REVERT:     Reverts and resets files to past state           (git reset --hard HEAD~1)'),
                chalk.yellow('INFO:       Go to origin                                     (git config --get remote.origin.url)'), 
                chalk.yellow('INFO:       Visualise git                                    (<*list of options*>)'), 
                chalk.yellow('INFO:       Get list of repos                                (gets <*list*>)'),
                chalk.yellow('INFO:       git log                                          (git log)'),
                chalk.yellow('INFO:       git reflog                                       (git reflog)'),
                chalk.yellow('INFO:       git show                                         (git show)'),  
                chalk.yellow('INFO:       git diff                                         (git diff)'), 
                chalk.yellow('INFO:       git status                                       (git status)'), 
                chalk.greenBright('Tagging:    List git tags                                    (git tag)'),
                chalk.greenBright('Tagging:    Show info about git tags                         (git show <*name*>)'),
                chalk.greenBright('Tagging:    Create lightweight git tags                      (git tag <*name*>)'),
                chalk.greenBright('Tagging:    Create annotated git tags                        (git tag -a <*name*> -m <*message*>)'),  
                chalk.greenBright('Tagging:    Push git tags to remote                          (git push --tags)'),
                chalk.greenBright('Tagging:    Delete tags                                      (git tag -d <*name*>)'),  
                chalk.magentaBright('MANAGEMENT: Register local repo                              (writes repo name in $User\\Documents\\GitRepoList\\List.txt)'), 
                chalk.magentaBright('MANAGEMENT: Open local repo                                  (reads repo name from $User\\Documents\\GitRepoList\\List.txt)'), 
                chalk.hex('#a434eb')('UTILITY:    git config core.autocrlf true ( for Windows )    (git config core.autocrlf true)'), 
                chalk.hex('#a434eb')('UTILITY:    Test: use of simple-git functions                (test)'),
                chalk.blackBright('HELP:       Show infographic                                 (start http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf )'), 
                chalk.blackBright('HELP:       Show ohshitgit.com                               (start https://ohshitgit.com/ )'),
                gradient.rainbow('SETTINGS:   Enable or disable startup data fields.'),
                gradient.rainbow('SETTINGS:   Enable or disable status visualisation types.'),
                gradient.rainbow('SETTINGS:   Enable, disable or change miscellaneous settings.')

],
},
    ])
    .then(answers => {
                    
        if (answers.option == chalk.cyan('SYNC PUSH:  Make a local commit and push                     (git add . && git add -A  && git commit -m" + arg1var + " && start cmd /k git push)')) {
            SYNCMakeacommitandpush.CommitAndPush();
        }

        if (answers.option == chalk.cyan('SYNC PUSH:  Make a local commit                              (git add . && git add -A  && git commit -m" + arg1var ")')) {
            SYNCMakeacommit.Commit();
        }

        if (answers.option == chalk.cyan('SYNC PUSH:  Push to remote                                   (git push)')) {
            SYNCgitpush.Sync_GitPush_ExternalCall();
        }

        if (answers.option == chalk.blueBright('SYNC PULL:  Pull origin master                               (git pull origin master)')) {
            SYNCgitpulloriginmaster.GitPUllOriginMaster();
        }

        if (answers.option == chalk.blueBright('SYNC PULL:  Pull rebase                                      (git pull --rebase)')) {
            SYNCgitpullrebase.GitPUllRebase();
        }

        if (answers.option == chalk.blueBright('SYNC PULL:  Pull                                             (git pull)')) {
            SYNCgitpull.GitPUll();
        }

        if (answers.option ==  chalk.blueBright('SYNC PULL:  Clone from url                                   (git clone <*url*>)')) {
            SYNCgitclonefromurl.GitCloneFromURl();
        }

        if (answers.option == chalk.blueBright('SYNC PULL:  Clone from list of repos                         (git clone <*list*>)')) {
            SYNCgitclonefromlistofrepos.GetListOfRepos(answers);
        }

        if (answers.option == chalk.green('BRANCHING:  Make new branch                                  (git checkout -b <*name*>)')) {
            BRANCHINGmakenewbranches.MakeNewBranches();
        }

        if (answers.option == chalk.green('BRANCHING:  Show branches                                    (git branch -a)')) {
            BRANCHINGShowbranches.ShowBranches();
        }

        if (answers.option == chalk.green('BRANCHING:  Switch branches                                  (git checkout <*name*>)')) {
            BRANCHINGSwitchbranches.SwitchBranches();
        }

        if (answers.option == chalk.green('BRANCHING:  Remove branch                                    (git branch -D <*name*>)')) {
            BRANCHINGRemovebranch.RemoveBranch();
        }

        if (answers.option == chalk.green('BRANCHING:  Remove remote branch                             (git push <listOfRemote/origin> --delete <*name*>)')) {
            BRANCHINGRemoveremotebranch.BRANCHINGRemoveremotebranch();
        }

        if (answers.option == chalk.green('BRANCHING:  Merge branch current branch with another         (git merge <*name*>)')) {
            BRANCHINGMergebranch.MergeBranches();
        }

        if (answers.option == chalk.redBright('REVERT:     Reverts the HEAD and the last commit             (git reset HEAD~1)')) {
            REVERTReturnthelastcommit.REVERTHeadAndLastCommit();
        }
 
        if (answers.option == chalk.redBright('REVERT:     Like above, but leaves your files and your index (git reset --soft HEAD~1)')) {
            REVERTHeadAndLastCommitSoft.REVERTHeadAndLastCommitSoft();
        }

        if (answers.option == chalk.redBright('REVERT:     Reverts and resets files to past state           (git reset --hard HEAD~1)')) {
            REVERTHeadAndLastCommitHard.REVERTHeadAndLastCommitHard();
        }

        if (answers.option == chalk.yellow('INFO:       Go to origin                                     (git config --get remote.origin.url)')) {
            INFOGotoorigin.GoToOrigin();
        }

        if (answers.option == chalk.yellow('INFO:       Get list of repos                                (gets <*list*>)')) {
            INFOGetlistofrepos.GetListOfRepos(answers);
        }

        if (answers.option == chalk.yellow('INFO:       git log                                          (git log)')) {
            INFOGitlog.GitLog();
        }

        if (answers.option == chalk.yellow('INFO:       git reflog                                       (git reflog)')) {
            INFOGitReflog.GitReflog();
        }

        if (answers.option == chalk.yellow('INFO:       git show                                         (git show)')) {
            INFOGitshow.GitShow();
        }

        if (answers.option == chalk.yellow('INFO:       git diff                                         (git diff)')) {
            INFOGitdiff.GitDiff();
        }

        if (answers.option == chalk.yellow('INFO:       git status                                       (git status)')) {
            INFOGitStatus.gitStatus();
        }

        if (answers.option ==  chalk.yellow('INFO:       Visualise git                                    (<*list of options*>)')) {
            INFOVisualisegit.VisualiseGit();
        }

        if (answers.option == chalk.greenBright('Tagging:    List git tags                                    (git tag)')) {
            TaggingListAllTags.ListAllTags();
        }

        if (answers.option == chalk.greenBright('Tagging:    Show info about git tags                         (git show <*name*>)')) {
            TaggingShow.TaggingShow();
        }

        if (answers.option == chalk.greenBright('Tagging:    Create lightweight git tags                      (git tag <*name*>)')) {
            TaggingCreateLightweightTags.TaggingCreateLightweightTags();
        }

        if (answers.option == chalk.greenBright('Tagging:    Create annotated git tags                        (git tag -a <*name*> -m <*message*>)')) {
            TaggingCreateAnnotatedTags.TaggingCreateAnnotatedTags();
        }

        if (answers.option == chalk.greenBright('Tagging:    Push git tags to remote                          (git push --tags)')) {
            TaggingPusAllhTagsToRemote.TaggingPusAllhTagsToRemote();
        }
        
        if (answers.option == chalk.greenBright('Tagging:    Delete tags                                      (git tag -d <*name*>)')) {
            TaggingDeleteTags.TaggingDeleteTags();
        }

        if (answers.option == chalk.magentaBright('MANAGEMENT: Register local repo                              (writes repo name in $User\\Documents\\GitRepoList\\List.txt)')) {
            MANAGEMENTRegisterrepo.Registerrepo(answers);
        }

        if (answers.option == chalk.magentaBright('MANAGEMENT: Open local repo                                  (reads repo name from $User\\Documents\\GitRepoList\\List.txt)')) {
            MANAGEMENTOpenlocalrepo.Openlocalrepo(answers);
        }

        if (answers.option == chalk.hex('#a434eb')('UTILITY:    git config core.autocrlf true ( for Windows )    (git config core.autocrlf true)')) {
            UTILITYgitconfigcoreautocrlftrueforWindows.WindowsConfig(answers);          
        }

        if (answers.option == chalk.hex('#a434eb')('UTILITY:    Test: use of simple-git functions                (test)')) {
            UTILITYTestuseofsimplegitfunctionss.TestFunctionForSimplegit();   
        }

        if (answers.option == chalk.blackBright('HELP:       Show infographic                                 (start http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf )')) {
            HELPShowinfographic.ShowInfographic();
        }

        if (answers.option == chalk.blackBright('HELP:       Show ohshitgit.com                               (start https://ohshitgit.com/ )')) {
            HELPShowohshitgit.ShowOhshitgit();
        }

        if (answers.option == chalk.hex('#a434eb')('UTILITY:    Test: use of simple-git functions                (test)')) {
            BRANCHINGRemoveremotebranch.BRANCHINGRemoveremotebranch();   
        }

        if (answers.option == gradient.rainbow('SETTINGS:   Enable or disable startup data fields.')) {
            SETTINGSEnableordisablestartupdatafields.SETTINGSFunction1();
        }

        if (answers.option == gradient.rainbow('SETTINGS:   Enable or disable status visualisation types.')) {
            SETTINGSEnableordisableStatusVisualisationTypes.SETTINGSFunction2();
        }

        if (answers.option == gradient.rainbow('SETTINGS:   Enable, disable or change miscellaneous settings.')) {
            SETTINGSEnableordisableMiscellaneousSettings.SETTINGSFunction3();
        }
    });

}
