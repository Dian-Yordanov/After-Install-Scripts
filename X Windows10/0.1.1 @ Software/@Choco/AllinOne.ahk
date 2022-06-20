SetWorkingDir %A_ScriptDir% 

Gui, Add, Tab3, w680 h480, ChooseScriptToInstall.ahk|launchInstallScript.ahk|Tab3
Gui, Tab, 1
filesList := []

Loop %A_ScriptDir%\*.ps1
{
    filesVar = %A_LoopFileName%
    filesList.Push(filesVar)
}
Loop, % filesList.MaxIndex(){
    Gui, Add, CheckBox, vOpt%A_Index% , % filesList[A_Index]
}
Gui, Add, Button, vExecuteScripts_Type1Execution ggo1 x400 y310, ExecuteScripts_Type1Execution
Gui, Add, Button, vExecuteScripts_Type2Execution ggo2 x400 y340, ExecuteScripts_Type2Execution
Gui, Tab, 2
Gui, Add, Text,, We are in tab two
Gui, Tab, 3
Gui, Add, Text,, We are in tab three
Gui, Show


; _____           _       _     __      _____ _                           _____           _       _ _______   _____           _        _ _        _     _    
; / ____|         (_)     | |   /_ |_   / ____| |                         / ____|         (_)     | |__   __| |_   _|         | |      | | |      | |   | |   
; | (___   ___ _ __ _ _ __ | |_   | (_) | |    | |__   ___   ___  ___  ___| (___   ___ _ __ _ _ __ | |_ | | ___  | |  _ __  ___| |_ __ _| | |  __ _| |__ | | __
; \___ \ / __| '__| | '_ \| __|  | |   | |    | '_ \ / _ \ / _ \/ __|/ _ \\___ \ / __| '__| | '_ \| __|| |/ _ \ | | | '_ \/ __| __/ _` | | | / _` | '_ \| |/ /
; ____) | (__| |  | | |_) | |_   | |_  | |____| | | | (_) | (_) \__ \  __/____) | (__| |  | | |_) | |_ | | (_) || |_| | | \__ \ || (_| | | || (_| | | | |   < 
; |_____/ \___|_|  |_| .__/ \__|  |_(_)  \_____|_| |_|\___/ \___/|___/\___|_____/ \___|_|  |_| .__/ \__||_|\___/_____|_| |_|___/\__\__,_|_|_(_)__,_|_| |_|_|\_\
;                   | |                                                                     | |                                                               
;                   |_|                                                                     |_|                                                               

go1:
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

go2:
Loop, % filesList.MaxIndex()
{
    GuiControlGet, checked,,Opt%A_Index%

    if(checked==1){
        selectedVar := % filesList[A_Index]
        customFunction2(selectedVar)
    }
    
}
return

customFunction2(selectedVar)
{

    strPsScriptFile = %A_ScriptDir%\%selectedVar%
    PsScriptFile = %selectedVar%

    FileRead, OutputVar, %A_ScriptDir%\%selectedVar%

    OutputVar = "& {"  %OutputVar%  "}"

    SetKeyDelay, 0, 0

    Run, C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe
    Sleep, 4000
    
    clipboard = %OutputVar%
    ControlSend,, {Enter},ahk_exe powershell.exe
    Send ^v
    Sleep, 1500
    ControlSend,, {Enter},ahk_exe powershell.exe
    
    return
}

;  _____           _       _     ___      _                        _     _____           _        _ _  _____           _       _          _     _    
; / ____|         (_)     | |   |__ \ _  | |                      | |   |_   _|         | |      | | |/ ____|         (_)     | |        | |   | |   
; | (___   ___ _ __ _ _ __ | |_     ) (_) | | __ _ _   _ _ __   ___| |__   | |  _ __  ___| |_ __ _| | | (___   ___ _ __ _ _ __ | |_   __ _| |__ | | __
; \___ \ / __| '__| | '_ \| __|   / /    | |/ _` | | | | '_ \ / __| '_ \  | | | '_ \/ __| __/ _` | | |\___ \ / __| '__| | '_ \| __| / _` | '_ \| |/ /
; ____) | (__| |  | | |_) | |_   / /_ _  | | (_| | |_| | | | | (__| | | |_| |_| | | \__ \ || (_| | | |____) | (__| |  | | |_) | |_ | (_| | | | |   < 
; |_____/ \___|_|  |_| .__/ \__| |____(_) |_|\__,_|\__,_|_| |_|\___|_| |_|_____|_| |_|___/\__\__,_|_|_|_____/ \___|_|  |_| .__/ \__(_)__,_|_| |_|_|\_\
;                   | |                                                                                                 | |                          
;                   |_|                                                                                                 |_|                          

