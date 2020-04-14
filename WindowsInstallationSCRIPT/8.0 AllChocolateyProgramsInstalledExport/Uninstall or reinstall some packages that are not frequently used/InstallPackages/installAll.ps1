$files = Get-ChildItem $pwd
$a = "installAll.ps1"
for ($i=0; $i -lt $files.Count; $i++) {
    $outfile = $files[$i]
   # echo "$outfile"
    if("$outfile" -eq "$a"){
     }else {
        &"$PSScriptroot\$outfile"
     }
}