<template>
  <ion-page>
    <!-- Header -->
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title color="light">Mis Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showAddTaskModal = true" class="create-button">
            <ion-icon :icon="add" color="light"></ion-icon>
            <span class="button-text">Nueva Tarea</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="task-content">
      <!-- Filtros mejorados -->
      <div class="filters-container sticky">
        <div class="filters-header">
          <h3>Filtrar Tareas</h3>
        </div>
        <ion-segment v-model="selectedFilter" @ion-change="filterTasks" class="custom-segment">
          <ion-segment-button value="all" class="filter-button">
            <ion-icon :icon="list"></ion-icon>
            <ion-label>Todas</ion-label>
          </ion-segment-button>
          <ion-segment-button value="pending" class="filter-button">
            <ion-icon :icon="time"></ion-icon>
            <ion-label>Pendientes</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed" class="filter-button">
            <ion-icon :icon="checkmarkCircle"></ion-icon>
            <ion-label>Completadas</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Botón flotante mejorado para agregar tarea -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="showAddTaskModal = true" color="primary" class="create-fab">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      
      <!-- Botón de acción rápida en la parte inferior -->
      <div class="quick-action-bar">
        <ion-button expand="block" @click="showAddTaskModal = true" class="quick-create-btn">
          <ion-icon :icon="add" slot="start"></ion-icon>
          Crear Nueva Tarea
        </ion-button>
      </div>

      <!-- Lista de tareas -->
      <div class="tasks-container">
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Cargando tareas...</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="empty-state">
          <ion-icon :icon="checkmarkCircle" size="large" color="medium"></ion-icon>
          <h3>No hay tareas</h3>
          <p>{{ selectedFilter === 'all' ? 'Crea tu primera tarea' : 'No hay tareas ' + (selectedFilter === 'pending' ? 'pendientes' : 'completadas') }}</p>
        </div>

        <div v-else>
          <div v-for="task in filteredTasks" :key="task.id" class="task-card" :class="{ 'completed': task.completed }">
            <div class="task-content-wrapper">
              <ion-checkbox 
                :checked="task.completed" 
                @ion-change="toggleTask(task.id)"
                class="task-checkbox"
              ></ion-checkbox>
              
              <div class="task-info" @click="editTask(task)">
                <h3 class="task-title">{{ task.title }}</h3>
                <p v-if="task.description" class="task-description">{{ task.description }}</p>
                <div class="task-meta">
                  <ion-chip v-if="getCategoryName(task.categoryId)" :color="getCategoryColor(task.categoryId)">
                    <ion-label>{{ getCategoryName(task.categoryId) }}</ion-label>
                  </ion-chip>
                  <ion-chip v-if="task.priority" :color="getPriorityColor(task.priority)">
                    <ion-label>{{ getPriorityText(task.priority) }}</ion-label>
                  </ion-chip>
                  <span v-if="task.dueDate" class="due-date">
                    <ion-icon :icon="calendar"></ion-icon>
                    {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
              
              <ion-button fill="clear" size="small" @click="deleteTask(task.id)">
                <ion-icon :icon="trash" color="danger"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Modal para agregar/editar tarea -->
    <ion-modal :is-open="showAddTaskModal" @did-dismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="modal-content">
        <form @submit.prevent="saveTask">
          <ion-list>
            <ion-item>
              <ion-input
                v-model="taskForm.title"
                label="Título"
                label-placement="stacked"
                placeholder="Título de la tarea"
                required
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-textarea
                v-model="taskForm.description"
                label="Descripción"
                label-placement="stacked"
                placeholder="Descripción (opcional)"
                rows="3"
              ></ion-textarea>
            </ion-item>
            
            <ion-item>
              <ion-select
                v-model="taskForm.categoryId"
                label="Categoría"
                label-placement="stacked"
                placeholder="Seleccionar categoría"
                required
              >
                <ion-select-option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            
            <ion-item>
              <ion-select
                v-model="taskForm.priority"
                label="Prioridad"
                label-placement="stacked"
                placeholder="Seleccionar prioridad"
              >
                <ion-select-option value="LOW">Baja</ion-select-option>
                <ion-select-option value="MEDIUM">Media</ion-select-option>
                <ion-select-option value="HIGH">Alta</ion-select-option>
                <ion-select-option value="URGENT">Urgente</ion-select-option>
              </ion-select>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Fecha límite (opcional)</ion-label>
              <div class="date-container">
                <ion-input
                  type="date"
                  :value="taskForm.dueDate ? taskForm.dueDate.split('T')[0] : ''"
                  @ion-input="updateDateFromInput"
                  placeholder="dd-mm-aaaa"
                  class="date-input-simple"
                  :min="new Date().toISOString().split('T')[0]"
                  :max="new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0]"
                ></ion-input>
                <ion-button 
                  v-if="taskForm.dueDate" 
                  fill="clear" 
                  size="small" 
                  @click="clearDateTime"
                  class="clear-date-btn"
                >
                  <ion-icon :icon="close" color="danger"></ion-icon>
                </ion-button>
              </div>
              <ion-note slot="helper" color="medium">
                <ion-icon :icon="calendar" size="small"></ion-icon>
                Opcional - Solo día, mes y año
              </ion-note>
            </ion-item>

            <!-- Solo mostrar checkbox de completada al editar -->
            <ion-item v-if="editingTask">
              <ion-checkbox
                v-model="taskForm.completed"
                label="Marcar como completada"
                label-placement="end"
              ></ion-checkbox>
            </ion-item>
          </ion-list>
          
          <div class="modal-actions">
            <ion-button expand="block" type="submit" :disabled="!taskForm.title || !taskForm.categoryId">
              {{ editingTask ? 'Actualizar' : 'Crear' }} Tarea
            </ion-button>
          </div>
        </form>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCheckbox,
  IonChip,
  IonModal,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonNote
} from '@ionic/vue'
import { add, checkmarkCircle, calendar, trash, list, time, close } from 'ionicons/icons'
import { taskService, categoryService } from '@/services/apiServiceFetch.js'

// Estado reactivo
const tasks = ref([])
const categories = ref([])
const loading = ref(false)
const selectedFilter = ref('all')
const showAddTaskModal = ref(false)
const editingTask = ref(null)

// Formulario de tarea
const taskForm = ref({
  title: '',
  description: '',
  categoryId: null,
  priority: 'MEDIUM',
  dueDate: null,
  completed: false
})

// Tareas filtradas
const filteredTasks = computed(() => {
  if (selectedFilter.value === 'all') return tasks.value
  if (selectedFilter.value === 'pending') return tasks.value.filter(task => !task.completed)
  if (selectedFilter.value === 'completed') return tasks.value.filter(task => task.completed)
  return tasks.value
})

// Cargar datos al montar el componente
onMounted(async () => {
  await loadData()
})

// Cargar tareas y categorías
const loadData = async () => {
  loading.value = true
  try {
    const [tasksData, categoriesData] = await Promise.all([
      taskService.getAll(),
      categoryService.getAll()
    ])
    tasks.value = tasksData
    categories.value = categoriesData
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar tareas
const filterTasks = () => {
  // El filtrado se hace automáticamente con computed
}

// Alternar estado de completado
const toggleTask = async (taskId) => {
  try {
    const updatedTask = await taskService.toggleCompleted(taskId)
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error)
  }
}

// Editar tarea
const editTask = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    categoryId: task.categoryId || null,
    priority: task.priority || 'MEDIUM',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : null, // Solo la fecha, sin hora
    completed: task.completed || false
  }
  showAddTaskModal.value = true
}

// Eliminar tarea
const deleteTask = async (taskId) => {
  try {
    await taskService.delete(taskId)
    tasks.value = tasks.value.filter(task => task.id !== taskId)
  } catch (error) {
    console.error('Error al eliminar tarea:', error)
  }
}

// Guardar tarea
const saveTask = async () => {
  try {
    console.log('Guardando tarea...', taskForm.value)
    
    const taskData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      priority: taskForm.value.priority,
      dueDate: taskForm.value.dueDate,
      categoryId: taskForm.value.categoryId,
      completed: taskForm.value.completed
    }

    console.log('Datos de la tarea:', taskData)

    if (editingTask.value) {
      // Actualizar tarea existente
      console.log('Actualizando tarea existente...')
      const updatedTask = await taskService.update(editingTask.value.id, taskData)
      const index = tasks.value.findIndex(task => task.id === editingTask.value.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    } else {
      // Crear nueva tarea
      console.log('Creando nueva tarea...')
      const newTask = await taskService.create(taskData)
      console.log('Tarea creada:', newTask)
      tasks.value.unshift(newTask)
    }

    closeModal()
  } catch (error) {
    console.error('Error al guardar tarea:', error)
    alert('Error al guardar tarea: ' + error.message)
  }
}

// Actualizar fecha desde input nativo (solo fecha, sin hora)
const updateDateFromInput = (event) => {
  const dateValue = event.target.value
  if (dateValue) {
    // Solo guardar la fecha, sin hora
    taskForm.value.dueDate = dateValue
  } else {
    taskForm.value.dueDate = null
  }
}

// Limpiar fecha y hora
const clearDateTime = () => {
  taskForm.value.dueDate = null
}

// Cerrar modal
const closeModal = () => {
  showAddTaskModal.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    categoryId: null,
    priority: 'MEDIUM',
    dueDate: null,
    completed: false
  }
}

// Obtener color de categoría
const getCategoryColor = (categoryId) => {
  const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger']
  return colors[categoryId % colors.length]
}

// Obtener color de prioridad
const getPriorityColor = (priority) => {
  const colors = {
    'LOW': 'success',
    'MEDIUM': 'warning',
    'HIGH': 'danger',
    'URGENT': 'danger'
  }
  return colors[priority] || 'medium'
}

// Obtener texto de prioridad
const getPriorityText = (priority) => {
  const texts = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta',
    'URGENT': 'Urgente'
  }
  return texts[priority] || priority
}

// Formatear fecha (solo día, mes y año)
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  // Si es solo fecha (YYYY-MM-DD), formatear directamente
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } else {
    // Si es solo fecha sin hora
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

// Obtener nombre de categoría por ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : null
}
</script>

<style scoped>
.custom-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.task-content {
  --background: #f5f5f5;
}

.filters-container {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.filters-container.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tasks-container {
  padding: 16px;
  padding-bottom: 100px;
}

/* Botón flotante */
ion-fab {
  --background: transparent;
}

ion-fab-button {
  --background: #007bff;
  --background-activated: #0056b3;
  --background-hover: #0056b3;
  --box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-state h3 {
  margin: 16px 0 8px 0;
  color: #333;
}

.task-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-card.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: #666;
}

.task-content-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.task-checkbox {
  margin-top: 4px;
}

.task-info {
  flex: 1;
  cursor: pointer;
}

.task-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.task-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.modal-content {
  --background: #f5f5f5;
}

.modal-actions {
  padding: 16px;
}

/* Estilos para el campo de fecha */
.datetime-field {
  --placeholder-color: #999;
  --placeholder-opacity: 0.8;
}

.datetime-field:not(.datetime-presentation) {
  --background: #f8f9fa;
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.datetime-field:not(.datetime-presentation):focus-within {
  --background: #fff;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

/* Estilo para la nota de ayuda */
ion-note {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-top: 4px;
}

/* Contenedor del campo de fecha */
.date-container {
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Input de fecha simplificado */
.date-input-simple {
  flex: 1;
  --background: #f8f9fa;
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --placeholder-color: #007bff;
  --placeholder-opacity: 0.8;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  font-weight: 500;
}

.date-input-simple:focus-within {
  --background: #fff;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

/* Placeholder personalizado para mejor visibilidad */
.date-input-simple::placeholder {
  color: #007bff !important;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

/* Estilo especial para el placeholder dd-mm-aaaa */
.date-input-simple::-webkit-input-placeholder {
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

.date-input-simple::-moz-placeholder {
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

.date-input-simple:-ms-input-placeholder {
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

/* Botón de limpiar fecha */
.clear-date-btn {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  min-width: 32px;
  min-height: 32px;
  flex-shrink: 0;
}

/* Botones de crear más visibles */
.create-button {
  --background: #007bff;
  --background-activated: #0056b3;
  --background-hover: #0056b3;
  --border-radius: 20px;
  --padding-start: 12px;
  --padding-end: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.button-text {
  margin-left: 8px;
  font-size: 14px;
}

/* Filtros mejorados */
.filters-container.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-header {
  padding: 16px 16px 8px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.filters-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.custom-segment {
  --background: #f8f9fa;
  padding: 8px 16px 16px 16px;
}

.filter-button {
  --background-checked: #007bff;
  --color-checked: white;
  --border-radius: 8px;
  font-weight: 500;
  min-height: 40px;
}

.filter-button ion-icon {
  margin-right: 4px;
  font-size: 16px;
}

/* Botón flotante mejorado */
.create-fab {
  --background: #007bff;
  --background-activated: #0056b3;
  --background-hover: #0056b3;
  --box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
  width: 56px;
  height: 56px;
}

/* Barra de acción rápida */
.quick-action-bar {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  z-index: 5;
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 2px solid #007bff;
}

.quick-create-btn {
  --background: #007bff;
  --background-activated: #0056b3;
  --background-hover: #0056b3;
  --border-radius: 8px;
  height: 48px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* Ajustar padding para el botón flotante */
.tasks-container {
  padding-bottom: 160px;
}

/* Responsive */
@media (max-width: 768px) {
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .due-date {
    margin-top: 4px;
  }
  
  .quick-action-bar {
    left: 8px;
    right: 8px;
  }
  
  .button-text {
    display: none;
  }
}
</style>
