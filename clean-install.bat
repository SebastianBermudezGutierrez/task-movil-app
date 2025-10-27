@echo off
echo ========================================
echo    LIMPIEZA COMPLETA Y REINSTALACION
echo ========================================
echo.
echo Eliminando node_modules...
rmdir /s /q node_modules
echo.
echo Eliminando package-lock.json...
del package-lock.json
echo.
echo Limpiando caché de npm...
npm cache clean --force
echo.
echo Reinstalando dependencias...
npm install
echo.
echo Iniciando servidor de desarrollo...
echo.
echo URL: http://localhost:8100
echo Backend: http://localhost:8079/api
echo.
npm run dev
