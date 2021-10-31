#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
#SingleInstance, Force
#Persistent
Menu, Tray, Icon, Shell32.dll, 19

SetTimer, SetNetworkInfo, 5000

SetNetworkInfo:
{
    clipSave := ClipboardAll
    gosub, GetLanIP
    gosub, GetWanIP
    Clipboard := clipSave
    Menu, Tray, Tip, LanIP: %lanIP%`nWanIP: %wanIP%
    return
}

GetLanIP:
{
    Clipboard := ""
    run, %ComSpec% /c ipconfig | CLIP, , Hide
    ClipWait
    lanInfo := Clipboard

    loop, Parse, lanInfo, `n
    {
        if(InStr(A_LoopField, "IPv4"))
        {
            lanIp := Trim(SubStr(A_LoopField, InStr(A_LoopField, ":")+2), "`r`n")
            return
        }
    }
    lanIP := "Check Network Connection"
}
GetWanIP:
{
    Clipboard := ""
    run, %ComSpec% /c nslookup myip.opendns.com resolver1.opendns.com | CLIP, , Hide
    ClipWait
    wanInfo := Clipboard
    if(!InStr(wanInfo, "Name:"))
    {
        wanIP := "Check Network Connection"
        return
    }
    else
    {
        wanInfo := SubStr(wanInfo, instr(wanInfo, "Name:"))
        loop, Parse, wanInfo, `n
        {
            if(InStr(A_LoopField, "Address"))
            {
                wanIP := Trim(SubStr(A_LoopField, InStr(A_LoopField, ":")+3), "`r`n")
                break
            }
        }
    }
    return
}