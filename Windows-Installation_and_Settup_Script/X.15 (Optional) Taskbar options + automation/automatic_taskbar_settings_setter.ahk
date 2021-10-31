#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

SendInput {Lwin}
sleep, 400
SendInput Taskbar location on screen
sleep, 1400
SendInput {Enter}
sleep, 700
SendInput {Space}
sleep, 300
SendInput {Up}
sleep, 300
SendInput {Up}
sleep, 300
SendInput {Space}