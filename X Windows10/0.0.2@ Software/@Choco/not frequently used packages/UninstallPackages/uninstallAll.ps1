$files = Get-ChildItem $pwd
$a = "uninstallAll.ps1"
for ($i=0; $i -lt $files.Count; $i++) {
    $outfile = $files[$i]
   # echo "$outfile"
    if("$outfile" -eq "$a"){
     }else {
        &"$PSScriptroot\$outfile"
     }
}