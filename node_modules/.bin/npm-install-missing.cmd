@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\npm-install-missing\bin\npm-install-missing" %*
) ELSE (
  node  "%~dp0\..\npm-install-missing\bin\npm-install-missing" %*
)