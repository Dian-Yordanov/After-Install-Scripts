#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.



myvar=
(
$menu = 'Open Windows PowerShell Here as Administrator'
$command = "$PSHOMEpowershell.exe -NoExit -NoProfile -Command ""Set-Location '%V'"""

'directory', 'directorybackground', 'drive' | ForEach-Object {
New-Item -Path "Registry::HKEY_CLASSES_ROOT$_shell" -Name runascommand -Force |
Set-ItemProperty -Name '(default)' -Value $command -PassThru |
Set-ItemProperty -Path {$_.PSParentPath} -Name '(default)' -Value $menu -PassThru |
Set-ItemProperty -Name HasLUAShield -Value ''
}
)

Run, powershell -NoExit -Command %myvar%