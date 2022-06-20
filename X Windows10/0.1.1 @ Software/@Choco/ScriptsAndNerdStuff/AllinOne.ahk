SetWorkingDir %A_ScriptDir% 


Gui, Add, Tab3, w880 h680, 1. Choose script to install|2. Launch "Install.ps1"|2.1. Create a new "Install.ps1" script|3. Launch "InstallCustomPrograms.ps1" script|3.1 Create a new "InstallCustomPrograms.ps1" script
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
Gui, Add, Button, vExecuteScripts_Type1Execution1 gexecute_script1 x400 y310, Execute Scripts Type 1 Execution 
Gui, Add, Button, vExecuteScripts_Type2Execution2 gexecute_script2 x400 y340, Execute Scripts Type 2 Execution 
Gui, Tab, 3
Gui, Add, Button, vExecuteScripts_Type2Execution7 gexecute_script7 x400 y340, RunThisToGetPackagesButManuallyRemoveHeadersRunner.exe Type 2 Execution 
Gui, Tab, 4
Gui, Add, Button, vExecuteScripts_Type1Execution4 gexecute_script4 x400 y310, InstallCustomPrograms.ps1 Type 1 Execution 
Gui, Add, Button, vExecuteScripts_Type2Execution5 gexecute_script5 x400 y340, InstallCustomPrograms.ps1 Type 2 Execution 
Gui, Tab, 5
Gui, Add, Button, vExecuteScripts_Type1Execution3 gexecute_script3 x400 y310, Launch the read_Install_script_and_choose_programs_to_install.exe
Gui, Show


;  _____           _       _     __      _____ _                           _____           _       _ _______   _____           _        _ _        _     _    
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

    OutputVar = %OutputVar% 

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

execute_script1:

FileRead, OutputVar, %A_ScriptDir%\Install.ps1
OutputVar = "& {"  %OutputVar%  "}"
RunWait, powershell.exe -NoExit -ExecutionPolicy Bypass -Command %OutputVar%, Show

return

execute_script2:

FileRead, OutputVar, %A_ScriptDir%\Install.ps1
clipboard = %OutputVar%

SetKeyDelay, 0, 0

Run, C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe
Sleep, 4000

ControlSend,, {Enter},ahk_exe powershell.exe
Send ^v
Sleep, 1500
ControlSend,, {Enter},ahk_exe powershell.exe

return

;  _____           _       _     ____                         _   _____           _        _ _                 _       _                    _       _                                                                             _         _           _        _ _        _     _    
; / ____|         (_)     | |   |___ \ _                     | | |_   _|         | |      | | |               (_)     | |                  | |     | |                                                                           | |       (_)         | |      | | |      | |   | |   
; | (___   ___ _ __ _ _ __ | |_    __) (_)  _ __ ___  __ _  __| |   | |  _ __  ___| |_ __ _| | |  ___  ___ _ __ _ _ __ | |_   __ _ _ __   __| |  ___| |__   ___   ___  ___  ___     _ __  _ __ ___   __ _ _ __ __ _ _ __ ___  ___ | |_ ___   _ _ __  ___| |_ __ _| | |  __ _| |__ | | __
; \___ \ / __| '__| | '_ \| __|  |__ <    | '__/ _ \/ _` |/ _` |   | | | '_ \/ __| __/ _` | | | / __|/ __| '__| | '_ \| __| / _` | '_ \ / _` | / __| '_ \ / _ \ / _ \/ __|/ _ \   | '_ \| '__/ _ \ / _` | '__/ _` | '_ ` _ \/ __|| __/ _ \ | | '_ \/ __| __/ _` | | | / _` | '_ \| |/ /
; ____) | (__| |  | | |_) | |_   ___) |_  | | |  __/ (_| | (_| |  _| |_| | | \__ \ || (_| | | | \__ \ (__| |  | | |_) | |_ | (_| | | | | (_| || (__| | | | (_) | (_) \__ \  __/   | |_) | | | (_) | (_| | | | (_| | | | | | \__ \| || (_) || | | | \__ \ || (_| | | || (_| | | | |   < 
; |_____/ \___|_|  |_| .__/ \__| |____/(_) |_|  \___|\__,_|\__,_| |_____|_| |_|___/\__\__,_|_|_| |___/\___|_|  |_| .__/ \__| \__,_|_| |_|\__,_| \___|_| |_|\___/ \___/|___/\___|   | .__/|_|  \___/ \__, |_|  \__,_|_| |_| |_|___/ \__\___/ |_|_| |_|___/\__\__,_|_|_(_)__,_|_| |_|_|\_\
;                   | |                                      ______                         ______              | |     ______             ______                           ______| |               __/ |                     ______   ______                                          
;                   |_|                                     |______|                       |______|             |_|    |______|           |______|                         |______|_|              |___/                     |______| |______|                                         

execute_script3:

Run %A_ScriptDir%\read_Install_script_and_choose_programs_to_install.exe

return

;  _____           _       _     _  _       _____          _______ _     _  _______     _____      _   _____           _                         ____        _   __  __                         _ _       _____                               _    _                _               _____                                          
; / ____|         (_)     | |   | || |  _  |  __ \        |__   __| |   (_)|__   __|   / ____|    | | |  __ \         | |                       |  _ \      | | |  \/  |                       | | |     |  __ \                             | |  | |              | |             |  __ \                                         
; | (___   ___ _ __ _ _ __ | |_  | || |_(_) | |__) |   _ _ __ | |  | |__  _ ___| | ___ | |  __  ___| |_| |__) |_ _  ___| | ____ _  __ _  ___  ___| |_) |_   _| |_| \  / | __ _ _ __  _   _  __ _| | |_   _| |__) |___ _ __ ___   _____   _____| |__| | ___  __ _  __| | ___ _ __ ___| |__) |   _ _ __  _ __   ___ _ __ _____  _____ 
; \___ \ / __| '__| | '_ \| __| |__   _|   |  _  / | | | '_ \| |  | '_ \| / __| |/ _ \| | |_ |/ _ \ __|  ___/ _` |/ __| |/ / _` |/ _` |/ _ \/ __|  _ <| | | | __| |\/| |/ _` | '_ \| | | |/ _` | | | | | |  _  // _ \ '_ ` _ \ / _ \ \ / / _ \  __  |/ _ \/ _` |/ _` |/ _ \ '__/ __|  _  / | | | '_ \| '_ \ / _ \ '__/ _ \ \/ / _ \
; ____) | (__| |  | | |_) | |_     | |  _  | | \ \ |_| | | | | |  | | | | \__ \ | (_) | |__| |  __/ |_| |  | (_| | (__|   < (_| | (_| |  __/\__ \ |_) | |_| | |_| |  | | (_| | | | | |_| | (_| | | | |_| | | \ \  __/ | | | | | (_) \ V /  __/ |  | |  __/ (_| | (_| |  __/ |  \__ \ | \ \ |_| | | | | | | |  __/ |_|  __/>  <  __/
; |_____/ \___|_|  |_| .__/ \__|    |_| (_) |_|  \_\__,_|_| |_|_|  |_| |_|_|___/_|\___/ \_____|\___|\__|_|   \__,_|\___|_|\_\__,_|\__, |\___||___/____/ \__,_|\__|_|  |_|\__,_|_| |_|\__,_|\__,_|_|_|\__, |_|  \_\___|_| |_| |_|\___/ \_/ \___|_|  |_|\___|\__,_|\__,_|\___|_|  |___/_|  \_\__,_|_| |_|_| |_|\___|_(_)\___/_/\_\___|
;                   | |                                                                                                           __/ |                                                              __/ |                                                                                                                         
;                   |_|                                                                                                          |___/                                                              |___/                                                                                                                          

execute_script4:

FileRead, OutputVar, %A_ScriptDir%\InstallCustomPrograms.ps1
OutputVar = "& {"  %OutputVar%  "}"
RunWait, powershell.exe -NoExit -ExecutionPolicy Bypass -Command %OutputVar%, Show

return


execute_script5:

FileRead, OutputVar, %A_ScriptDir%\InstallCustomPrograms.ps1
clipboard = %OutputVar%

SetKeyDelay, 0, 0

Run, C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe
Sleep, 4000

ControlSend,, {Enter},ahk_exe powershell.exe
Send ^v
Sleep, 1500
ControlSend,, {Enter},ahk_exe powershell.exe

return

; ____  __      _____                _                                       _ _ _____           _        _ _  _____          _                  _____                                                    __ _ _                 _       _   
; |___ \/_ |    / ____|              | |                                     ( | )_   _|         | |      | | |/ ____|        | |                |  __ \                                                  /_ ( | )               (_)     | |  
;   __) || |   | |     _ __ ___  __ _| |_ ___    __ _   _ __   _____      __  V V  | |  _ __  ___| |_ __ _| | | |    _   _ ___| |_ ___  _ __ ___ | |__) | __ ___   __ _ _ __ __ _ _ __ ___  ___   _ __  ___| |V V   ___  ___ _ __ _ _ __ | |_ 
;  |__ < | |   | |    | '__/ _ \/ _` | __/ _ \  / _` | | '_ \ / _ \ \ /\ / /       | | | '_ \/ __| __/ _` | | | |   | | | / __| __/ _ \| '_ ` _ \|  ___/ '__/ _ \ / _` | '__/ _` | '_ ` _ \/ __| | '_ \/ __| |     / __|/ __| '__| | '_ \| __|
;  ___) || |_  | |____| | |  __/ (_| | ||  __/ | (_| | | | | |  __/\ V  V /       _| |_| | | \__ \ || (_| | | | |___| |_| \__ \ || (_) | | | | | | |   | | | (_) | (_| | | | (_| | | | | | \__ \_| |_) \__ \ |     \__ \ (__| |  | | |_) | |_ 
; |____(_)_(_)  \_____|_|  \___|\__,_|\__\___|  \__,_| |_| |_|\___| \_/\_/       |_____|_| |_|___/\__\__,_|_|_|\_____\__,_|___/\__\___/|_| |_| |_|_|   |_|  \___/ \__, |_|  \__,_|_| |_| |_|___(_) .__/|___/_|     |___/\___|_|  |_| .__/ \__|
;                                                                                                                                                                  __/ |                         | |                               | |        
;                                                                                                                                                                 |___/                          |_|                               |_|        

execute_script6:

FileRead, OutputVar, %A_ScriptDir%\RunThisToGetPackagesButManuallyRemoveHeaders.ps1
OutputVar = "& {"  %OutputVar%  "}"
RunWait, powershell.exe -NoExit -ExecutionPolicy Bypass -Command %OutputVar%, Show


return

execute_script7:

FileRead, OutputVar, %A_ScriptDir%\RunThisToGetPackagesButManuallyRemoveHeaders.ps1
clipboard = %OutputVar%

SetKeyDelay, 0, 0

Run, C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe
Sleep, 4000

ControlSend,, {Enter},ahk_exe powershell.exe
Send ^v
Sleep, 1500
ControlSend,, {Enter},ahk_exe powershell.exe


return