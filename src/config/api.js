import { getApiUrl } from './environment.js';

// Configuración de la API
const API_BASE_URL = getApiUrl();

// Función para generar endpoints dinámicamente
const createEndpoints = (baseUrl) => ({
  // Categorías
  CATEGORIES: {
    GET_ALL: `${baseUrl}/categories`,
    GET_BY_ID: (id) => `${baseUrl}/categories/${id}`,
    CREATE: `${baseUrl}/categories`,
    UPDATE: (id) => `${baseUrl}/categories/${id}`,
    DELETE: (id) => `${baseUrl}/categories/${id}`
  },
  
  // Tareas
  TASKS: {
    GET_ALL: `${baseUrl}/tasks`,
    GET_BY_ID: (id) => `${baseUrl}/tasks/${id}`,
    GET_BY_CATEGORY: (categoryId) => `${baseUrl}/tasks/category/${categoryId}`,
    CREATE: `${baseUrl}/tasks`,
    UPDATE: (id) => `${baseUrl}/tasks/${id}`,
    TOGGLE: (id) => `${baseUrl}/tasks/${id}/toggle`,
    DELETE: (id) => `${baseUrl}/tasks/${id}`
  }
});

export const API_ENDPOINTS = createEndpoints(API_BASE_URL);

// Configuración de axios
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Función para cambiar la URL base (útil para producción)
export const setApiBaseUrl = (newUrl) => {
  Object.keys(API_ENDPOINTS.CATEGORIES).forEach(key => {
    if (typeof API_ENDPOINTS.CATEGORIES[key] === 'string') {
      API_ENDPOINTS.CATEGORIES[key] = API_ENDPOINTS.CATEGORIES[key].replace(API_BASE_URL, newUrl);
    }
  });
  
  Object.keys(API_ENDPOINTS.TASKS).forEach(key => {
    if (typeof API_ENDPOINTS.TASKS[key] === 'string') {
      API_ENDPOINTS.TASKS[key] = API_ENDPOINTS.TASKS[key].replace(API_BASE_URL, newUrl);
    }
  });
  
  API_CONFIG.baseURL = newUrl;
};
