var exec = require('child_process').exec, child;

const inquirer = require('inquirer');
const chalk = require('chalk');

const functions = require('./functions');

const INFOVisualisegitVersion2 = require('./Visualisation/INFO-Visualise-git-version2');
const INFOVisualisegitVersion3 = require('./Visualisation/INFO-Visualise-git-version3');
const INFOVisualisegitVersion4 = require('./Visualisation/INFO-Visualise-git-version4');
const INFOVisualisegitVersion5 = require('./Visualisation/INFO-Visualise-git-version5');
const INFOVisualisegitVersion6 = require('./Visualisation/INFO-Visualise-git-version6');
const INFOVisualisegitVersion7 = require('./Visualisation/INFO-Visualise-git-version7');
const HELPShowhttpsdevhintsiogitlog = require('./Visualisation/HELP-Show-https-devhints.io-git-log');
const HELPShowhttpsgitscmcomdocsgitlog = require('./Visualisation/HELP-Show-https-git-scm.com-docs-git-log');

module.exports = {
    VisualiseGit: () => {
        // functions.MakeTerminalCallFromMenuName('git log --graph');

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'option',
                    pageSize: '40',
                    choices:  [
                        chalk.cyan('INFO:       Visualise git version 1                          (git log --graph)'),
                        chalk.cyan('INFO:       Visualise git version 2                          (git log --all --color --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit)'), 
                        chalk.cyan('INFO:       Visualise git version 3                          (git log --oneline --abbrev-commit --all --graph --decorate --color)'), 
                        chalk.cyan('INFO:       Visualise git version 4                          (git log --all --color --graph)'),
                        chalk.cyan('INFO:       Visualise git version 5                          (git log --oneline --abbrev-commit --all --graph --decorate --color --shortstat --max-count=5)'),
                        chalk.cyan('INFO:       Visualise git version 6                          (git log --oneline --all --graph --color --shortstat --max-count=5 --name-only)'),  
                        chalk.cyan('INFO:       Custom Visualisation                             (<*custom visualisation from a list of option*>)'), 
                        chalk.blackBright('HELP:       Show devhints.io help page                       (start https://devhints.io/git-log )'), 
                        chalk.blackBright('HELP:       Show official git documentation                  (start https://git-scm.com/docs/git-log )'), 
            ],
                },
            ])
            .then(answers => {
                            
                if (answers.option == chalk.cyan('INFO:       Visualise git version 1                          (git log --graph)')) {
                    functions.MakeTerminalCallFromMenuName('git log --graph');
                }

                if (answers.option == chalk.cyan('INFO:       Visualise git version 2                          (git log --all --color --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit)')) {
                    INFOVisualisegitVersion2.VisualiseGitVersion2();
                }

                if (answers.option == chalk.cyan('INFO:       Visualise git version 3                          (git log --oneline --abbrev-commit --all --graph --decorate --color)')) {
                    INFOVisualisegitVersion3.VisualiseGitVersion3();
                }

                if (answers.option == chalk.cyan('INFO:       Visualise git version 4                          (git log --all --color --graph)')) {
                    INFOVisualisegitVersion4.VisualiseGitVersion4();
                }

                if (answers.option == chalk.cyan('INFO:       Visualise git version 5                          (git log --oneline --abbrev-commit --all --graph --decorate --color --shortstat --max-count=5)')) {
                    INFOVisualisegitVersion5.VisualiseGitVersion5();
                }

                if (answers.option == chalk.cyan('INFO:       Visualise git version 6                          (git log --oneline --all --graph --color --shortstat --max-count=5 --name-only)')) {
                    INFOVisualisegitVersion6.VisualiseGitVersion6();
                }

                if (answers.option == chalk.cyan('INFO:       Custom Visualisation                             (<*custom visualisation from a list of option*>)')) {
                    INFOVisualisegitVersion7.VisualiseGitVersion7();
                }

                if (answers.option == chalk.blackBright('HELP:       Show devhints.io help page                       (start https://devhints.io/git-log )')) {
                    HELPShowhttpsdevhintsiogitlog.HELPShowhttpsdevhintsiogitlog();
                }

                if (answers.option == chalk.blackBright('HELP:       Show official git documentation                  (start https://git-scm.com/docs/git-log )')) {
                    HELPShowhttpsgitscmcomdocsgitlog.HELPShowhttpsgitscmcomdocsgitlog();
                }

            });
    }
};

  
