#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

Run, %A_ScriptDir%\0.exe
Sleep, 1000
Run, %A_ScriptDir%\1.exe
Sleep, 1000
Run, %A_ScriptDir%\2.exe
Sleep, 1000
Run, %A_ScriptDir%\3.exe
Sleep, 1000
Run, %A_ScriptDir%\4.exe
Sleep, 1000
Run, %A_ScriptDir%\5.exe
Sleep, 1000
Run, %A_ScriptDir%\6.exe
Sleep, 1000
Run, %A_ScriptDir%\8.exe

ExitApp