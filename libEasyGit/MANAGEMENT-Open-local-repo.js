var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    Openlocalrepo: () => {
        functions.OpenLocalRepo('MANAGEMENT: Open local repo                                  (reads repo name from $User\\Documents\\GitRepoList\\List.txt)');
    }
};

