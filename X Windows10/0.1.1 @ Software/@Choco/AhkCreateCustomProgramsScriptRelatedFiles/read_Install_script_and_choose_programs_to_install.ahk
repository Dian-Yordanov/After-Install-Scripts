
DBFileName3 := A_ScriptDir . "\Install.ps1"
FileRead, OutputVar3, %DBFileName3%

; Split := StrSplit(OutputVar3, ",")
NewStr1 := StrReplace(OutputVar3, "choco install ", "")
NewStr2 := StrReplace(NewStr1, " -y", "")

; Loop % Split.MaxIndex() {
;     GuiControl, % ShowHide, % Split[A_Index]
; }

; MsgBox, %NewStr2%




; Options := ["Option1", "Option2", "Option3"] ; assign the elements of the array however you want

; DDLString := "Title|"
; Loop, % Options.MaxIndex()
; 	DDLString .= "|" Options[A_Index]
; Gui, Add, DropDownList, vReason x24 y110 w90, %DDLString%
; Gui, Add, CheckBox, gGoHereWhenClicked, %DDLString%
; Gui, Show
; Return

; GoHereWhenClicked:
; MsgBox, "vfff"
; Return


Options := ["Option1", "Option2", "Option3"] ; assign the elements of the array however you want

DDLString := "Title|"
Loop, % Options.MaxIndex(){
    Gui, Add, CheckBox, vOpt%A_Index%, % Options[A_Index]
	; DDLString .= "|" Options[A_Index]
}
Gui, Add, Button, vReason ggo x24 y110 w90, Go
; Gui, Add, DropDownList, vReason x24 y110 w90, %DDLString%

Gui, Show
Return

go:
Gui, Submit, NoHide ;this command submits the guis' datas' state
MsgBox, %Opt1%
Return