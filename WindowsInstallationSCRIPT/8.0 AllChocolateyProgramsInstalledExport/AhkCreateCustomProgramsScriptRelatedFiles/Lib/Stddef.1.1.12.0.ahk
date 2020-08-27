/*
Title: Stddef (v0.0 April 7, 2014)

Introduction
------------

	Declaration of super global variables commonly used by scripts.
	Checks that the script is compatible with the OS Version and with the AutoHotkey version.
	
Compatibility
-------------

   This library was designed to run on AutoHotkey v1.1.12+ ANSI and Unicode (32 and 64-bit),
	on Windows XP+.

Links
-----

Credit
------

How to used it
--------------

	To include at the beginning of a script.
	
Author
------

	JPV alias Oldman
*/

global MinAhkVersion := "1.1.12.0"

global TraceLevel=0
global NULL=0
global ScriptName
global ScriptIni

global Size_of_char := A_IsUnicode ? 2 : 1
global Type_of_char := A_IsUnicode ? "UShort" : "Char"
global Ptr          := A_PtrSize ? "Ptr" : "UInt"

SplitPath, A_ScriptName,,,, ScriptName
ScriptIni := A_ScriptDir "\" ScriptName ".ini"
