import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.js';

// Crear instancia de axios con configuración
const apiClient = axios.create(API_CONFIG);

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Manejar errores específicos
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;
      console.error(`Error ${status}:`, data);
      
      // Mostrar mensaje de error más específico
      if (status === 404) {
        throw new Error('Recurso no encontrado');
      } else if (status === 500) {
        throw new Error('Error interno del servidor');
      } else if (status === 400) {
        throw new Error(data.message || 'Datos inválidos');
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo más pasó
      throw new Error('Error inesperado');
    }
    
    return Promise.reject(error);
  }
);

// Servicio para Categorías
export const categoryService = {
  // Obtener todas las categorías
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías: ' + error.message);
    }
  },

  // Obtener categoría por ID
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categoría: ' + error.message);
    }
  },

  // Crear nueva categoría
  async create(categoryData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear categoría: ' + error.message);
    }
  },

  // Actualizar categoría
  async update(id, categoryData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), categoryData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar categoría: ' + error.message);
    }
  },

  // Eliminar categoría
  async delete(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
      return true;
    } catch (error) {
      throw new Error('Error al eliminar categoría: ' + error.message);
    }
  }
};

// Servicio para Tareas
export const taskService = {
  // Obtener todas las tareas
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TASKS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener tareas: ' + error.message);
    }
  },

  // Obtener tarea por ID
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TASKS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener tarea: ' + error.message);
    }
  },

  // Obtener tareas por categoría
  async getByCategory(categoryId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TASKS.GET_BY_CATEGORY(categoryId));
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener tareas por categoría: ' + error.message);
    }
  },

  // Crear nueva tarea
  async create(taskData) {
    try {
      // Convertir el objeto category a categoryId
      const taskToCreate = {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        categoryId: taskData.category?.id || taskData.categoryId
      };
      
      const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, taskToCreate);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear tarea: ' + error.message);
    }
  },

  // Actualizar tarea
  async update(id, taskData) {
    try {
      // Convertir el objeto category a categoryId
      const taskToUpdate = {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed,
        categoryId: taskData.category?.id || taskData.categoryId
      };
      
      const response = await apiClient.put(API_ENDPOINTS.TASKS.UPDATE(id), taskToUpdate);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar tarea: ' + error.message);
    }
  },

  // Alternar estado de completado
  async toggleCompleted(id) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.TASKS.TOGGLE(id));
      return response.data;
    } catch (error) {
      throw new Error('Error al cambiar estado de tarea: ' + error.message);
    }
  },

  // Eliminar tarea
  async delete(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id));
      return true;
    } catch (error) {
      throw new Error('Error al eliminar tarea: ' + error.message);
    }
  }
};

export default apiClient;
