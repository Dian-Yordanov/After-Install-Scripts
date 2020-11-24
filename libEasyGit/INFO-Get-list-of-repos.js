var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    GetListOfRepos: (answers) => {
        functions.GetListOfRepos(answers, chalk.yellow('INFO:       Get list of repos                                (gets <*list*>)'), "EndHerePseudo-BooleanYes");
    }
};