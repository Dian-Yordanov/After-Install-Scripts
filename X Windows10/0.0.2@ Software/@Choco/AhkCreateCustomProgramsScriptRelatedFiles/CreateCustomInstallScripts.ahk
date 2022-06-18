/*
AutoHotkey Version: 1.1.13.01
Language:   English
Platform:   Windows XP
Author:     JPV alias Oldman <myemail@nowhere.com>

Script Function:
				Test Scroll Bar 1 without keyboard and wheel navigation
*/

#SingleInstance force
#NoEnv            ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input    ; Recommended for new scripts due to its superior speed and reliability.
SetBatchLines, -1
SetFormat, IntegerFast, D
SetWorkingDir, %A_ScriptDir%  ; Ensures a consistent starting directory.
;------------------------------------------------------------------------------
; Required to leave in the hands subroutine to finish before any interruption,
; especially the 'GuiSize' window events.
;------------------------------------------------------------------------------
Critical

#Include <Stddef.1.1.12.0>
#Include *i Test Scroll Bar 1 - keys_h.ahk
#Include <__MessageLib>
#Include <__GuiScrollBarClass>
#Include Class_ImageButton.ahk


TraceLevel=0

gosub, Initialization
gosub, Main
return

Main:
	if TraceLevel
		SendTrace(A_ThisLabel, "START")
	
	GuiTitle := "Test Scroll Bar 1 without navigation key"

	Gui, Main:new, HwndMainHwnd +Resize, % GuiTitle
    
	DBFileName3 := A_ScriptDir . "\Install.ps1"
	FileRead, OutputVar3, %DBFileName3%

	; Split := StrSplit(OutputVar3, ",")
	NewStr1 := StrReplace(OutputVar3, "choco install ", "")
	NewStr2 := StrReplace(NewStr1, " -y", "")

	Gui, Add, Button, gmark_all x50 W100 h48, Mark all
	Gui, Add, Button, gunmark_all xp+100 W100 h48, Unmark all
	; Gui, Add, Button, ggo xp+180 W100, Go


	Gui, Add, Button, vBT1 xp+180 w80 h48 hwndHBT1 ggo, Create new install script
	ButtonOpt1 := [0, 0x80FF6347, , "White", "6", , "White", 1]         ; normal flat background & text color
	ButtonOpt2 := [ , "0x80FF0000"]                                          ; hot flat background color
	ButtonOpt5 := [ , , ,"White"]                                      ; defaulted text color -> animation
	ImageButton.Create(HBT1, ButtonOpt1, ButtonOpt2, , , ButtonOpt5)


	global Options := StrSplit(NewStr2, "`n")
	global Options_minus_1 := Options.MaxIndex() - 1
	Loop, % Options_minus_1{
    Gui, Add, CheckBox, x50 vOpt%A_Index%, % Options[A_Index]
	; DDLString .= "|" Options[A_Index]
	}

	Gui, Add, Text, x0 W500,

	if !MainGui := new GuiScrollBarClass(MainHwnd)

	{
		gosub, Termination
		ExitApp
	}
	
	; if !MainGui.Show()
	if !MainGui.Show("")				; screen emulatation 640x480
	{
		gosub, Termination
		ExitApp
	}
	
return

mark_all:
Gui, Submit, NoHide ;this command submits the guis' datas' state
Loop, % Options_minus_1{
	GuiControl,, Opt%A_Index%, 1
}

return

unmark_all:
Gui, Submit, NoHide ;this command submits the guis' datas' state
Loop, % Options_minus_1{
	GuiControl,, Opt%A_Index%, 0
}
return

go:
Gui, Submit, NoHide ;this command submits the guis' datas' state

string_var := ""
Array := []

Loop, % Options_minus_1{

if(Opt%A_Index% == 1){
	string := Options[A_Index]
	options_string := StrReplace(string, "`r", "")
	options_string := StrReplace(options_string, "`n", "")
	string_var := string_var . "choco install " . options_string . " -y" . "`n"
}

}

file_name := "InstallCustomPrograms.ps1"
FileDelete %A_ScriptDir%\%file_name%
FileAppend, %string_var%, %A_ScriptDir%\%file_name%

Return

MainGuiClose:
MainGuiEscape:
MainButtonCancel:
	if TraceLevel
		SendTrace(A_ThisLabel)
	
	Gui, Main:Destroy
	
	gosub, Termination
	ExitApp

MainGuiSize:
	if TraceLevel
		SendTrace(A_ThisLabel)
	
	if !IsObject(MainGui)
		return
	
	if !MainGui.UpdateScrollBars()
	{
		gosub, Termination
		ExitApp
	}
		
	return

Initialization:
	; Window style constants
	global WS_HSCROLL=0x100000, WS_VSCROLL=0x200000
	
	return

Termination:
	;----------------------------------------------------------------------------
	; Required to free the object
	;----------------------------------------------------------------------------
	if IsObject(MainGui)
		MainGui.StopScrollBars()
	
	MainGui := ""
	return
