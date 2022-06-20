/*
Title: GetWindowInfo (v0.0 December 16, 2013)

Introduction
------------

	Get Window info.
		. window coordinates
		. window client area coordinates
		. width and height of window borders
		. window style
	
Compatibility
-------------

   No limitation.

Links
-----

Credit
------

How to used it
--------------

	hGui			  : handle of the Gui (in)
	winLeft		  : left position of the window (out)
	winTop		  : top position of the window (out)
	winRight		  : right position of the window (out)
	winBottom	  : bottom posiiton of the window (out)
	cliLeft		  : left position of the client area (out)
	cliTop		  : top position of the client area (out)
	cliRight		  : right position of the client area (out)
	cliBottom	  : bottom position of the client area (out)
	xWindowBorder : width of the window border (out)
	yWindowBorder : height of the window border (out)
	winStyle		  : window style (out)

Author
------

	JPV alias Oldman
*/

GetWindowInfo(_hGui
				, ByRef _winLeft=0, ByRef _winTop=0, ByRef _winRight=0, ByRef _winBottom=0
				, ByRef _cliLeft=0, ByRef _cliTop=0, ByRef _cliRight=0, ByRef _cliBottom=0
				, ByRef _xWinBorder=0, ByRef _yWinBorder=0, ByRef _winStyle=0)
{
	if TraceLevel
		SendTrace(A_ThisFunc, "START")
	
	;---------------------------------------------------------------------
	; DWORD + 2 RECT + 3 DWORD + 2 UINT + ATOM + WORD		(RECT = 4 LONG)
	;---------------------------------------------------------------------
	windowInfoSize := 56 + A_PtrSize + 2
	VarSetCapacity(windowInfo, windowInfoSize, 0)
	NumPut(windowInfoSize, windowInfo, 0, "UInt") 	; cbSize
	
	if !DllCall("User32.dll\GetWindowInfo", Ptr, _hGui, Ptr, &windowInfo)
		return false
	
	_winLeft   := NumGet(windowInfo, 4, "Int")	; RECT of the Window
	_winTop    := NumGet(windowInfo, 8, "Int")
	_winRight  := NumGet(windowInfo, 12, "Int")
	_winBottom := NumGet(windowInfo, 16, "Int")
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, "Window", "Left:" _winLeft " Top:" _winTop
												. " Right:" _winRight " Bottom:" _winBottom)
	
	_cliLeft   := NumGet(windowInfo, 20, "Int")	; RECT of the Window Client Area
	_cliTop    := NumGet(windowInfo, 24, "Int")
	_cliRight  := NumGet(windowInfo, 28, "Int")
	_cliBottom := NumGet(windowInfo, 32, "Int")
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, "Client", "Left:" _cliLeft " Top:" _cliTop
												. " Right:" _cliRight " Bottom:" _cliBottom)
	
	SetFormat, Integer, H
	_winStyle := NumGet(windowInfo, 36, "UInt") + 0
	SetFormat, IntegerFast, D
	
	_xWinBorder := NumGet(windowInfo, 48, "UInt")
	_yWinBorder := NumGet(windowInfo, 52, "UInt")
	
	if (TraceLevel >= 2)
		SendTrace(A_ThisFunc, "winStyle:" _winStyle, "xBorder:" _xWinBorder
								  . " yBorder:" _yWinBorder)
	
	if TraceLevel
		SendTrace(A_ThisFunc, "END")
	
	return true
}
