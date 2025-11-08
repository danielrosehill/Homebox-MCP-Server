@echo off
REM Homebox MCP Server Update Script (Windows)
REM This script updates the homebox-mcp-server package from the npm registry

echo Updating Homebox MCP Server...
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed
    echo Please install Node.js and npm first
    exit /b 1
)

REM Update the package globally
echo Updating homebox-mcp-server from npm registry...
npm update -g homebox-mcp-server

echo.
echo Update complete!
echo.
echo To verify the installation, run:
echo    npm list -g homebox-mcp-server
echo.
echo To check the version, run:
echo    homebox-mcp-server --version

pause
