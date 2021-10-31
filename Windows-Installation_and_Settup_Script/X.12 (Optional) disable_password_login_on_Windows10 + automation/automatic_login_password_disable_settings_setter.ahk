#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

SendInput {LWin down}r{LWin up}
sleep, 1000
SendInput netplwiz
sleep, 500
SendInput {Enter}
sleep, 2000
SendInput {Space}
sleep, 200
SendInput {Enter}
sleep, 500
SendInput {Space}
sleep, 100
SendInput {Tab}
sleep, 100
SendInput {Space}
sleep, 100
SendInput {Enter}