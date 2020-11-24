var exec = require('child_process').exec, child;

const functions = require('./functions');

module.exports = {
    Registerrepo: () => {
        functions.RegisterRepo('MANAGEMENT: Register local repo                              (writes repo name in $User\\Documents\\GitRepoList\\List.txt)');
    }
};
