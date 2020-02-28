@ECHO OFF
setlocal enabledelayedexpansion
for %%f in (D:\ENfilesMay\NEW\*.enex) do (
  set /p val=<%%f
  echo "fullname: %%f"
  echo "name: %%~nf"
  echo "contents: !val!"

  7z a -pqqqq2111 "%%~nf".7z "%%~nf".enex
)