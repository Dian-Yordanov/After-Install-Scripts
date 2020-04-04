var exec = require('child_process').exec, child;

const inquirer = require('inquirer');
const chalk = require('chalk');

const functions = require('../functions');

module.exports = {
    VisualiseGitVersion7: () => {

          var result1 = "";
          inquirer
          .prompt([
            {
              type: 'checkbox',
              message: 'Select command line options',
              name: 'options',
              pageSize: '100',
              choices: [
                new inquirer.Separator('1/9 - Count of last commits, choose 1: '),
                  {
                      name: '--max-count=5'
                  },
                  {
                      name: '--max-count=10'
                  },
                  {
                      name: '--max-count=15'
                  },
                  {
                      name: '--max-count=20'
                  },            
              ],
            }
          ])
          .then(answers => {
            console.log(answers.options);
           
            for (var i=0; i<answers.options.length;i ++){
              result1 = result1 + answers.options[i] + " ";
            }
  
            var result2 = "";
            inquirer
            .prompt([
              {
                type: 'checkbox',
                message: 'Select command line options',
                name: 'options',
                pageSize: '100',
                choices: [
                  new inquirer.Separator('2/9 - Visual options: '),
                    {
                        name: '--all'  
                    },
                    {
                        name: '--color'
                    },
                    {
                        name: '--graph'
                    },
                    {
                        name: '--no-decorate'
                    },
                    {
                        name: '--decorate=short'
                    },
                    {
                        name: '--decorate=full'
                    },
                    {
                        name: '--decorate=auto'
                    },
                    {
                        name: '--decorate=no'
                    },
                    {
                        name: '--source'
                    },
                    {
                        name: '-p'
                    },
                    {
                        name: '-c'
                    },
                    {
                        name: '--no-merges'
                    },
                    {
                        name: '--merges'
                    },
                    {
                        name: '--single-worktree'
                    },
                    {
                        name: '--ignore-missing'
                    },
                ],
              }
            ])
                .then(answers => {
                console.log(answers.options);
                
                for (var i=0; i<answers.options.length;i ++){
                    result2 = result2 + answers.options[i] + " ";
                }
         
                    var result3 = "";
                    inquirer
                    .prompt([
                    {
                        type: 'checkbox',
                        message: 'Select command line options',
                        name: 'options',
                        pageSize: '100',
                        choices: [
                        new inquirer.Separator('3/9 - History Simplification: '),
                        {
                            name: '--dense'  
                        },
                        {
                            name: '--sparse'  
                        },
                        {
                            name: '--simplify-merges'  
                        },
                        {
                            name: '--full-history'  
                        },
                        ],
                    }
                    ])
                        .then(answers => {
                        console.log(answers.options);
                        
                        for (var i=0; i<answers.options.length;i ++){
                            result3 = result3 + answers.options[i] + " ";
                        }

                        var result4 = "";
                        inquirer
                        .prompt([
                        {
                            type: 'checkbox',
                            message: 'Select command line options',
                            name: 'options',
                            pageSize: '100',
                            choices: [
                            new inquirer.Separator('4/9 - Commit Ordering: '),
                            {
                                name: '--date-order'  
                            },
                            {
                                name: '--author-date-order'  
                            },
                            {
                                name: '--topo-order'  
                            },
                            {
                                name: '--reverse'  
                            },
                            ],
                        }
                        ])
                            .then(answers => {
                            console.log(answers.options);
                            
                            for (var i=0; i<answers.options.length;i ++){
                                result4 = result4 + answers.options[i] + " ";
                            }

                            var result5 = "";
                            inquirer
                            .prompt([
                            {
                                type: 'checkbox',
                                message: 'Select command line options',
                                name: 'options',
                                pageSize: '100',
                                choices: [
                                new inquirer.Separator('5/9 - Object Traversal: '),
                                {
                                    name: '--no-walk=sortede'  
                                },
                                {
                                    name: '--no-walk=unsorted'  
                                },
                                {
                                    name: '--do-walk'  
                                },
                                ],

                            }
                            ])
                                .then(answers => {
                                console.log(answers.options);
                                
                                for (var i=0; i<answers.options.length;i ++){
                                    result5 = result5 + answers.options[i] + " ";
                                }
                             
                                var result6 = "";
                                inquirer
                                .prompt([
                                {
                                    type: 'checkbox',
                                    message: 'Select command line options',
                                    name: 'options',
                                    pageSize: '100',
                                    choices: [
                                    new inquirer.Separator('6/9 - Commit Formatting: '),
                                    {
                                        name: '--abbrev-commit'  
                                    },
                                    {
                                        name: '--no-abbrev-commit'  
                                    },
                                    {
                                        name: '--oneline'  
                                    },
                                    {
                                        name: '--expand-tabs'  
                                    },
                                    {
                                        name: '--no-expand-tabs'  
                                    },
                                    {
                                        name: '--no-notes'  
                                    },
                                    {
                                        name: '--do-walk'  
                                    },
                                    {
                                        name: '--show-notes'  
                                    },
                                    {
                                        name: '--show-signature'  
                                    },
                                    {
                                        name: '--relative-date'  
                                    },
                                    {
                                        name: '--parents'  
                                    },
                                    {
                                        name: '--children'  
                                    },
                                    {
                                        name: '--left-right'  
                                    },
                                    {
                                        name: '--graph'  
                                    },
                                    ],

                                }
                                ])
                                    .then(answers => {
                                    console.log(answers.options);
                                    
                                    for (var i=0; i<answers.options.length;i ++){
                                        result6 = result6 + answers.options[i] + " ";
                                    }
                            
                                    var result7 = "";
                                    inquirer
                                    .prompt([
                                    {
                                        type: 'checkbox',
                                        message: 'Select command line options',
                                        name: 'options',
                                        pageSize: '100',
                                        choices: [
                                        new inquirer.Separator('7/9 - Diff Formatting: '),
                                        {
                                            name: '-c'  
                                        },
                                        {
                                            name: '--cc'  
                                        },
                                        {
                                            name: '--combined-all-paths'  
                                        },
                                        {
                                            name: '-r'  
                                        },
                                        {
                                            name: '-t'  
                                        },
                                        ],
                                    }
                                    ])
                                        .then(answers => {
                                        console.log(answers.options);
                                        
                                        for (var i=0; i<answers.options.length;i ++){
                                            result7 = result7 + answers.options[i] + " ";
                                        }

                                        var result8 = "";
                                        inquirer
                                        .prompt([
                                        {
                                            type: 'checkbox',
                                            message: 'Select command line options',
                                            name: 'options',
                                            pageSize: '100',
                                            choices: [
                                            new inquirer.Separator('8/9 - COMMON DIFF OPTIONS part 1: '),
                                            {
                                                name: '-p'  
                                            },
                                            {
                                                name: '-u'  
                                            },
                                            {
                                                name: '--patch'  
                                            },
                                            {
                                                name: '-s'  
                                            },
                                            {
                                                name: '--no-patch'  
                                            },
                                            {
                                                name: '--raw'  
                                            },
                                            {
                                                name: '--patch-with-raw'  
                                            },
                                            {
                                                name: '--indent-heuristic'  
                                            },
                                            {
                                                name: '--no-indent-heuristic'  
                                            },
                                            {
                                                name: '--minimal'  
                                            },
                                            {
                                                name: '--patience'  
                                            },
                                            {
                                                name: '--histogram'  
                                            },
                                            {
                                                name: '--diff-algorithm=patience'  
                                            },
                                            {
                                                name: '--diff-algorithm=minimal'  
                                            },
                                            {
                                                name: '--diff-algorithm=myers'  
                                            },
                                            {
                                                name: '--diff-algorithm=histogram'  
                                            },
                                            {
                                                name: '--compact-summary'  
                                            },
                                            {
                                                name: '--numstat'  
                                            },
                                            {
                                                name: '--shortstat'  
                                            },
                                            {
                                                name: '--cumulative'  
                                            },
                                            {
                                                name: '--patch-with-stat'  
                                            },
                                            {
                                                name: '-z'  
                                            },
                                            {
                                                name: '--name-only'  
                                            },
                                            {
                                                name: '--name-status'  
                                            },
                                            ],
                                        }
                                        ])
                                            .then(answers => {
                                            console.log(answers.options);
                                            
                                            for (var i=0; i<answers.options.length;i ++){
                                                result8 = result8 + answers.options[i] + " ";
                                            }
                                    
                                            var result9 = "";
                                            inquirer
                                            .prompt([
                                            {
                                                type: 'checkbox',
                                                message: 'Select command line options',
                                                name: 'options',
                                                pageSize: '100',
                                                choices: [
                                                new inquirer.Separator('9/9 - COMMON DIFF OPTIONS part 2: '),
                                                {
                                                    name: '--color=always'  
                                                },
                                                {
                                                    name: '--color=never'  
                                                },
                                                {
                                                    name: '--color=auto'  
                                                },
                                                {
                                                    name: '--no-color'  
                                                },
                                                {
                                                    name: '--color-moved=no'  
                                                },
                                                {
                                                    name: '--color-moved=default'  
                                                },
                                                {
                                                    name: '--color-moved=default'  
                                                },
                                                {
                                                    name: '--color-moved=plain'  
                                                },
                                                {
                                                    name: '--color-moved=blocks'  
                                                },
                                                {
                                                    name: '--color-moved=zebra'  
                                                },
                                                {
                                                    name: '--color-moved=dimmed-zebra'  
                                                },
                                                {
                                                    name: '--no-color-moved'  
                                                },
                                                {
                                                    name: '--color-moved-ws=no'  
                                                },
                                                {
                                                    name: '--color-moved-ws=ignore-space-at-eol'  
                                                },
                                                {
                                                    name: '--color-moved-ws=ignore-space-change'  
                                                },
                                                {
                                                    name: '--color-moved-ws=ignore-all-space'  
                                                },
                                                {
                                                    name: '--color-moved-ws=allow-indentation-change'  
                                                },
                                                {
                                                    name: '--no-color-moved-ws'  
                                                },
                                                {
                                                    name: '--word-diff=color'  
                                                },
                                                {
                                                    name: '--word-diff=plain'  
                                                },
                                                {
                                                    name: '--word-diff=porcelain'  
                                                },
                                                {
                                                    name: '--word-diff=none'  
                                                },
                                                {
                                                    name: '--no-renames'  
                                                },
                                                {
                                                    name: '--check'  
                                                },
                                                {
                                                    name: '--full-index'  
                                                },
                                                {
                                                    name: '--binary'  
                                                },
                                                {
                                                    name: '--pickaxe-all'  
                                                },
                                                {
                                                    name: '--text'  
                                                },
                                                {
                                                    name: '--ignore-cr-at-eol'  
                                                },
                                                {
                                                    name: '--ignore-space-at-eol'  
                                                },
                                                {
                                                    name: '--ignore-space-change'  
                                                },
                                                {
                                                    name: '--ignore-all-space'  
                                                },
                                                {
                                                    name: '--ignore-blank-lines'  
                                                },
                                                {
                                                    name: '--function-context'  
                                                },
                                                {
                                                    name: '--ext-diff'  
                                                },
                                                {
                                                    name: '--no-ext-diff'  
                                                },
                                                {
                                                    name: '--textconv'  
                                                },
                                                {
                                                    name: '--no-textconv'  
                                                },
                                                {
                                                    name: '--no-prefix'  
                                                },
                                                {
                                                    name: '--ita-invisible-in-index'  
                                                },
                                                ],
                                            }
                                            ])
                                                .then(answers => {
                                                console.log(answers.options);
                                                
                                                for (var i=0; i<answers.options.length;i ++){
                                                    result8 = result8 + answers.options[i] + " ";
                                                }
                                        
                                                // console.log('git log ' + result);
                                                // console.log(result1 + result2);
                                                // functions.MakeTerminalCallFromMenuName('git log ' + result1 + result2);
                                        
                                                console.log(result1 + result2 + result3 + result4 + result5 + result6 + result7 + result8 + result9);

                                                functions.MakeTerminalCallFromMenuName('git log ' + result1 + result2 + result3 + result4 + result5 + result6 + result7 + result8 + result9);
                                                
                                        
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
    }
}