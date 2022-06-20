
SetWorkingDir %A_ScriptDir% 

filesList := []

Loop %A_ScriptDir%\*.ps1
{
    filesVar = %A_LoopFileName%
    filesList.Push(filesVar)
}
Loop, % filesList.MaxIndex(){
    Gui, Add, CheckBox, vOpt%A_Index% , % filesList[A_Index]
	; DDLString .= "|" Options[A_Index]
}
Gui, Add, Button, vReason ggo x400 y310, Go
; Gui, Add, DropDownList, vReason x24 y110 w90, %DDLString%

Gui, Show, w500 h400
Return

go:
Loop, % filesList.MaxIndex()
{
    GuiControlGet, checked,,Opt%A_Index%

    if(checked==1){
        selectedVar := % filesList[A_Index]
        customFunction1(selectedVar)
    }
    
}
return

customFunction1(selectedVar)
{
    ; path = %A_ScriptDir%\%selectedVar%

    ; MsgBox, % selectedVar

    strPsScriptFile = %A_ScriptDir%\%selectedVar%
    PsScriptFile = %selectedVar%

    FileRead, OutputVar, %A_ScriptDir%\%selectedVar%
    ; MsgBox, % OutputVar
    ; MsgBox, % strPsScriptFile
    OutputVar = "& {"  %OutputVar%  "}"

    ; MsgBox, % OutputVar

    ; Run, cmd /c cd %A_ScriptDir%
    ; RunWait, PowerShell.exe -NoExit -Command %strPsScriptFile%, , Show

    ; RunWait, PowerShell.exe Set-Location %A_ScriptDir%, , Min
    ; RunWait, PowerShell.exe –NoExit –Command %PsScriptFile%, , Show

    ; RunWait PowerShell.exe -NoExit -ExecutionPolicy Bypass -Command '%PsScriptFile%', %A_ScriptDir%, Show

    ; Run, PowerShell "-NoExit new-item -path" . %A_ScriptDir% ." -name ". %selectedVar% ." -itemtype,, Show"

    RunWait, powershell.exe -NoExit -ExecutionPolicy Bypass -Command %OutputVar%, Show

    return
}
