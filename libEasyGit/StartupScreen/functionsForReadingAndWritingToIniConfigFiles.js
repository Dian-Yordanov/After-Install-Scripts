var fs = require("fs");

var WriteToFile = function (strToWrite, attribute, fileName) 
{
  var contents = fs.readFileSync(fileName, 'utf8');
  var i=0;
  var outpuContents;

  contents = removeDuplicateLines(contents);

  if(contents.includes(attribute)){
    var fileSplitedByLines = contents.split('\n');
    fileSplitedByLines.forEach(function(entry) {
      if(entry.includes(attribute))
        {
          if(entry.split('=')[0] === attribute && entry.includes(attribute + '=')){
            outpuContents = 'the attribute exists and is defined correctly. and it is at possition ' + i; 
            console.log(outpuContents);

            var entry2 = entry.split('=')[0] + '=' + strToWrite;
            contents = contents.replace(entry,entry2);
            // contents = contents + '\n';
          }
          else{
            outpuContents = 'attribute may not have been defined correctly.'
            console.log(outpuContents);
          }
        }
        i++;
    });
  }
  else{
    outpuContents = 'the attribute does not exists.'
    console.log(outpuContents);

    contents = contents + '\n' + attribute + "=" + strToWrite

  }

  console.log(contents);

  fs.writeFileSync(fileName, contents, (err) => {
    if (err) console.log(err);
  });

}

var ReadFromFile = function (attribute, fileName) 
{
  var contents = fs.readFileSync(fileName, 'utf8');

  if(contents.includes(attribute)){
    var fileSplitedByLines = contents.split('\n');
    fileSplitedByLines.forEach(function(entry) {
      if(entry.includes(attribute))
        {
          contents = entry.split('=')[1];
        }
    });
  }
  else{
    contents = 'the attribute does not exists.'
  }

  return contents;
}

var removeDuplicateLines = function(str){
  var pieces = str.split("\n"); //This will split your string
  var output = []; //Output array

  for (var i = 0; i < pieces.length; i++) { //Iterate over input...

    if (pieces[i] == '<BR>' || output.indexOf(pieces[i]) < 0) { //If it is <BR> or not in output, add to output
        output.push(pieces[i]);
    }

  }

  return newS = output.join("\n"); //Concatenates the string back, you don't have to do this if you want your lines in the array
}


module.exports = {
    WriteToFile: WriteToFile,
    ReadFromFile: ReadFromFile
  }

// module.exports.WriteToFile('14','lenght','easyGitConfig.ini');
// console.log(String(module.exports.ReadFromFile('size','easyGitConfig.ini')));

// console.log(module.exports.ReadFromFile('gitStatusTypeSimpleFilesTracking','easyGitStatusVisualisationType.ini'));
