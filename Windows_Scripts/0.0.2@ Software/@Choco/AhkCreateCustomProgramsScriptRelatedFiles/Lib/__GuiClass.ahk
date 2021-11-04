/*
Title: GuiClass (v0.1 Janvier 31, 2014)

Introduction
------------

	In a multi-monitor environment, when you launch a script, AutoHotkey displays Gui
	windows on the primary monitor, by default.
	
	'GuiClass' enables to display Gui windows on the primary or on a secondary monitor
	depending on the last coordinates (active window or mouse position).
	
	Gui windows are centered, by default.
	You can give relative coordinates (X+n, X+-n, Y+n, Y+-n) to move right/left/down/up
	from the last coordinates.
	
	'GuiClass' may eventually shrink and/or move Gui windows to fit them on the screen,
	by this way, it may overrides your coordinates and sizes.
	
	You can provide width and/or height to emulate a smaller screen size.
	In this case, width and height are the sizes of the virtual screen, not the sizes of
	the window's client area.
	
	You can use the method the same way as its corresponding AutoHotkey command, except :
		Xn   is discarded ==> use the AutoHotKey command
		Y-n  		"			"				"				"
		Yn  		"			"				"				"
		X-n  		"			"				"				"
		X+n  is used to move the Gui n pixels right the last x-position
		X+-n is used to move the Gui n pixels left the last x-position
		Y+n  is used to move the Gui n pixels down the last y-position
		Y+-n is used to move the Gui n pixels up the last y-position
		Wn   is used to emulate a shorter screen width
		Hn   is used to emulate a smaller screen height
		Center is discarded (is centered by default)
		xCenter is discarded (is centered by default)
		yCenter is discarded (is centered by default)
	
Compatibility
-------------

	This class was designed to run on AutoHotkey v1.1.11+ (32 and 64-bit), on Windows XP
	and greater.

Links
-----

Credit
------
 
	The Class uses the Fnt.ahk library (v0.5) from jballi found in the forum under the
	topic "[Library] Fnt v0.5 (Preview) - Do Stuff With Fonts".

How to used it
--------------

	Instantiate the class for each Gui with the Gui handle as a parameter.
	Then, replace the "Gui, Show" command by the InstanceName.Show() method.

Changes
-------
	0.1 31/01/2014
		Exclude the statusbar from the GetGuiInfo function.

Author
------

	JPV alias Oldman
*/

#Include <__MonitorClass>

class GuiClass extends MonitorClass
{
	; Sysget constants
	static SM_CXVSCROLL=2
	static SM_CYHSCROLL=3
	
	IsNewGui      := true
	GuiHwnd       := 0
	ControlNumber := 0
	ControlHwnd   := 0
	ScreenWidth   := 0			; used to emulate a shorter screen width
	ScreenHeight  := 0			; used to emulate a smaller screen height
	GuiLeft       := 0
	GuiTop        := 0
	GuiRight      := 0
	GuiBottom     := 0
	GuiWidth      := 0
	GuiHeight     := 0
	
/*
	=========================================================================================
	InstanceName := new GuiClass(hGui[, controlNumber=1])

		hGui          : Gui handle (in)
		controlNumber : the sequence number of a control or its handle that will be used
							 to identify the font size (in optional)
	
	Instantiates the GuiClass.
	=========================================================================================
*/
	__New(_hGui, _controlNumber=1)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START", _hGui " " _controlNumber)
		
		if !base.__New()
			return false
		
		if !_hGui
		{
			ShowProgramMessage(A_ThisFunc, 16, 1009)
			return false
		}
		
		if _controlNumber is not integer
		{
			ShowProgramMessage(A_ThisFunc, 16, 1010, _controlNumber)
			return false
		}
		
		this.GuiHwnd := _hGui
		
		if _controlNumber is digit
			this.ControlNumber := _controlNumber
		else
			this.ControlHwnd   := _controlNumber
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return this
	}

/*
	========================================================================================
	InstanceName.Show([options="", title=""])
	
		options : options of the Gui, Show command (in optional)
		title   : title of the Gui, Show command (in optional)
	
	Displays the Gui on the current monitor.
	========================================================================================
*/
	Show(_options="", _title="")
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if !this.GetLastCoordinates(x0, y0)
			return false
		
		;-------------------------------------------
		; Select the screen size (real or emulated)
		;-------------------------------------------
		options2 := this.GetGuiOptions(ix, iy, isAutoSize, _options)
		
		screenWidth  := !this.ScreenWidth  ? this.MonitorWidth
													  : ((this.ScreenWidth < this.MonitorWidth)
													  ? this.ScreenWidth : this.MonitorWidth)
		screenHeight := !this.ScreenHeight ? this.MonitorHeight
													  : ((this.ScreenHeight < this.MonitorHeight)
													  ? this.ScreenHeight : this.MonitorHeight)
		
		;----------
		; Hide Gui
		;----------
		if this.IsNewGui
			Gui, Show, %options2% Hide, %_title%
;			Gui, Show, %options2%, %_title%
		
		if (this.IsNewGui or isAutoSize)
		{
			;--------------
			; Get Gui info
			;--------------
			prev_DetectHiddenWindows := A_DetectHiddenWindows
			DetectHiddenWindows, On
			
			if !this.ControlHwnd
				if !this.ControlHwnd := this.GetControlHwnd(this.ControlNumber)
					return false
			
			hFont           := Fnt_GetFont(this.ControlHwnd)
			this.FontName   := Fnt_GetFontName(hFont)
			this.FontSize   := Fnt_GetFontSize(hFont)
			this.GuiMarginX := Floor(this.FontSize * 1.25)
			this.GuiMarginY := Floor(this.FontSize * 0.75)
			
			if !this.GetGuiInfo()
				return false
			
			this.GuiLeft    -= this.GuiMarginX
			this.GuiRight   += this.GuiMarginX
			this.GuiTop     -= this.GuiMarginY
			this.GuiBottom  += this.GuiMarginY
			
			this.GuiWidth   := this.GuiRight - this.GuiLeft
			this.GuiHeight  := this.GuiBottom - this.GuiTop
			
			DetectHiddenWindows, %prev_DetectHiddenWindows%
			
			if TraceLevel
				SendTrace(A_ThisFunc, "Font name:" this.FontName " Font size:" this.FontSize
										  , "MarginX:" this.GuiMarginX " MarginY:" this.GuiMarginY)
			
			;-----------------------------------
			; Calculate theoretical window size
			;-----------------------------------
			if !GetWindowInfo(this.GuiHwnd,, windowTop,,,, clientTop,,
													, xWindowBorder, yWindowBorder)
			{
				ShowProgramMessage(A_ThisFunc, 16, 1011, A_LastError)
				return false
			}
			
			windowWidth  := this.GuiWidth + xWindowBorder + xWindowBorder
			windowHeight := this.GuiHeight + clientTop - windowTop + yWindowBorder
			
			; just in case (start Gui at position 0)
			if (this.GuiLeft < 0)
				windowWidth += this.GuiLeft
			
			if (this.GuiTop < 0)
				windowHeight += this.GuiTop
			
			;-----------------------------------
			; Reserve space for the Scroll Bars
			;-----------------------------------
			if this.ScrollBarFullPathAhk
			{
				if (windowWidth > screenWidth)
				{
					windowHeight += this.GetHScrollBarHeight()
					isHScrollBar := true
				}
				else
					isHScrollBar := false
				
				if (windowHeight > screenHeight)
				{
					windowWidth += this.GetVScrollBarWidth()
					
					if (windowWidth > screenWidth and !isHScrollBar)
						windowHeight += this.GetHScrollBarHeight()
				}
			}
			
			;----------------------------------------------
			; Shrink width and height to fit on the screen
			;----------------------------------------------
			width  := (windowWidth < screenWidth) ? windowWidth : screenWidth
			height := (windowHeight < screenHeight) ? windowHeight : screenHeight
			
			;---------------------------------------------------
			; Calculate new width and height of the Client Area
			;---------------------------------------------------
			w := width - xWindowBorder - xWindowBorder
			h := height + windowTop - clientTop - yWindowBorder
			
			;----------------------
			; Calculate x-position
			;----------------------
			if (ix = "")
				x := (this.MonitorWidth - width) // 2 + this.MonitorLeft
			else
			{
				x := x0 + ix
				
				;-----------------------------------------------
				; Limit x to allow the Gui to fit on the screen
				;-----------------------------------------------
				if (x > this.MonitorRight - width)
					x := this.MonitorRight - width
				
				else if (x < this.MonitorLeft)
					x := this.MonitorLeft
			}
			
			;----------------------
			; Calculate y-position
			;----------------------
			if (iy = "")
				y := (this.MonitorHeight - height) // 2 + this.MonitorTop
			else
			{
				y := y0 + iy
				
				;-----------------------------------------------
				; Limit y to allow the Gui to fit on the screen
				;-----------------------------------------------
				if (y > this.MonitorBottom - height)
					y := this.MonitorBottom - height
				
				else if (y < this.MonitorTop)
					y := this.MonitorTop
			}
			
			options2 .= " W" w " H" h " X" x " Y" y
			
			this.IsNewGui := false
			
			if TraceLevel
				SendTrace(A_ThisFunc, "END", "W" w " H" h " X" x " Y" y)
		}
		
		Gui, Show, %options2%, %_title%
		
		return true
	}

/*
	========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
		ix			  : increment/decrement value for X coordinate (out)
		iy			  : increment/decrement value for Y coordinate (out)
		isAutoSize : bool = true if AutoSize option (out)
								= false if no AutoSize option
		options	  : Gui, Show, options (in)
	
	Filters the options provided to the Gui.
	========================================================================================
*/
	GetGuiOptions(ByRef _ix, ByRef _iy, ByRef _isAutoSize, ByRef _options)
	{
		local options, value
		
		_ix := _iy := options := ""
		_isAutoSize := false
		
		Loop, Parse, _options, %A_Space%%A_Tab%
		{
			if InStr(A_LoopField, "Center")				; exclude Center, xCenter, yCenter
				continue
			
			if (SubStr(A_LoopField, 1, 1) = "X")		; exclude X
			{
				if (SubStr(A_LoopField, 2, 1) = "+")
				{
					value := SubStr(A_LoopField, 3)
					
					if value is integer
						_ix := value
				}
				
				continue
			}
			
			if (SubStr(A_LoopField, 1, 1) = "Y")		; exclude Y
			{
				if (SubStr(A_LoopField, 2, 1) = "+")
				{
					value := SubStr(A_LoopField, 3)
					
					if value is integer
						_iy := value
				}
				
				continue
			}
			
			else if (SubStr(A_LoopField, 1, 1) = "W")	; exclude width
			{
				value := SubStr(A_LoopField, 2)
				
				if value is integer
					this.ScreenWidth := value
				
				continue
			}
			
			else if (SubStr(A_LoopField, 1, 1) = "H")	; exclude height
			{
				value := SubStr(A_LoopField, 2)
				
				if value is integer
					this.ScreenHeight := value
				
				continue
			}
			
			else if (A_LoopField = "AutoSize")			; exclude AutoSize
			{
				_isAutoSize := true
				continue
			}
			
			options .= A_LoopField " "
		}
		
		return options
	}

/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
		controlNumber : sequence number of a control (in)
	
	Retrieves the handle of the specified control number.
	=========================================================================================
*/
	GetControlHwnd(_controlNumber)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START", _controlNumber)
		
		WinGet, controlListHwnd, ControlListHwnd, % "ahk_id " this.GuiHwnd
		
		Loop, Parse, controlListHwnd, `n
		{
			if (A_Index = _controlNumber)
			{
				if TraceLevel
					SendTrace(A_ThisFunc, "END", A_LoopField)
				
				return A_LoopField
			}
		}
		
		ShowProgramMessage(A_ThisFunc, 16, 1012)
		return false
	}

/*
	=========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Calculates the X-coordinates and the Y-coordinates of the Gui.
	=========================================================================================
*/
	GetGuiInfo()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		WinGet, controlList, ControlList, % "ahk_id " this.GuiHwnd
		
		;--------------------------------------------------------------
		; Select the left, top, right, bottom most position of the Gui
		;--------------------------------------------------------------
		this.GuiLeft  := this.GuiTop := 9999
		this.GuiRight := this.GuiBottom := -9999
		
		Loop, Parse, controlList, `n
		{
			if (A_LoopField = "msctls_statusbar321")
				continue
			
			GuiControlGet, c, Pos, %A_LoopField%
			
			if (cX < this.GuiLeft)
				this.GuiLeft := cX
			
			if (cX + cW > this.GuiRight)
				this.GuiRight := cX + cW
			
			if (cY < this.GuiTop)
				this.GuiTop := cY
			
			if (cY + cH > this.GuiBottom)
				this.GuiBottom := cY + cH
		}
		
		if (this.GuiRight = -9999)
		{
			ShowProgramMessage(A_ThisFunc, 16, 1012)
			return false
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END", "Gui Left:" this.GuiLeft " Top:" this.GuiTop
									  . " Right:" this.GuiRight " Bottom:" this.GuiBottom)
		
		return true
	}

/*
	========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Returns the Verticalal Scroll Bar width.
	========================================================================================
*/
	GetVScrollBarWidth()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		SysGet, scrollBarWidth, % this.SM_CXVSCROLL
		
		if !scrollBarWidth
		{
			ShowProgramMessage(A_ThisFunc, 16, 1007, "SM_CXVSCROLL", this.SM_CXVSCROLL)
			return false
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END", "Vertical ScrollBar width:" scrollBarWidth)
		
		return scrollBarWidth
	}

/*
	========================================================================================
	The method is only used by the Class. It should never be called by the main program.
	
	Returns the Horizontal Scroll Bar height.
	========================================================================================
*/
	GetHScrollBarHeight()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		SysGet, scrollBarHeight, % this.SM_CYHSCROLL
		
		if !scrollBarHeight
		{
			ShowProgramMessage(A_ThisFunc, 16, 1007, "SM_CYHSCROLL", this.SM_CYHSCROLL)
			return false
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END", "Horizontal ScrollBar height:" scrollBarHeight)
		
		return scrollBarHeight
	}
}

#Include <Fnt>