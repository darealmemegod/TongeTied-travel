@echo off
chcp 65001 >nul
title 🚀 Localhost Server 8000
color 0A

echo ========================================
echo    Запуск локального сервера Windows
echo    http://localhost:8000
echo ========================================
echo.

:: Создаем PowerShell скрипт на лету
echo $port = 8000 > %temp%\localserver.ps1
echo $root = (Get-Location).Path >> %temp%\localserver.ps1
echo $listener = New-Object System.Net.HttpListener >> %temp%\localserver.ps1
echo $listener.Prefixes.Add("http://localhost:$port/") >> %temp%\localserver.ps1
echo $listener.Start() >> %temp%\localserver.ps1
echo "Сервер запущен на http://localhost:$port" >> %temp%\localserver.ps1
echo "Каталог: $root" >> %temp%\localserver.ps1
echo "Нажмите Ctrl+C для остановки..." >> %temp%\localserver.ps1
echo. >> %temp%\localserver.ps1
echo while ($listener.IsListening) { >> %temp%\localserver.ps1
echo   $context = $listener.GetContext() >> %temp%\localserver.ps1
echo   $request = $context.Request >> %temp%\localserver.ps1
echo   $response = $context.Response >> %temp%\localserver.ps1
echo. >> %temp%\localserver.ps1
echo   $filePath = $root + $request.Url.LocalPath >> %temp%\localserver.ps1
echo   if ($filePath -like "*/") { $filePath = $filePath + "index.html" } >> %temp%\localserver.ps1
echo. >> %temp%\localserver.ps1
echo   if (Test-Path $filePath) { >> %temp%\localserver.ps1
echo     $content = [System.IO.File]::ReadAllText($filePath) >> %temp%\localserver.ps1
echo     $buffer = [System.Text.Encoding]::UTF8.GetBytes($content) >> %temp%\localserver.ps1
echo     $response.ContentLength64 = $buffer.Length >> %temp%\localserver.ps1
echo. >> %temp%\localserver.ps1
echo     # Определяем Content-Type >> %temp%\localserver.ps1
echo     $ext = [System.IO.Path]::GetExtension($filePath).ToLower() >> %temp%\localserver.ps1
echo     $contentType = "text/html" >> %temp%\localserver.ps1
echo     if ($ext -eq ".css") { $contentType = "text/css" } >> %temp%\localserver.ps1
echo     elseif ($ext -eq ".js") { $contentType = "text/javascript" } >> %temp%\localserver.ps1
echo     elseif ($ext -eq ".json") { $contentType = "application/json" } >> %temp%\localserver.ps1
echo     elseif ($ext -eq ".png") { $contentType = "image/png" } >> %temp%\localserver.ps1
echo     elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" } >> %temp%\localserver.ps1
echo     elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" } >> %temp%\localserver.ps1
echo. >> %temp%\localserver.ps1
echo     $response.ContentType = $contentType >> %temp%\localserver.ps1
echo     $output = $response.OutputStream >> %temp%\localserver.ps1
echo     $output.Write($buffer, 0, $buffer.Length) >> %temp%\localserver.ps1
echo     $output.Close() >> %temp%\localserver.ps1
echo   } else { >> %temp%\localserver.ps1
echo     $response.StatusCode = 404 >> %temp%\localserver.ps1
echo     $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found") >> %temp%\localserver.ps1
echo     $response.ContentLength64 = $buffer.Length >> %temp%\localserver.ps1
echo     $output = $response.OutputStream >> %temp%\localserver.ps1
echo     $output.Write($buffer, 0, $buffer.Length) >> %temp%\localserver.ps1
echo     $output.Close() >> %temp%\localserver.ps1
echo   } >> %temp%\localserver.ps1
echo } >> %temp%\localserver.ps1

echo [INFO] Запуск встроенного PowerShell сервера...
echo [INFO] Каталог: %CD%
echo [INFO] Адрес: http://localhost:8000
echo.

:: Открываем браузер
start http://localhost:8000

:: Запускаем PowerShell сервер
powershell -ExecutionPolicy Bypass -File %temp%\localserver.ps1

echo.
echo [INFO] Сервер остановлен
pause