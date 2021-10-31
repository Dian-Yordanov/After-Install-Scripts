#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

Run, %A_ScriptDir%\AllScripts\automatic_taskbar_settings_setter.exe
Sleep, 10000
Run, %A_ScriptDir%\AllScripts\automatic_login_password_disable_settings_setter.exe
Sleep, 5000
Run, %A_ScriptDir%\AllScripts\automatic_remotedesktop__settings_setter.exe
Sleep, 5000
Run, %A_ScriptDir%\AllScripts\automatic_background_settings_setter.exe
Sleep, 7000
Run, %A_ScriptDir%\AllScripts\automatic_time_zone_settings_setter.exe

ExitApp