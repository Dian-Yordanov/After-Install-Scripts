SetKeyDelay, 0, 0

; path = %A_ScriptDir%\RunThisToGetPackagesButManuallyRemoveHeaders.ps1
; string = Run, PowerShell.exe -Command "%path%", , Show

FileRead, string, %A_ScriptDir%\RunThisToGetPackagesButManuallyRemoveHeaders.ps1

Run, C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe
Sleep, 4000

clipboard = %string%
ControlSend,, {Enter},ahk_exe powershell.exe
Send ^v
Sleep, 1500
ControlSend,, {Enter},ahk_exe powershell.exe

Return