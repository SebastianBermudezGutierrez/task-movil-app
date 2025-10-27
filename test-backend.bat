@echo off
echo ========================================
echo    PRUEBA DE CONEXION CON BACKEND
echo ========================================
echo.
echo Probando conexion con el backend...
echo.

echo 1. Probando endpoint de categorias...
curl -X GET http://localhost:8079/api/categories
echo.
echo.

echo 2. Probando endpoint de tareas...
curl -X GET http://localhost:8079/api/tasks
echo.
echo.

echo 3. Creando una categoria de prueba...
curl -X POST http://localhost:8079/api/categories ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Prueba\",\"description\":\"Categoria de prueba\"}"
echo.
echo.

echo 4. Creando una tarea de prueba...
curl -X POST http://localhost:8079/api/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Tarea de Prueba\",\"description\":\"Descripcion de prueba\",\"priority\":\"MEDIUM\",\"categoryId\":1}"
echo.
echo.

echo Prueba completada. Revisa los resultados arriba.
pause
