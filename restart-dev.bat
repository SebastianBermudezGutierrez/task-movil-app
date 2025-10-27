@echo off
echo ========================================
echo    REINICIANDO FRONTEND
echo ========================================
echo.
echo Limpiando caché...
npm run build -- --force
echo.
echo Iniciando servidor de desarrollo...
echo.
echo URL: http://localhost:8100
echo Backend: http://localhost:8079/api
echo.
npm run dev
