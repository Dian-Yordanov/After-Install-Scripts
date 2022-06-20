choco list -lo -r -y | % { "choco install " + $_.split('|')[0] + " -y" } > TempFile.txt
Get-Content TempFile.txt | Measure-Object -Line > TempFile2.txt
Get-Content TempFile2.txt -Tail 3 > TempFile3.txt

$numberOfLinesstring = % { Get-Content TempFile3.txt}


$regex = '(^\s+|\s+$)','' -replace '\s+',' ' # anything that's _not_ a-z or underscore
$numberOfLinesstring1 = $numberOfLinesstring -replace $regex, ''
$numberOfLinesstring1 = $numberOfLinesstring1.Trim() > TempFile4.txt

$numberOfLines = % { Get-Content TempFile4.txt -Wait -Head 1 }

$numberOfLinesinteger = [int]$numberOfLines - 7

# echo $numberOfLinesinteger
$x = % { Get-Content TempFile.txt -Tail $numberOfLinesinteger }
# echo $x
$x > Install.ps1 

Remove-Item TempFile.txt
Remove-Item TempFile2.txt
Remove-Item TempFile3.txt
Remove-Item TempFile4.txt