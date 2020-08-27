/*
Title: GetScrollBarPitches (v0.0 September 7, 2013)

Introduction
------------

	Calculates the pitches of the Scroll Bar.
	It is dependent of the ScrollBarSpeed parameter.
	
Compatibility
-------------

   No limitation.

Links
-----

Credit
------

How to used it
--------------

Author
------

	JPV alias Oldman
*/

GetScrollBarPitches(ByRef _scrollPitchX, ByRef _scrollPitchY, ByRef _scrollBarSpeed
													, ByRef _marginX, ByRef _marginY)
{
	if TraceLevel
		SendTrace(A_ThisFunc, "START")
	
	if (_scrollBarSpeed = SB_SCROLL_FAST)
	{
		_scrollPitchX := _marginX * 2
		_scrollPitchY := _marginY * 2
	}
	
	else if (_scrollBarSpeed = SB_SCROLL_SLOW)
	{
		_scrollPitchX := _marginX // 2
		_scrollPitchY := _marginY // 2
	}
	
	else if (_scrollBarSpeed = SB_SCROLL_VERY_SLOW)
	{
		_scrollPitchX := 1
		_scrollPitchY := 1
	}
	
	else
	{
		_scrollPitchX := _marginX
		_scrollPitchY := _marginY
	}
	
	if TraceLevel
		SendTrace(A_ThisFunc, "END", "PitchX:" _scrollPitchX " PitchY:" _scrollPitchY)
	
	return
}
