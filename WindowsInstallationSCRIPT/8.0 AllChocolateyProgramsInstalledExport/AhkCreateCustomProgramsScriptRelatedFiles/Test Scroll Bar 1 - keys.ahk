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

TraceLevel=0

gosub, Initialization
gosub, Main
return

Main:
	if TraceLevel
		SendTrace(A_ThisLabel, "START")
	
	GuiTitle := "Test Scroll Bar 1 without navigation key"
	
;	Gui, Main:new, HwndMainHwnd, % GuiTitle
	Gui, Main:new, HwndMainHwnd +Resize, % GuiTitle
;	Gui, Main:new, HwndMainHwnd +Resize +%WS_HSCROLL% +%WS_VSCROLL%, % GuiTitle
;	Gui, Font, s10, Verdana

	Gui, Add, Edit, W100 X10 HwndEdit1Hwnd vEdit1, Text1
	Gui, Add, Edit, W300 X+5        vEdit2    , Text2
	Gui, Add, Text, W25  X10        vText1    , Text
	Gui, Add, Edit, W300 X+5 R5     vEdit3    , Text3 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
	Gui, Add, Edit, W300 X30        vEdit4    , Text4
	Gui, Add, Edit, W300 X25 R5     vEdit5    , Text5 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
	Gui, Add, Edit, W300 X20        vEdit6    , Text6
	Gui, Add, Edit, W300 X25 R5     vEdit7    , Text7 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
	Gui, Add, Edit, W300 X30        vEdit8    , Text8
	Gui, Add, UpDown, Range1-10     vUpDown1  , 5
	Gui, Add, Checkbox,             vCheckBox1, Yes or no ?
	Gui, Add, GroupBox, W200 H60              , Shipping
	Gui, Add, Radio, Xp+10 Yp+20    vRadio1   , Wait before shipping.
	Gui, Add, Radio,                vRadio2   , Do not Wait before shipping.
	Gui, Add, Text, W80 X25 Y+15              , Choice color 1
	Gui, Add, DDL,  W60 X+5         vDDL1     , Black|White|Red|Blue
	Gui, Add, Text, W80 X25                   , Choice color 2
	Gui, Add, ComboBox, W60 X+5     vComboBox1, Black|White|Red|Blue
	Gui, Add, Text, W80 X25                   , Choice color 3
	Gui, Add, ListBox, W60 X+5      vListBox1 , Black|White|Red|Blue
	Gui, Add, Link, X40                       , The <a href="http://ahkscript.org">link</a>
	Gui, Add, DateTime,             vDateTime1, LongDate
	Gui, Add, MonthCal, W-2         vCalendar1
	Gui, Add, Slider,               vSlider1  , 50
	Gui, Add, Edit, W200 X35 R5     vEdit9    , Text9 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
	Gui, Add, Edit, W300 X30        vEdit10   , Text10
	Gui, Add, Edit, W300 X35 R5     vEdit11   , Text11 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
	Gui, Add, Edit, W300 X30        vEdit12   , Text12
	Gui, Add, Edit, W300 X25 R5     vEdit13   , Text13 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl
;	Gui, Add, Edit, W300 X20        vEdit14   , Text14
;	Gui, Add, Edit, W300 X25 R5     vEdit15   , Text15 `na`nb`nc`nd`ne`nf`ng`nh`ni`nj`nk`nl

	Gui, Add, Button, H20 Default, &Nothing1
	Gui, Add, Button, H20 X+10   , &Nothing2
	Gui, Add, Button, H20 X+10   , &Cancel

	if !MainGui := new GuiScrollBarClass(MainHwnd)
;	if !MainGui := new GuiScrollBarClass(MainHwnd, 2)
;	if !MainGui := new GuiScrollBarClass(MainHwnd, Edit1Hwnd)
	{
		gosub, Termination
		ExitApp
	}
	
	if !MainGui.Show()							; centered
;	if !MainGui.Show("X50 Y30")				; X50, Y30 discarded ==> centered
;	if !MainGui.Show("X+50 Y+30 Center")	; Right 50, Down 30, Center discarded
;	if !MainGui.Show("W1920 H1200")			; screen emulatation 1920x1200
;	if !MainGui.Show("W1280 H1024")			; screen emulatation 1280x1024
;	if !MainGui.Show("W1200 H800")			; screen emulatation 1200x800
;	if !MainGui.Show("W1024 H768")			; screen emulatation 1024x768
;	if !MainGui.Show("W640 H480")				; screen emulatation 640x480
	{
		gosub, Termination
		ExitApp
	}
	
	return

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

MainButtonNothing1:
	Enum_ExStyle := {}
	
	WinGet, myControlList, ControlList, Test Scroll Bar 1 without navigation key
	
	Loop, Parse, myControlList, `n
	{
		ControlGet, ExStyle, ExStyle,, %A_LoopField%, Test Scroll Bar 1 without navigation key
		
		if ExStyle
			Enum_ExStyle[A_LoopField] := ExStyle
	}
	
	for controlName, ExStyle in Enum_ExStyle
		SendTrace(A_ThisLabel, controlName, ExStyle)
	
	if TraceLevel
		SendTrace(A_ThisLabel, name)
	
	return

MainButtonNothing2:
	GuiControlGet, name, Focus
	
	MsgBox, % "Nothing2 is launched - " name
	
	if TraceLevel
		SendTrace(A_ThisLabel, name)
	
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
