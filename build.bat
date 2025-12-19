@echo off
rem Build script for Lutheran Church Management System
rem Robust to being called from any location

cd /d %~dp0
call npm run build
echo Build complete. Files are in the 'build' directory.
pause
