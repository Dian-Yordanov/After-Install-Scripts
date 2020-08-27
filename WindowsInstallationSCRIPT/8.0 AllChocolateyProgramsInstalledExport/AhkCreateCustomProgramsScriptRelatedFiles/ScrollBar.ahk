/*
Title: ScrollBar (v0.4 April 7, 2014)

Introduction
------------

	'ScrollBar' monitors windows with the context-sensitive Hotkeys #IfWinActive and #If.
	
	Some keys can be used in all circumstances (dedicated to the 'ScrollBarGroup') while
	the other keys are dependent of the context. Indeed, if a Gui control (Edit, ListView,
	ListTree, ...) has a scrollbar, the corresponding keys will be inactive for the Gui,
	but remain active for the Gui control.
	
	- Tab, Shift+Tab, PgUp, PgDn, Ctrl+PgUp, Ctrl+PgDn, Alt+Home and Alt+End apply to the
	ScrollBar Group.
	
	- WheelUp, WheelDown, Shift+WheelUp, Shift+WheelDown, Ctrl+Home and Ctrl+End are
	dependent of the context.
	
Compatibility
-------------

   This script was designed to run on AutoHotkey v1.1.12+ ANSI and Unicode (32 and 64-bit),
	on Windows XP+.

Links
-----

   About Messages and Message Queues
	- <http://msdn.microsoft.com/en-us/library/windows/desktop/ms644927%28v=vs.85%29.aspx>
	Scroll Bar
	- <http://msdn.microsoft.com/en-us/library/windows/desktop/bb787529%28v=vs.85%29.aspx>
	Windows
	- <http://msdn.microsoft.com/en-us/library/windows/desktop/ms632595%28v=vs.85%29.aspx>
	Font and Text Reference
   - <http://msdn.microsoft.com/en-us/library/windows/desktop/dd144819%28v=vs.85%29.aspx>

Credit
------

	This developpment is based on the Lexikos solution posted in the forum under the topic
	"Scrollable Gui - Proof of Concept".

How to used it
--------------
	
	The script is launched and stopped by Client scripts that use the 'GuiScrollBarClass'.

Changes
-------
	
	0.4
	---
	Change the path of the #Include for ScrollBar_h.ahk, the error message array.
	
	0.2
	---
	ControlFocus issue with tablulation fixed.
	
	0.1
	---
	Apply Alt+Home and Alt+End on the horizontal scroll bar, instead of the vertical scroll bar
	Apply Ctrl+Home and Ctrl+End on the vertical scroll bar, instead of the horizontal scroll bar
	Alt+Home, Alt+End are not anymore dependent of the context

Author
------

	JPV alias Oldman
*/

#SingleInstance ignore
#NoEnv            ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input    ; Recommended for new scripts due to its superior speed and reliability.
SetBatchLines, -1
SetFormat, IntegerFast, D
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
Critical

#Include <Stddef.1.1.12.0>
#Include %A_ScriptDir%\ScrollBar_h.ahk
#Include <__MessageLib>

TraceLevel=0

; Message constants
global WM_NULL=0x0, WM_CLOSE=0x10, WM_QUIT=0x12, WM_COPYDATA=0x4a
global WM_HSCROLL=0x114, WM_VSCROLL=0x115

; Message constants - Scroll Bar notifications
global SB_LINEUP=0, SB_LINEDOWN=1, SB_PAGEUP=2, SB_PAGEDOWN=3, SB_TOP=6, SB_BOTTOM=7
global SB_LINELEFT=0, SB_LINERIGHT=1, SB_PAGELEFT=2, SB_PAGERIGHT=3, SB_LEFT=6, SB_RIGHT=7
global SB_THUMBTRACK=5

; Window style constants
global WS_TABSTOP=0x10000, WS_HSCROLL=0x100000, WS_VSCROLL=0x200000

; Program constants
global SB_SCROLL_FAST=1, SB_SCROLL_NORMAL=2, SB_SCROLL_SLOW=3, SB_SCROLL_VERY_SLOW=4

;--------
; Arrays
;--------
global Enum_GuiTitle       := {}
global Enum_FontSize       := {}
global Enum_GuiMarginX     := {}
global Enum_GuiMarginY     := {}
global Enum_ScrollBarSpeed := {}
global Enum_ScrollPitchX   := {}
global Enum_ScrollPitchY   := {}

OnMessage(WM_NULL, "OnNull")
OnMessage(WM_COPYDATA, "StartContextSensitiveRule")
OnMessage(WM_CLOSE, "StopContextSensitiveRule")
OnMessage(WM_QUIT, "QuitProgram")
return

#IfWinActive ahk_group ScrollBarGroup
Tab::Tabulation()
+Tab::Tabulation()															; Shift+Tab
PgUp::SendMessage, WM_VSCROLL, SB_PAGEUP, 0,, A
PgDn::SendMessage, WM_VSCROLL, SB_PAGEDOWN, 0,, A
^PgUp::SendMessage, WM_HSCROLL, SB_PAGELEFT, 0,, A					; Ctrl+PgUp
^PgDn::SendMessage, WM_HSCROLL, SB_PAGERIGHT, 0,, A				; Ctrl+PgDn
!Home::SendMessage, WM_HSCROLL, SB_TOP, 0,, A						; Alt+Home
!End::SendMessage, WM_HSCROLL, SB_BOTTOM, 0,, A						; Alt+End
#IfWinActive

#If, IsScrollable(Pitch)
WheelUp::SendMessage, WM_VSCROLL, SB_LINEUP, Pitch,, A
WheelDown::SendMessage, WM_VSCROLL, SB_LINEDOWN, Pitch,, A
+WheelUp::SendMessage, WM_HSCROLL, SB_LINELEFT, Pitch,, A		; Shift+WheelUp
+WheelDown::SendMessage, WM_HSCROLL, SB_LINERIGHT, Pitch,, A	; Shift+WheelDown
^Home::SendMessage, WM_VSCROLL, SB_TOP, 0,, A						; Ctrl+Home
^End::SendMessage, WM_VSCROLL, SB_BOTTOM, 0,, A						; Ctrl+End
#If

OnNull()
{
	SendTrace(A_ThisFunc, "System message WM_NULL has been received")
	return 1
}

StartContextSensitiveRule(_wParam, _lParam)
{
	SendTrace(A_ThisFunc, "START", "wParam:" _wParam, "lParam:" _lParam)
	
	pointer        := NumGet(_lParam+A_PtrSize+4, Ptr)
	guiTitle       := StrGet(pointer+8)
	fontSize       := NumGet(pointer+0, "Int")
	scrollBarSpeed := NumGet(pointer+4, "Int")
	
	guiMarginX     := Floor(fontSize * 1.25)
	guiMarginY     := Floor(fontSize * 0.75)
	
	GetScrollBarPitches(scrollPitchX, scrollPitchY, scrollBarSpeed, guiMarginX, guiMarginY)
	
	SendTrace(A_ThisFunc, "Fontsize:" fontSize " MarginX:" guiMarginX
							  . " MarginY:" guiMarginY " ScroolBarSpeed:" scrollBarSpeed
							  . " ScrollPitchX:" scrollPitchX " ScrollPitchY:" scrollPitchY
							  . " Gui titel:" guiTitle)
	
	if !Enum_GuiTitle.HasKey(_wParam)
		GroupAdd, ScrollBarGroup, % "ahk_id " _wParam
	
	;-----------------------------------------
	; add/update the arrays with the Gui info
	;-----------------------------------------
	Enum_GuiTitle[_wParam]       := guiTitle
	Enum_FontSize[_wParam]       := fontSize
	Enum_GuiMarginX[_wParam]     := guiMarginX
	Enum_GuiMarginY[_wParam]     := guiMarginY
	Enum_ScrollBarSpeed[_wParam] := scrollBarSpeed
	Enum_ScrollPitchX[_wParam]   := scrollPitchX
	Enum_ScrollPitchY[_wParam]   := scrollPitchY
	
	if (TraceLevel >= 2)
	{
		SendTrace(A_ThisFunc, "Handle FntSize MargX MargY Speed PitchX PitchY Title")
		SendTrace(A_ThisFunc, "-------------------------------------------------------------------")
		for handle, title in Enum_GuiTitle
			SendTrace(A_ThisFunc, handle "   " Enum_FontSize[handle] "     " Enum_GuiMarginX[handle]
									  . "     " Enum_GuiMarginY[handle] "     " Enum_ScrollBarSpeed[handle]
									  . "     " Enum_ScrollPitchX[handle] "    "
									  . Enum_scrollPitchY[handle] "    " title)
	}
		
	SendTrace(A_ThisFunc, "END")
	return 1
}

StopContextSensitiveRule(_wParam)
{
	SendTrace(A_ThisFunc, "START", "wParam:" _wParam)
	
	if !Enum_FontSize.HasKey(_wParam)
	{
		;----------------------------------------
		; Normally this case should never happen
		;----------------------------------------
		ShowProgramMessage(A_ThisFunc, 16, 1021, _wParam)
		
		SendTrace(A_ThisFunc, "Handle FntSize MargX MargY Speed PitchX PitchY Title")
		SendTrace(A_ThisFunc, "-------------------------------------------------------------------")
		for handle, fontsize in Enum_FontSize
			SendTrace(A_ThisFunc, handle "   " fontsize "     " Enum_GuiMarginX[handle]
									  . "     " Enum_GuiMarginY[handle] "     " Enum_ScrollBarSpeed[handle]
									  . "     " Enum_ScrollPitchX[handle] "    "
									  . Enum_scrollPitchY[handle] "    " Enum_GuiTitle[handle])
		
		return 2
	}
	
	;--------------------------------------------------------------
	; remove the handle in all the arrays except the Enum_GuiTitle
	;--------------------------------------------------------------
	Enum_FontSize.Remove(_wParam, "")
	Enum_GuiMarginX.Remove(_wParam, "")
	Enum_GuiMarginY.Remove(_wParam, "")
	Enum_ScrollBarSpeed.Remove(_wParam, "")
	Enum_ScrollPitchX.Remove(_wParam, "")
	Enum_ScrollPitchY.Remove(_wParam, "")
	
	if (TraceLevel >= 2)
	{
		SendTrace(A_ThisFunc, "Handle FntSize MargX MargY Speed PitchX PitchY Title")
		SendTrace(A_ThisFunc, "-------------------------------------------------------------------")
		for handle, fontsize in Enum_FontSize
			SendTrace(A_ThisFunc, handle "   " fontsize "     " Enum_GuiMarginX[handle]
									  . "     " Enum_GuiMarginY[handle] "     " Enum_ScrollBarSpeed[handle]
									  . "     " Enum_ScrollPitchX[handle] "    "
									  . Enum_scrollPitchY[handle] "    " Enum_GuiTitle[handle])
	}
	
	SendTrace(A_ThisFunc, "END - removed handle:" _wParam, "max index:" Enum_FontSize.MaxIndex())
	return 1
}

QuitProgram()
{
	SendTrace(A_ThisFunc, "START - max index:" Enum_FontSize.MaxIndex())
	
	;---------------------------------------------------------------
	; if the GuiFontSize array is not empty, do not exit the script
	;---------------------------------------------------------------
	if Enum_FontSize.MaxIndex()
		return 0
	
	Enum_GuiTitle       := ""
	Enum_FontSize       := ""
	Enum_GuiMarginX     := ""
	Enum_GuiMarginY     := ""
	Enum_ScrollBarSpeed := ""
	Enum_ScrollPitchX   := ""
	Enum_ScrollPitchY   := ""
	
	SendTrace(A_ThisFunc, "Exit")
	
	;------------------------------------------------------------------------------------
	; If a monitor function uses Return without any parameters, or it specifies a blank
	; value such as "" (or it never uses Return at all), the incoming message goes on to
	; be processed normally when the function finishes. 	
	;------------------------------------------------------------------------------------
	return
}

IsScrollable(ByRef _pitch)
{
	hGui := WinExist("A")
	
	if (TraceLevel >= 2)
		;------------------------------------------
		; hGui+0 --> converts from Hexa to Decimal
		;------------------------------------------
		SendTrace(A_ThisFunc, A_ThisHotkey, "hGui:" hGui " - " hGui+0)
	
	if !Enum_FontSize.HasKey(hGui)
		return false
	
	if (A_ThisHotkey = "WheelUp" or A_ThisHotkey = "WheelDown")
	{
		_pitch := Enum_ScrollPitchY[hGui]
		
		;-----------------------------------------------------------
		; if the control has a Vertical scroll bar --> return false
		;-----------------------------------------------------------
		ControlGetFocus, controlFocus, A
		ControlGet, ControlFocusStyle, Style,, %controlFocus%, A
		
		if (ControlFocusStyle & WS_VSCROLL)
			return false
		
		if (TraceLevel >= 2)
			SendTrace(A_ThisFunc, A_ThisHotkey, "PitchY:" _pitch)
		
		return true
	}
	
	else if (A_ThisHotkey = "+WheelUp" or A_ThisHotkey = "+WheelDown")
	{
		_pitch := Enum_ScrollPitchX[hGui]
		
		;-------------------------------------------------------------
		; if the control has a Horizontal scroll bar --> return false
		;-------------------------------------------------------------
		ControlGetFocus, controlFocus, A
		ControlGet, ControlFocusStyle, Style,, %controlFocus%, A
		
		if (ControlFocusStyle & WS_HSCROLL)
			return false
		
		if (TraceLevel >= 2)
			SendTrace(A_ThisFunc, A_ThisHotkey, "PitchX:" _pitch)
		
		return true
	}
	
	else if (A_ThisHotkey = "^Home" or A_ThisHotkey = "^End")
	{
		;-----------------------------------------------------------
		; if the control has a Vertical scroll bar --> return false
		;-----------------------------------------------------------
		ControlGetFocus, controlFocus, A
		ControlGet, ControlFocusStyle, Style,, %controlFocus%, A
		
		if (ControlFocusStyle & WS_VSCROLL)
			return false
		
		if TraceLevel
			SendTrace(A_ThisFunc, A_ThisHotkey)
		
		return true
	}
	
	if TraceLevel
		SendTrace(A_ThisFunc, A_ThisHotkey, "Error the HotKey is not a dependent key")
	
	return false
}

Tabulation()
{
	hGui := WinExist("A")
	
	if (TraceLevel >= 2)
		;------------------------------------------
		; hGui+0 --> converts from Hexa to Decimal
		;------------------------------------------
		SendTrace(A_ThisFunc, A_ThisHotkey, "hGui:" hGui " - " hGui+0)
	
	if !GetWindowInfo(hGui, windowLeft, windowTop, windowRight, windowBottom
								 , clientLeft, clientTop, clientRight, clientBottom)
	{
		ShowProgramMessage(A_ThisFunc, 16, 1011, A_LastError)
		return
	}
	
	left   := clientLeft - windowLeft
	top    := clientTop - windowTop
	width  := clientRight - clientLeft
	height := clientBottom - clientTop
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, A_ThisHotkey, "Left:" left " Top:" top " Width:" width
													 . " Height:" height)
	
	;-----------------------------------
	; skip to the next/previous control
	;-----------------------------------
	ControlGetFocus, controlFocus, ahk_id %hGui%
	
	if !controlName := (A_ThisHotkey = "TAB") ? GetNextControl(controlFocus)
															: GetPrevControl(controlFocus)
	{
		ride := (A_ThisHotkey = "Tab") ? "next" : "previous"
		ShowProgramMessage(A_ThisFunc, 16, 1022, ride, controlFocus)
		return
	}
	
	marginX     := Enum_GuiMarginX[hGui]
	marginY     := Enum_GuiMarginY[hGui]
	scrollSpeed := Enum_ScrollBarSpeed[hGui]
	pitchX      := Enum_ScrollPitchX[hGui]
	pitchY      := Enum_ScrollPitchY[hGui]
	
	ControlGetPos, cX, cY, cW, cH, %controlName%, ahk_id %hGui%
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, A_ThisHotkey, controlName " cX:" cX " cY:" cY " cW:" cW " cH:" cH)
	
	cX -= left
	cY -= top
	X := Y := 0
	
	;----------------------------------------------------
	; calculate the X shift to the next/previous control
	;----------------------------------------------------
	if (cX < marginX)
		X := cX - marginX
	
	else if (cX + cW > width - marginX)
	{
		if (cW < width - 2 * marginX)
			X := (cX + cW) - (width - marginX)
		else
			X := cX - marginX
	}
	
	;----------------------------------------------------
	; calculate the Y shift to the next/previous control
	;----------------------------------------------------
	if (cY < marginY)
		Y := cY - marginY
	
	else if (cY + cH > height - marginY)
	{
		if (cH < height - 2 * marginY)
			Y := (cY + cH) - (height - marginY)
		else
			Y := cY - marginY
	}
	
	if TraceLevel
		SendTrace(A_ThisFunc, A_ThisHotkey, controlName " X:" X " Y:" Y
									. " scrollSpeed:" scrollSpeed
									. " PitchX:" pitchX " PitchY:" pitchY)
	
	if X
	{
		action := (X < 0) ? SB_LINELEFT : SB_LINERIGHT
		
		if (X < 0)
			X := -X
		
		if (scrollSpeed = SB_SCROLL_FAST)
			i := 1
		else
		{
			i := X // pitchX
			X := pitchX
		}
		
		;----------------------------------------------------------------------------------------
		; notice X is used as a 'lParam' which normally should be NULL for a standard scroll bar
		;----------------------------------------------------------------------------------------
		Loop, %i%
			SendMessage, WM_HSCROLL, action, X,, ahk_id %hGui%
		
		if TraceLevel
			SendTrace(A_ThisFunc, A_ThisHotkey, controlName " action:" action " i:" i " X:" X)
	}
	
	if Y
	{
		action := (Y < 0) ? SB_LINEUP : SB_LINEDOWN
		
		if (Y < 0)
			Y := -Y
		
		if (scrollSpeed = SB_SCROLL_FAST)
			i := 1
		else
		{
			i := Y // pitchY
			Y := pitchY
		}
		
		;----------------------------------------------------------------------------------------
		; notice Y is used as a 'lParam' which normally should be NULL for a standard scroll bar
		;----------------------------------------------------------------------------------------
		Loop, %i%
			SendMessage, WM_VSCROLL, action, Y,, ahk_id %hGui%
		
		if TraceLevel
			SendTrace(A_ThisFunc, A_ThisHotkey, controlName " action:" action " i:" i " Y:" Y)
	}
	
	;------------------------------------------------------
	; ControlFocus on a pushbutton does not work very well
	; The solution was so obvious that I couldn't see it
	;------------------------------------------------------
;	ControlFocus, %controlName%, ahk_id %hGui%
	ThisHotKey := (A_ThisHotkey = "Tab") ? "{Tab}" : "+{Tab}"
	SendInput, %ThisHotKey%
	
	SendTrace(A_ThisFunc, A_ThisHotkey, controlName " has Focus " controlHwnd)
	return
}

GetNextControl(ByRef _controlName)
{
	if TraceLevel
		SendTrace(A_ThisFunc, _controlName)
		
	WinGet, controlList, ControlList, A
	
	isFound := false
	
	Loop, Parse, controlList, `n
	{
		if isFound
		{
			ControlGet, controlStyle, Style,, %A_loopField%, A
			
			if (controlStyle & WS_TABSTOP)
				return A_LoopField
		}
		else
			if (A_LoopField = _controlName)
				isFound := true
	}
	
	if isFound
	{
		;--------------------------------------------------------------------------------
		; the control is found but it is the last control --> look for the first control
		;--------------------------------------------------------------------------------
		Loop, Parse, controlList, `n
		{
			ControlGet, controlStyle, Style,, %A_loopField%, A
			
			if (controlStyle & WS_TABSTOP)
				return A_LoopField
		}
	}
	
	return ""
}

GetPrevControl(ByRef _controlName)
{
	if TraceLevel
		SendTrace(A_ThisFunc, _controlName)
		
	WinGet, controlList, ControlList, A
	
	prevControlName1 := prevControlName2 := ""
	
	Loop, Parse, controlList, `n
	{
		if (A_LoopField = _controlName)
			break
		
		ControlGet, prevControlStyle, Style,, %A_loopField%, A
		
		if (prevControlStyle & WS_TABSTOP)
		{
			prevControlName2 := prevControlName1
			prevControlName1 := A_LoopField
		}
			
		if (TraceLevel >= 2)
			SendTrace(A_ThisFunc, A_LoopField, prevControlName1 " " prevControlStyle)
	}
	
	ControlGet, controlStyle, Style,, %_controlName%, A
	
	prevControlName := (controlStyle & WS_TABSTOP) ? prevControlName1 : prevControlName2
	
	if !prevControlName
	{
		;--------------------------------------------------------------------------------
		; the control is found but it is the first control --> look for the last control
		;--------------------------------------------------------------------------------
		Loop, Parse, controlList, `n
		{
			ControlGet, prevControlStyle, Style,, %A_loopField%, A
			
			if (prevControlStyle & WS_TABSTOP)
				prevControlName := A_LoopField
		}
	}
	
	return prevControlName
}
