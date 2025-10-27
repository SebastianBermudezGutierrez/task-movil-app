// Configuración de entorno
export const ENVIRONMENT = {
  // Detectar si estamos en desarrollo
  isDevelopment: import.meta.env.DEV || window.location.hostname === 'localhost',
  
  // Detectar si estamos en producción
  isProduction: import.meta.env.PROD && window.location.hostname !== 'localhost',
  
  // URLs de la API
  API_URLS: {
    development: 'http://localhost:8079/api',
    production: 'https://tu-dominio-backend.com/api' // Cambiar por tu URL de producción
  },
  
  // Configuración de la aplicación
  APP: {
    name: 'Gestión de Tareas',
    version: '1.0.0',
    description: 'Sistema de gestión de tareas con categorías'
  }
};

// Función para obtener la URL de la API según el entorno
export const getApiUrl = () => {
  if (ENVIRONMENT.isDevelopment) {
    return ENVIRONMENT.API_URLS.development;
  }
  return ENVIRONMENT.API_URLS.production;
};

// Función para obtener configuración de debug
export const getDebugConfig = () => ({
  enabled: ENVIRONMENT.isDevelopment,
  logLevel: ENVIRONMENT.isDevelopment ? 'debug' : 'error'
});
