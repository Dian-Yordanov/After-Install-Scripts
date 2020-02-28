const inquirer = require('inquirer');
var fs = require('fs');
var exec = require('child_process').exec, child;
const prompts = require('prompts');
const { execSync } = require('child_process');


inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            pageSize: '16',
            choices: ['Make a commit'],
        },
    ])
    .then(answers => {
        if (answers.option == "Make a commit") {
            RegisterRepo(answers, 'Make a commit');
        }
    });



function RegisterRepo(answers, answersOption) {
    if (answers.option == answersOption) {
        console.log("ddddddddddddddddd");
    }
}

