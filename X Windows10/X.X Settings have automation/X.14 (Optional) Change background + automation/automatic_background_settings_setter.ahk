#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

Run, ms-settings:personalization-background
sleep, 2000
SendInput {Tab}
sleep, 500
SendInput {Space}
sleep, 500
SendInput {Down}
sleep, 500
SendInput {Space}
