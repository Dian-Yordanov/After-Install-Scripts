/*
Title: GuiScrollBarClass (v0.4 April 7, 2014)

Introduction
------------

	'GuiScrollBarClass' enables to scroll a Gui when the Gui is greater than the window's
	client area.
	
	If you have designed a Gui for a large screen and you want to use it on a smaller
	screen (laptop or tablet), you can run out of space to view the whole Gui controls,
	except if you use the 'GuiScrollBarClass'.
	
	You can use it with or without keyboard and mouse wheel navigation.

	It can also be used to scroll a panel of images integrated in a Gui.
	
Compatibility
-------------

   This class was designed to run on AutoHotkey v1.1.12+ ANSI and Unicode (32 and 64-bit),
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

	This development is based on the Lexikos solution posted in the forum under the topic
	"Scrollable Gui - Proof of Concept".

How to used it
--------------

	The #Include has to be placed somewhere at the beginning of the script, because of the
	global constants.
	
	You can use it one of two ways :
	
	- ScrollBars without keyboard and mouse wheel navigation (use the thumbs to move the Gui)
		
		Instantiate the class for each Gui with the Gui handle as a parameter.
		Replace the "Gui, Show" command by the InstanceName.Show() method with no
		'ScrollBarSpeed' parameter.
		Call the UpdateScrollBars() method at the %GuiLabel%Size:.
		At the end, call the StopScrollBars() method and free the object.
	
	- ScrollBars with keyboard and mouse wheel navigation :
		
		Instantiate the class for each Gui with the Gui handle as a parameter.
		Replace the "Gui, Show" command by the InstanceName.Show() method with one of the
		'ScrollBarSpeed' parameter.
		Call the UpdateScrollBars() method at the %GuiLabel%Size:.
		At the end, call the StopScrollBars() method and free the object.
	
	All threads using the Class must be 'Critical' threads, because an instance of the
	class must be fully created before any interruption, such as the 'WM_SIZE' issued
	after a Gui, Show command.

Changes
-------
	
	0.4
	---
	When the "Scrollbar" script is compiled, "ScrollBar.exe" was not seen by the client script,
	due to an error in the ScrollBarTitle string.
	The Class launches AutoHotkey with the Built-in variable A_AhkPath, now.

Author
------

	JPV alias Oldman
*/

#Include <__GuiClass>

goto, GuiScrollBarClassNext

;========================================================================================
; At the end of the script, launch a request to stop the ScrollBar.exe/.ahk script.
;========================================================================================
QuitGuiScrollBarScript:
	if TraceLevel
		SendTrace(A_ThisLabel, "START")
	
	if GuiScrollBarClass.ProcessID
	{
		DetectHiddenWindows, On
		
		PostMessage, WM_QUIT, 0, 0,, % GuiScrollBarClass.ScrollBarTitle
		
		if ErrorLevel
			ShowProgramMessage(A_ThisLabel, 16, 1013, GuiScrollBarClass.ScrollBarTitle
													, ErrorLevel)
		
		DetectHiddenWindows, Off
	}
	
	if TraceLevel
		SendTrace(A_ThisLabel, "END")
		
	ExitApp

GuiScrollBarClassNext:

; Scroll Bar constants
global SB_HORZ=0, SB_VERT=1
global SIF_RANGE=1, SIF_PAGE=2, SIF_POS=4, SIF_DISABLENOSCROLL=8, SIF_TRACKPOS=0x10, SIF_ALL=0x17
global SW_SCROLLCHILDREN=1, SW_INVALIDATE=2, SW_ERASE=4

; Message constants
global WM_NULL=0x0, WM_CLOSE=0x10, WM_QUIT=0x12, WM_COPYDATA=0x4a
global WM_HSCROLL=0x114, WM_VSCROLL=0x115

; Message constants - Scroll Bar notifications
global SB_LINEUP=0, SB_LINEDOWN=1, SB_PAGEUP=2, SB_PAGEDOWN=3, SB_TOP=6, SB_BOTTOM=7
global SB_LINELEFT=0, SB_LINERIGHT=1, SB_PAGELEFT=2, SB_PAGERIGHT=3, SB_LEFT=6, SB_RIGHT=7
global SB_THUMBPOSITION=4, SB_THUMBTRACK=5, SB_ENDSCROLL=8

; Program constants
global SB_SCROLL_FAST=1, SB_SCROLL_NORMAL=2, SB_SCROLL_SLOW=3, SB_SCROLL_VERY_SLOW=4

class GuiScrollBarClass extends GuiClass
{
	;-------------------------------------------------------
	; To be changed to suite the needs of your installation
	;-------------------------------------------------------
	static ScrollBarDir := A_MyDocuments "\AutoHotkey\ScrollBar"
	static ScrollBarPath
	static ScrollBarProg
	static ScrollBarTitle
	
	static ProcessID      := 0
	static Enum_ScrollBar := {}

	IsNewScrollBar := true
	GuiTitle       := ""
	ScrollBarSpeed := 0
	PitchX         := 0
	PitchY         := 0
	
/*
	=========================================================================================
	InstanceName := new GuiScrollBarClass(hGui[, controlNumber=1])

		hGui          : Gui handle (in)
		controlNumber : the sequence number of a control or its handle that will be used
							 to identify the font size (in optional)
	
	Instantiates the GuiScrollBarClass.
	=========================================================================================
*/
	__New(_hGui, _controlNumber=1)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if !base.__New(_hGui, _controlNumber)
			return false
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return this
	}
	
/*
	=========================================================================================
	InstanceName.Show([options="", title="", scrollBarSpeed=0])
	
		options        : options of the Gui, Show command (in optional)
		title          : title of the Gui, Show command (in optional)
		scrollBarSpeed : used to set the speed of the scroll bars (in optional)
	
	Displays the Gui on the current monitor.
	========================================================================================
*/
	Show(_options="", _title="", _scrollBarSpeed=0)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if !base.Show(_options, _title)
			return false
		
		if this.SetScrollBars(_scrollBarSpeed)
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return this
	}
	
/*
	=========================================================================================
	InstanceName.UpdateScrollBars()
	
	Updates the 2 scroll bars after receiving a WM_SIZE message (LabelGuiSize:) and moves
	the content of the Client area when required.
	=========================================================================================
*/
	UpdateScrollBars()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START", A_Gui " " A_GuiWidth " " A_GuiHeight)
		
		if this.IsNewGui
			return true
		
		;----------------------
		; Get scroll bars info
		;----------------------
		if this.IsNewScrollBar
			nPosX := nPosY := 0
		else
		{
			if !this.GetScrollInfo(SB_HORZ, nMinX, nMaxX,, nPosX)
				return false
			
			if !this.GetScrollInfo(SB_VERT, nMinY, nMaxY,, nPosY)
				return false
		}
		
		if (this.IsNewScrollBar
		or this.GuiWidth <> nMaxX - nMinX + 1
		or this.GuiHeight <> nMaxY - nMinY + 1)
		{
			;-----------------------------------
			; Update Horizontal scroll bar info
			;-----------------------------------
			; 2 UINT + 2 INT + UINT + 2 UINT
			VarSetCapacity(scrollInfo, 28, 0)
			
			NumPut(28, scrollInfo, 0, "UInt") 										; cbSize
			NumPut(SIF_RANGE | SIF_PAGE | SIF_POS, scrollInfo, 4, "UInt")	; fMask
			
			nMinX := this.GuiLeft + nPosX
			nMaxX := this.GuiRight + nPosX - 1
			NumPut(nMinX, scrollInfo, 8, "Int")
			NumPut(nMaxX, scrollInfo, 12, "Int")
			NumPut(A_GuiWidth, scrollInfo, 16, "UInt")							; nPage
			NumPut(nPosX, scrollInfo, 20, "Int")
			
			newPosX := DllCall("user32.dll\SetScrollInfo", Ptr, this.GuiHwnd, "Int", SB_HORZ
																		, Ptr, &scrollInfo, "Int", true)
			
			;---------------------------------
			; Update Vertical scroll bar info
			;---------------------------------
			nMinY := this.GuiTop + nPosY
			nMaxY := this.GuiBottom + nPosY - 1
			NumPut(nMinY, scrollInfo, 8, "Int")
			NumPut(nMaxY, scrollInfo, 12, "Int")
			NumPut(A_GuiHeight, scrollInfo, 16, "UInt")							; nPage
			NumPut(nPosY, scrollInfo, 20, "Int")									; nPos
			
			newPosY := DllCall("user32.dll\SetScrollInfo", Ptr, this.GuiHwnd, "Int", SB_VERT
																		, Ptr, &scrollInfo, "Int", true)
			
			this.IsNewScrollBar := false
		}
		else
		{
			;-----------------------------------
			; Update Horizontal scroll bar info
			;-----------------------------------
			; 2 UINT + 2 INT + UINT + 2 UINT
			VarSetCapacity(scrollInfo, 28, 0)
			NumPut(28, scrollInfo, 0, "UInt") 										; cbSize
			NumPut(SIF_PAGE, scrollInfo, 4, "UInt")								; fMask
			
			NumPut(A_GuiWidth, scrollInfo, 16, "UInt")							; nPage
			
			newPosX := DllCall("user32.dll\SetScrollInfo", Ptr, this.GuiHwnd, "Int", SB_HORZ
																		, Ptr, &scrollInfo, "Int", true)
			
			;---------------------------------
			; Update Vertical scroll bar info
			;---------------------------------
			NumPut(A_GuiHeight, scrollInfo, 16, "UInt")							; nPage
			
			newPosY := DllCall("user32.dll\SetScrollInfo", Ptr, this.GuiHwnd, "Int", SB_VERT
																		, Ptr, &scrollInfo, "Int", true)
		}
			
		;---------------------------------------------------------
		; Scroll contents of window and invalidate uncovered area
		;---------------------------------------------------------
		X := nPosX - newPosX
		Y := nPosY - newPosY
		
		if (X or Y)
		{
			if !DllCall("user32.dll\ScrollWindowEx", Ptr, this.GuiHwnd, "Int", X, "Int", Y
																, Ptr, 0, Ptr, 0, Ptr, 0, Ptr, 0
											, "UInt", SW_SCROLLCHILDREN | SW_INVALIDATE | SW_ERASE)
			{
				ShowProgramMessage(A_ThisFunc, 16, 1016, A_LastError)
				return false
			}
		}
		
		if (TraceLevel >= 2)
		{
			SendTrace(A_ThisFunc, "nPosX:" nPosX " newPosX:" newPosX)
			SendTrace(A_ThisFunc, "nPosY:" nPosY " newPosY:" newPosY)
			SendTrace(A_ThisFunc, "X+" X, "Y+" Y)
		}
			
		if (TraceLevel >= 3)
		{
			if !this.GetScrollInfo(SB_HORZ)
				return false
			
			if !this.GetScrollInfo(SB_VERT)
				return false
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return true
	}
	
/*
	=========================================================================================
	InstanceName.StopScrollBars()
	
	Removes the Scroll Bars handle from the Class.
	=========================================================================================
*/
	StopScrollBars()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if GuiScrollBarClass.Enum_ScrollBar[this.GuiHwnd]
		{
			GuiScrollBarClass.Enum_ScrollBar.Remove(this.GuiHwnd, "")
			
			if TraceLevel
				SendTrace(A_ThisFunc, this.GuiHwnd, "has been removed")
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return
	}
	
/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
		scrollBarSpeed : used to set the speed of the scroll bars (in)
	
	Launches the ScrollBar.exe/.ahk script and advises it that a new window has to be
	monitored for the context-sensitive hotkeys #IfWinActive and #If.
	=========================================================================================
*/
	SetScrollBars(_scrollBarSpeed)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START", "scrollBarSpeed:" _scrollBarSpeed)
		
		if _scrollBarSpeed
		{
			if _scrollBarSpeed not between 1 and 4
			{
				ShowProgramMessage(A_ThisFunc, 16, 1014, _scrollBarSpeed)
				return false
			}
			
			if !this.LaunchScrollBarScript()
				return false
			
			WinGetTitle, windowTitle, A
			
			this.GuiTitle       := windowTitle
			this.ScrollBarSpeed := _scrollBarSpeed
			
			if TraceLevel
				SendTrace(A_ThisFunc, "GuiTitle:'" this.GuiTitle "'")
			
			GetScrollBarPitches(pitchX, pitchY, this.ScrollBarSpeed, this.GuiMarginX
											  , this.GuiMarginY)
			
			this.PitchX := pitchX
			this.PitchY := pitchY
			
			;---------------------------------------
			; 2 DWORD + (StrLen(title) + 1) * TCHAR
			;---------------------------------------
			copyDataStructSize := 8 + (StrLen(this.GuiTitle) + 1) * size_of_char
			VarSetCapacity(copyDataStruct, copyDataStructSize, 0)
			NumPut(this.FontSize, copyDataStruct, 0, "Int")
			NumPut(this.ScrollBarSpeed, copyDataStruct, 4, "Int")
			StrPut(this.Guititle, &copyDataStruct+8, Encoding)
			
			;---------------------------
			; ULONG_PTR + DWORD + PVOID
			;---------------------------
			copyDataSize := A_PtrSize + 4 + A_PtrSize
			VarSetCapacity(copyData, copyDataSize, 0)
			NumPut(copyDataStructSize, copyData, A_PtrSize, "UInt")
			NumPut(&copyDataStruct, copyData, A_PtrSize+4, Ptr)
			
			DetectHiddenWindows, On
			
			SendMessage, WM_COPYDATA, % this.GuiHwnd, &copyData,
						  , % GuiScrollBarClass.ScrollBarTitle
			
			if (ErrorLevel <> 1)
			{
				ShowProgramMessage(A_ThisFunc, 16, 1015, GuiScrollBarClass.ScrollBarTitle
													  , ErrorLevel, A_LastError)
				return false
			}
			
			ErrorLevel := 0
			DetectHiddenWindows, Off
		}
		
		if !GuiScrollBarClass.Enum_ScrollBar.MaxIndex()
		{
			OnMessage(WM_HSCROLL, "OnScroll")
			OnMessage(WM_VSCROLL, "OnScroll")
		}
		
		GuiScrollBarClass.Enum_ScrollBar[this.GuiHwnd] := this
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return true
	}
	
/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Launches the ScrollBar.exe/.ahk script.
	=========================================================================================
*/
	LaunchScrollBarScript()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if !this.ProcessID
		{
			if !this.GetProgramFullPath()
				return NULL
			
			;------------------------------------------------------------------------------------
			; the ScrollBar.exe (or ScrollBar.ahk) script can be launched from each client
			; script without problem, because it contains the '#SingleInstance ignore' directive.
			;------------------------------------------------------------------------------------
			Run, % GuiScrollBarClass.ScrollBarProg,, UseErrorLevel, processID
			
			if ErrorLevel
			{
				ShowProgramMessage(A_ThisFunc, 16, 1017, programFullPath, A_LastError)
				return NULL
			}
			
			DetectHiddenWindows, On
			
			WinWait, % GuiScrollBarClass.ScrollBarTitle,, 3
			
			if ErrorLevel
			{
				ShowProgramMessage(A_ThisFunc, 16, 1018, GuiScrollBarClass.ScrollBarTitle)
				return NULL
			}
			
			;-------------------------------------------------------------------------
			; sometimes the 'SendMessage' command needs more time to reach its target
			;-------------------------------------------------------------------------
			Loop
			{
				if (A_Index > 20)
					return NULL
				
				i := A_TickCount
				SendMessage, WM_NULL, 0, 0,, % GuiScrollBarClass.ScrollBarTitle,,,, 1000
				
				if TraceLevel
					SendTrace(A_ThisFunc, "Attempt WM_NULL:" A_Index
											  , "elapsed time:" A_TickCount - i "ms")
			} until (ErrorLevel = 1)
			
			ErrorLevel := 0
			DetectHiddenWindows, Off
			
			GuiScrollBarClass.ProcessID := processID
			
			OnExit, QuitGuiScrollBarScript
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return this
	}
	
/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Returns the path of the ScrollBar.exe/.ahk script.
	=========================================================================================
*/
	GetProgramFullPath()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		GuiScrollBarClass.ScrollBarPath := GuiScrollBarClass.ScrollBarDir
													. "\ScrollBar.exe"
		
		IfNotExist, % GuiScrollBarClass.ScrollBarPath
		{
			GuiScrollBarClass.ScrollBarPath := GuiScrollBarClass.ScrollBarDir
														. "\ScrollBar.ahk"
			
			IfNotExist, % GuiScrollBarClass.ScrollBarPath
			{
				ShowProgramMessage(A_ThisFunc, 16, 1001, GuiScrollBarClass.ScrollBarPath)
				return false
			}
			
			GuiScrollBarClass.ScrollBarProg := A_AhkPath " """ GuiScrollBarClass.ScrollBarPath
														. """"
		}
		else
			GuiScrollBarClass.ScrollBarProg := GuiScrollBarClass.ScrollBarPath
		
		GuiScrollBarClass.ScrollBarTitle := GuiScrollBarClass.ScrollBarPath
													.  " ahk_class AutoHotkey"
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END", _program)
		
		return true
	}

/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Returns scroll bar information.
	=========================================================================================
*/
	GetScrollInfo(_scrollBar, ByRef _nMin=0, ByRef _nMax=0, ByRef _nPage=0, ByRef _nPos=0
									, ByRef _nTrackPos=0)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		VarSetCapacity(scrollInfo, 28, 0)
		NumPut(28, scrollInfo, 0, "UInt") 			; cbSize
		NumPut(SIF_All, scrollInfo, 4, "UInt")		; fMask
		
		if !DllCall("user32.dll\GetScrollInfo", Ptr, this.GuiHwnd, "Int", _scrollBar
														  , Ptr, &scrollInfo)
		{
			ShowProgramMessage(A_ThisFunc, 16, 1019, "SIF_ALL", A_LastError)
			return false
		}
		
		_nMin      := NumGet(scrollInfo, 8, "Int")
		_nMax      := NumGet(scrollInfo, 12, "Int")
		_nPage     := NumGet(scrollInfo, 16, "UInt")
		_nPos      := NumGet(scrollInfo, 20, "Int")
		_nTrackPos := NumGet(scrollInfo, 24, "Int")
		
		if (TraceLevel >= 2)
		{
			if (_scrollBar = SB_HORZ)
				SendTrace(A_ThisFunc, "nMinX:" _nMin " nMaxX:" _nMax " nPageX:" _nPage
										  , "nPosX:" _nPos " nTrackPosX:" _nTrackPos)
			else
				SendTrace(A_ThisFunc, "nMinY:" _nMin " nMaxY:" _nMax " nPageY:" _nPage
										  , "nPosY:" _nPos " nTrackPosY:" _nTrackPos)
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return true
	}

/*
	=========================================================================================
	Requested when the instance is cleared
	=========================================================================================
*/
	__Delete()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if this.ProcessID
		{
			if this.GuiHwnd
			{
				if this.ScrollBarSpeed
				{
					;----------------------------------------------------------------------------
					; Stop the monitoring of the context-sensitive hotkeys #IfWinActive and #If.
					;----------------------------------------------------------------------------
					DetectHiddenWindows, On
					
					SendMessage, WM_CLOSE, this.GuiHwnd, 0,, % GuiScrollBarClass.ScrollBarTitle
					
					if (ErrorLevel <> 1)
					{
						ShowProgramMessage(A_ThisFunc, 16, 1020, this.TargetScriptTitlte, ErrorLevel)
						ErrorLevel := 0
						return false
					}
					
					ErrorLevel := 0
					DetectHiddenWindows, Off
					
					if !GuiScrollBarClass.Enum_ScrollBar.MaxIndex()
					{
						OnMessage(WM_HSCROLL, "")
						OnMessage(WM_VSCROLL, "")
					}
				}
			}
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return
	}
}

;========================================================================================
; Processes the WM_HSCROLL & WM_VSCROLL system messages
;========================================================================================
OnScroll(_wParam, _lParam, _msg, _hwnd)
{
	if TraceLevel
		SendTrace(A_ThisFunc, "START", _wParam " " _lParam " " _msg " " _hwnd)
	
	if !guiScrollBar := GuiScrollBarClass.Enum_ScrollBar[_hwnd]
		return false
	
	scrollbar := (_msg = WM_HSCROLL) ? SB_HORZ : SB_VERT
	
	;---------------------
	; Get scroll bar info
	;---------------------
	if !guiScrollBar.GetScrollInfo(scrollBar, nMin, nMax, nPage, nPos, nTrackPos)
		return false
	
	;--------------
	; Apply action
	;--------------
	action := _wParam & 0xFFFF
	newPos := nPos
	
	if (action = SB_LINEUP)									; or SB_LINELEFT
		newPos -= _lParam ? _lParam : (scrollBar = SB_HORZ ? guiScrollBar.PitchX
																			: guiScrollBar.PitchY)
	
	else if (action = SB_LINEDOWN)						; or SB_LINERIGHT
		newPos += _lParam ? _lParam : (scrollBar = SB_HORZ ? guiScrollBar.PitchX
																			: guiScrollBar.PitchY)
	
	else if (action = SB_PAGEUP)							; or SB_PAGELEFT
		newPos -= nPage
	
	else if (action = SB_PAGEDOWN)						; or SB_PAGERIGHT
		newPos += nPage
	
	else if (action = SB_THUMBTRACK)
		newPos := nTrackPos
	
	else if (action = SB_TOP)								; or SB_LEFT
		newPos := nMin
	
	else if (action = SB_BOTTOM)							; or SB_RIGHT
		newPos := nMax
	
	else
		return 0
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, "msg:" _msg " action:" action " nPos:" nPos " newPos:" newPos)
	
	;------------------------
	; Update scroll bar info
	;------------------------
	VarSetCapacity(scrollInfo, 28, 0)
	NumPut(28, scrollInfo, 0, "UInt") 					; cbSize
	NumPut(SIF_POS, scrollInfo, 4, "UInt")				; fMask
	NumPut(newPos, scrollInfo, 20, "Int")				; nPos
	
	newPos := DllCall("user32.dll\SetScrollInfo", Ptr, _hwnd, "Int", scrollbar
															  , Ptr, &scrollInfo, "Int", true)
	
	if (TraceLevel >= 3)
		if !guiScrollBar.GetScrollInfo(scrollBar)
			return false
	
	if (_msg = WM_HSCROLL)
	{
		X := nPos - newPos
		Y := 0
	}
	else
	{
		X := 0
		Y := nPos - newPos
	}
	
	;---------------------------------------------------------
	; Scroll contents of window and invalidate uncovered area
	;---------------------------------------------------------
	if (X or Y)
	{
		if !DllCall("user32.dll\ScrollWindowEx", Ptr, _hwnd, "Int", X, "Int", Y
															, Ptr, 0, Ptr, 0, Ptr, 0, Ptr, 0
												, "UInt", SW_SCROLLCHILDREN | SW_INVALIDATE | SW_ERASE)
		{
			ShowProgramMessage(A_ThisFunc, 16, 1016, A_LastError)
			return 1
		}
	}
	
	if TraceLevel
		SendTrace(A_ThisFunc, "END", "X:" X " Y:" Y)
		
	return 0
}
