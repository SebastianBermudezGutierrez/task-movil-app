@echo off
echo ========================================
echo    PROBANDO CONEXION CON AXIOS
echo ========================================
echo.
echo Verificando si axios está instalado...
node -e "console.log('Axios version:', require('axios/package.json').version)"
echo.
echo Probando importación de axios...
node -e "const axios = require('axios'); console.log('Axios importado correctamente:', typeof axios)"
echo.
echo Probando petición HTTP...
node -e "const axios = require('axios'); axios.get('http://localhost:8079/api/categories').then(r => console.log('Backend respondiendo:', r.status)).catch(e => console.log('Error:', e.message))"
echo.
echo Prueba completada.
