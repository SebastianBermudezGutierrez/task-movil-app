// Servicio alternativo usando fetch nativo (sin dependencias externas)
import { API_ENDPOINTS } from '../config/api.js';

// Función helper para hacer peticiones HTTP
const makeRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicio para Categorías
export const categoryService = {
  // Obtener todas las categorías
  async getAll() {
    try {
      return await makeRequest(API_ENDPOINTS.CATEGORIES.GET_ALL);
    } catch (error) {
      throw new Error('Error al obtener categorías: ' + error.message);
    }
  },

  // Obtener categoría por ID
  async getById(id) {
    try {
      return await makeRequest(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
    } catch (error) {
      throw new Error('Error al obtener categoría: ' + error.message);
    }
  },

  // Crear nueva categoría
  async create(categoryData) {
    try {
      return await makeRequest(API_ENDPOINTS.CATEGORIES.CREATE, {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    } catch (error) {
      throw new Error('Error al crear categoría: ' + error.message);
    }
  },

  // Actualizar categoría
  async update(id, categoryData) {
    try {
      return await makeRequest(API_ENDPOINTS.CATEGORIES.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
    } catch (error) {
      throw new Error('Error al actualizar categoría: ' + error.message);
    }
  },

  // Eliminar categoría
  async delete(id) {
    try {
      await makeRequest(API_ENDPOINTS.CATEGORIES.DELETE(id), {
        method: 'DELETE'
      });
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
      return await makeRequest(API_ENDPOINTS.TASKS.GET_ALL);
    } catch (error) {
      throw new Error('Error al obtener tareas: ' + error.message);
    }
  },

  // Obtener tarea por ID
  async getById(id) {
    try {
      return await makeRequest(API_ENDPOINTS.TASKS.GET_BY_ID(id));
    } catch (error) {
      throw new Error('Error al obtener tarea: ' + error.message);
    }
  },

  // Obtener tareas por categoría
  async getByCategory(categoryId) {
    try {
      return await makeRequest(API_ENDPOINTS.TASKS.GET_BY_CATEGORY(categoryId));
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
      
      return await makeRequest(API_ENDPOINTS.TASKS.CREATE, {
        method: 'POST',
        body: JSON.stringify(taskToCreate)
      });
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
      
      return await makeRequest(API_ENDPOINTS.TASKS.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify(taskToUpdate)
      });
    } catch (error) {
      throw new Error('Error al actualizar tarea: ' + error.message);
    }
  },

  // Alternar estado de completado
  async toggleCompleted(id) {
    try {
      return await makeRequest(API_ENDPOINTS.TASKS.TOGGLE(id), {
        method: 'PATCH'
      });
    } catch (error) {
      throw new Error('Error al cambiar estado de tarea: ' + error.message);
    }
  },

  // Eliminar tarea
  async delete(id) {
    try {
      await makeRequest(API_ENDPOINTS.TASKS.DELETE(id), {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      throw new Error('Error al eliminar tarea: ' + error.message);
    }
  }
};

export default { categoryService, taskService };
