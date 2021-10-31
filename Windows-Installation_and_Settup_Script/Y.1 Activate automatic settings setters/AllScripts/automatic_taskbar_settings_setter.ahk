#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

SendInput {Lwin}
sleep, 100
SendInput Taskbar location on screen
sleep, 1000
SendInput {Enter}
sleep, 300
SendInput {Space}
sleep, 100
SendInput {Up}
sleep, 100
SendInput {Up}
sleep, 100
SendInput {Space}