# Gestión de Tareas - Frontend

Aplicación web para gestión de tareas con categorías, desarrollada con Ionic Vue.

## 🚀 Características

- ✅ **Gestión de Tareas**: Crear, editar, eliminar y marcar como completadas
- 📁 **Categorías**: Organizar tareas por categorías
- 🎨 **Interfaz Moderna**: Diseño responsive con Ionic
- 🔄 **Tiempo Real**: Sincronización automática con el backend
- 📱 **Multiplataforma**: Funciona en web, móvil y desktop

## 🛠️ Tecnologías

- **Vue 3** - Framework de JavaScript
- **Ionic Vue** - UI Framework
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar la API:**
   - Edita `src/config/environment.js`
   - Cambia la URL de producción si es necesario

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

## ⚙️ Configuración

### Variables de Entorno

El frontend detecta automáticamente el entorno:

- **Desarrollo**: `http://localhost:8079/api`
- **Producción**: `https://tu-dominio-backend.com/api`

### Cambiar URL de Producción

Edita el archivo `src/config/environment.js`:

```javascript
API_URLS: {
  development: 'http://localhost:8079/api',
  production: 'https://tu-backend-produccion.com/api' // Cambiar aquí
}
```

## 🔗 Conexión con Backend

El frontend se conecta automáticamente con el backend Spring Boot:

- **Puerto**: 8079
- **Endpoints**: `/api/categories` y `/api/tasks`
- **CORS**: Configurado para permitir peticiones desde el frontend

## 📱 Uso

### Gestión de Tareas
1. **Ver tareas**: Lista todas las tareas con filtros
2. **Crear tarea**: Botón "+" en la esquina superior derecha
3. **Editar tarea**: Toca una tarea para editarla
4. **Completar tarea**: Marca el checkbox
5. **Eliminar tarea**: Botón de eliminar en cada tarea

### Gestión de Categorías
1. **Ver categorías**: Lista todas las categorías
2. **Crear categoría**: Botón "+" en la esquina superior derecha
3. **Editar categoría**: Toca una categoría para editarla
4. **Eliminar categoría**: Botón de eliminar en cada categoría

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción
```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

### Despliegue en la Nube

1. **Construir el proyecto:**
   ```bash
   npm run build
   ```

2. **Subir archivos** de la carpeta `dist/` a tu servidor web

3. **Configurar la URL** del backend en `environment.js`

## 🔧 Solución de Problemas

### Error de Conexión
- Verifica que el backend esté ejecutándose en el puerto 8079
- Revisa la configuración de CORS en el backend
- Verifica la URL en `src/config/environment.js`

### Error de CORS
- Asegúrate de que el backend tenga configurado CORS correctamente
- Verifica que la URL del frontend esté en la lista de orígenes permitidos

## 📝 Notas

- El frontend está optimizado para funcionar con el backend Spring Boot
- La configuración es automática para desarrollo local
- Para producción, solo necesitas cambiar la URL del backend
