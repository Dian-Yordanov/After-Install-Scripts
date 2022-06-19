/*
Title: SendTrace (v0.0 September 7, 2013)

Introduction
------------

	'SendTrace' is a simple function that produces a tracing log file.
	
Compatibility
-------------

   This library was designed to run on AutoHotkey R8+ (32 and 64-bit)), on Windows XP and
	greater.

Links
-----

Credit
------

How to used it
--------------

	Label, action and message are text parameters.
	Usually :
	- label		: should be A_ThisLabel or A_ThisFunc (in optional)
	- action		: could be the action the script is performing (in optional)
	- message	: any kind of information needed for the tracing purpose (in optional)
	
	- instance	: is a special case, when you want to run more than 1 instance of a script.
					  It gives you the opportunity to identify each instance in a separate log
					  file (in optional).
	

Author
------

	JPV alias Oldman
*/

SendTrace(_label="", ByRef _action="", ByRef _message="", _instance="")
{
	static msgDate   := ""
	static traceName := ""
	static fileTrace := ""
	
	savedErrorLevel := ErrorLevel
	FormatTime, newDate,, [dd/MM/yyyy]
	
	if (newDate <> msgDate)
	{
		if !fileTrace
		{
			; initialize the files
			SplitPath, A_ScriptName,,,, traceName
			
			if !_instance
			{
				fileTrace    := traceName ".trace.txt"
				fileTraceOld := traceName ".trace.old.txt"
			}
			else
			{
				fileTrace    := traceName "." _instance ".trace.txt"
				fileTraceOld := traceName "." _instance ".trace.old.txt"
			}
			
			IfExist, %fileTraceOld%
				FileRecycle, %fileTraceOld%
			
			IfExist, %fileTrace%
				FileMove, %fileTrace%, %fileTraceOld%
		}
		
		msgDate := newDate
		FileAppend, % msgDate "`r`n", %fileTrace%
	}
	
	FormatTime, msgText,, HH.mm.ss
	msgText .= "," A_MSec
	
	if (IsLabel(_label) or IsFunc(_label))
	{
		if A_Gui
			msgText .= " Gui:" A_Gui " GuiControl:" A_GuiControl " GuiEvent:" A_GuiEvent
						. " Event_Info:" A_EventInfo " -"
	}
	else
		msgText .= " " traceName
	
	if (_label <> "")
		msgText .= " " _label
	
	if (_action <> "")
		msgText .= " " _action
	
	if (_message <> "")
		msgText .= " " _message
	
	if savedErrorLevel
		msgText .= " - Error:" savedErrorLevel
	
	FileAppend, % msgText "`r`n", %fileTrace%
	ErrorLevel := savedErrorLevel
	return
}
