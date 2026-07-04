@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo First time setup - installing dependencies, please wait...
  call npm install
)

if not exist .env (
  echo Creating your .env file from the template...
  copy .env.example .env >nul
  echo.
  echo NOTE: No API key set yet. Search will work now.
  echo To enable "Ask AI", open the .env file in this folder and add your Anthropic API key.
  echo.
)

start "" cmd /c "timeout /t 2 >nul && start http://localhost:4477"

echo Starting n8n Code Assistant...
echo Your browser will open automatically in a couple seconds.
echo To stop the site, close this window.
echo.
call npm start
