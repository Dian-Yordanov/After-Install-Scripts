/*
Title: MonitorClass (v0.2 February 28, 2014)

Introduction
------------

	"MonitorClass" is a base Class that retrieves the number of display monitors on the
	desktop (not including "non-display pseudo-monitors").
	
	"MonitorClass" provides a method that returns the last coordinates (active window or
	mouse position). It also implicitely returns the coordinates and size of the monitor
	Work Area, i.e., the bounding coordinates of the current monitor excluding the area
	occupied by the taskbar and other registered desktop toolbars.
	The current monitor is the monitor that the mouse cursor is hovering over.
	
	"MonitorClass" provides a second method that returns the coordinates and size of the
	monitor Work Area based on target coodinates.
	
	"MonitorClass" provides a third method that returns a string with the work area sizes
	of all the monitors.

Compatibility
-------------

   This class was designed to run on AutoHotkey v1.1.12+ ANSI and Unicode (32 and 64-bit),
	on Windows XP+.

Links
-----

Credit
------

How to used it
--------------

	MonitorClass can be used standalone, but is primarily dedicated to the GuiClass,
	the InputBoxClass and the ProgressClass.
	Also used by the DesktopIconClass.

Changes
-------

	0.1 February 19, 2014
		 Add the GetScreenCoordinates method.

	0.2 February 28, 2014
		 Add the GetScreenSizes method.

Author
------

	JPV alias Oldman
*/

#Include <__MessageLib>

class MonitorClass
{
	; Sysget constant
	static SM_CMONITORS=80
	
	static NumberMonitor=0
	
	MonitorLeft   := 0
	MonitorTop    := 0
	MonitorRight  := 0
	MonitorBottom := 0
	MonitorWidth  := 0
	MonitorHeight := 0

/*
	=========================================================================================
	InstanceName := new MonitorClass()
	
	Instantiates the MonitorClass and returns the number of monitors.
	=========================================================================================
*/
	__New()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		if !this.NumberMonitor
		{
			;---------------------------------------------------------
			; Retrieves the number of display monitors on the desktop
			;---------------------------------------------------------
			SysGet, nbrMonitor, % this.SM_CMONITORS
			
			if !nbrMonitor
			{
				ShowProgramMessage(A_ThisFunc, 16, 1007, "SM_CMONITORS", this.SM_CMONITORS)
				return false
			}
			
			MonitorClass.NumberMonitor := nbrMonitor
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END", "Number monitor:" this.NumberMonitor)
		
		return this
	}

/*
	=========================================================================================
	InstanceName.GetLastCoordinates(x, y)
	
		x : last window or mouse x-position (out)
		y : last window or mouse y-position (out)
	
	Returns the last window or mouse coordinates with the bouding coordinates and size of
	the corresponding monitor work area.
	=========================================================================================
*/
	GetLastCoordinates(ByRef _x, ByRef _y)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		WinGetClass, windowClass, A
		
		if (windowClass = "AutoHotkeyGUI")
		{
			WinGetPos, _x, _y,,, A
			
			type := "Window"
		}
		else
		{
			CoordMode, Mouse, Screen
			MouseGetPos, _x, _y
			CoordMode, Mouse, Relative
			
			type := "Mouse"
		}
		
		Loop, % this.NumberMonitor
		{
			;--------------------------------------------------------------------------------
			; The load is needed each time, because the work area could change between calls,
			; due to the space occupied by the task bar or any other registered desktop tool
			; bars.
			;--------------------------------------------------------------------------------
			SysGet, monitor, MonitorWorkArea, %A_Index%
			
			if (_x < monitorRight and _y < monitorBottom)
			{
				this.MonitorLeft   := monitorLeft
				this.MonitorTop    := monitorTop
				this.MonitorRight  := monitorRight
				this.MonitorBottom := monitorBottom
				
				this.MonitorWidth  := monitorRight - monitorLeft
				this.MonitorHeight := monitorBottom - monitorTop
				
				if TraceLevel
				{
					SendTrace(A_ThisFunc, type " coordinates", _x " " _y)
					SendTrace(A_ThisFunc, "END", "Monitor Left:" this.MonitorLeft
														. " Top:"    this.MonitorTop
														. " Right:"  this.MonitorRight
														. " Bottom:" this.MonitorBottom
														. " Width:"  this.MonitorWidth
														. " Height:" this.MonitorHeight)
				}
				
				return true
			}
		}
		
		ShowProgramMessage(A_ThisFunc, 64, 1008, type, _x, _y)
		return false
	}

/*
	=========================================================================================
	InstanceName.GetScreenCoordinates(x, y[, silent=false)
	
		x : last window or mouse x-position (in)
		y : last window or mouse y-position (in)
	
	Returns the coordinates and sizes of the corresponding monitor work area.
	=========================================================================================
*/
	GetScreenCoordinates(_x, _y, _silent=false)
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		type := "Target"
		
		Loop, % this.NumberMonitor
		{
			;--------------------------------------------------------------------------------
			; The load is needed each time, because the work area could change between calls,
			; due to the space occupied by the task bar or any other registered desktop tool
			; bars.
			;--------------------------------------------------------------------------------
			SysGet, monitor, MonitorWorkArea, %A_Index%
			
			if (_x < monitorRight and _y < monitorBottom)
			{
				this.MonitorLeft   := monitorLeft
				this.MonitorTop    := monitorTop
				this.MonitorRight  := monitorRight
				this.MonitorBottom := monitorBottom
				
				this.MonitorWidth  := monitorRight - monitorLeft
				this.MonitorHeight := monitorBottom - monitorTop
				
				if TraceLevel
				{
					SendTrace(A_ThisFunc, type " coordinates", _x " " _y)
					SendTrace(A_ThisFunc, "END", "Monitor Left:" this.MonitorLeft
														. " Top:"    this.MonitorTop
														. " Right:"  this.MonitorRight
														. " Bottom:" this.MonitorBottom
														. " Width:"  this.MonitorWidth
														. " Height:" this.MonitorHeight)
				}
				
				return true
			}
		}
		
		if !_silent
			ShowProgramMessage(A_ThisFunc, 64, 1008, type, _x, _y)
		
		return false
	}

/*
	=========================================================================================
	InstanceName.GetScreenSizes()
	
	Returns a string with the screen resolutions.
	=========================================================================================
*/
	GetScreenSizes()
	{
		if TraceLevel
			SendTrace(A_ThisFunc, "START")
		
		this.ScreenSizes := ""
		
		Loop, % this.NumberMonitor
		{
			;--------------------------------------------------------------------------------
			; The load is needed each time, because the work area could change between calls,
			; due to the space occupied by the task bar or any other registered desktop tool
			; bars.
			;--------------------------------------------------------------------------------
			SysGet, monitor, MonitorWorkArea, %A_Index%
			
			Width  := monitorRight - monitorLeft
			Height := monitorBottom - monitorTop
			this.ScreenSizes .= (A_Index = 1 ? "" : "-") Width "x" Height
		}
		
		if TraceLevel
			SendTrace(A_ThisFunc, "END")
		
		return this.ScreenSizes
	}
}
