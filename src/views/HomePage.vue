<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <!-- Estadísticas rápidas -->
      <div class="stats-container">
        <div class="stat-card completed-stat">
          <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
          <div class="stat-info">
            <h3 class="counter">{{ completedTasks }}</h3>
            <p>Completadas</p>
          </div>
        </div>
        
        <div class="stat-card">
          <ion-icon :icon="time" color="warning"></ion-icon>
          <div class="stat-info">
            <h3>{{ pendingTasks }}</h3>
            <p>Pendientes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <ion-icon :icon="folder" color="primary"></ion-icon>
          <div class="stat-info">
            <h3>{{ categories.length }}</h3>
            <p>Categorías</p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="action-buttons">
          <ion-button expand="block" @click="goToTasks" class="action-btn">
            <ion-icon :icon="list" slot="start"></ion-icon>
            Ver Todas las Tareas
          </ion-button>
          
          <ion-button expand="block" @click="goToCategories" class="action-btn">
            <ion-icon :icon="folder" slot="start"></ion-icon>
            Gestionar Categorías
          </ion-button>
        </div>
      </div>

      <!-- Tareas recientes -->
      <div class="recent-tasks">
        <h2>Tareas Recientes</h2>
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Cargando...</p>
        </div>
        
        <div v-else-if="recentTasks.length === 0" class="empty-state">
          <ion-icon :icon="checkmarkCircle" size="large" color="medium"></ion-icon>
          <h3>No hay tareas</h3>
          <p>Crea tu primera tarea para comenzar</p>
        </div>
        
        <div v-else>
          <div v-for="task in recentTasks" :key="task.id" class="task-item" :class="{ 'completed': task.completed }">
            <ion-checkbox 
              :checked="task.completed" 
              @ion-change="toggleTask(task.id)"
              class="task-checkbox"
            ></ion-checkbox>
            
            <div class="task-info">
              <h4 class="task-title">{{ task.title }}</h4>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <ion-chip v-if="getCategoryName(task.categoryId)" color="primary" size="small">
                  <ion-label>{{ getCategoryName(task.categoryId) }}</ion-label>
                </ion-chip>
                <span v-if="task.dueDate" class="due-date">
                  <ion-icon :icon="calendar" size="small"></ion-icon>
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>
            </div>
            
            <ion-button fill="clear" size="small" @click="deleteTask(task.id)" class="delete-btn">
              <ion-icon :icon="trash" color="danger"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onActivated, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonChip,
  IonLabel,
  IonSpinner
} from '@ionic/vue'
import { 
  checkmarkCircle, 
  time, 
  folder, 
  list, 
  calendar,
  trash
} from 'ionicons/icons'
import { taskService, categoryService } from '@/services/apiServiceFetch.js'

const router = useRouter()

// Estado reactivo
const tasks = ref([])
const categories = ref([])
const loading = ref(false)

// Computed properties
const completedTasks = computed(() => {
  return tasks.value.filter(task => task.completed).length
})

const pendingTasks = computed(() => {
  return tasks.value.filter(task => !task.completed).length
})

const recentTasks = computed(() => {
  return tasks.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// Cargar datos al montar el componente
onMounted(async () => {
  await loadData()
})

// Refrescar datos cuando se regrese a la página
onActivated(async () => {
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

// Navegación
const goToTasks = () => {
  router.push('/tabs/tab1')
}

const goToCategories = () => {
  router.push('/tabs/tab2')
}

// Alternar estado de completado
const toggleTask = async (taskId) => {
  try {
    const updatedTask = await taskService.toggleCompleted(taskId)
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      tasks.value[index] = updatedTask
      console.log('Tarea actualizada en Home:', updatedTask)
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error)
    alert('Error al actualizar tarea: ' + error.message)
  }
}

// Eliminar tarea
const deleteTask = async (taskId) => {
  try {
    await taskService.delete(taskId)
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    console.log('Tarea eliminada de Home')
  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    alert('Error al eliminar tarea: ' + error.message)
  }
}

// Obtener nombre de categoría por ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : null
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
</script>

<style scoped>
.dashboard-content {
  --background: #f5f5f5;
  padding: 16px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos especiales para el contador de completadas */
.completed-stat {
  border: 2px solid #28a745;
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
  animation: pulse 2s infinite;
}

.counter {
  font-size: 28px !important;
  font-weight: 800 !important;
  color: #28a745 !important;
  text-shadow: 0 1px 2px rgba(40, 167, 69, 0.3);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.quick-actions {
  margin-bottom: 24px;
}

.quick-actions h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  --background: #007bff;
  --background-activated: #0056b3;
  --background-hover: #0056b3;
  --border-radius: 8px;
  height: 48px;
  font-weight: 500;
}

.recent-tasks h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
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

.task-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
}

.task-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #666;
}

.task-checkbox {
  margin-top: 4px;
}

.task-info {
  flex: 1;
}

.task-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.task-description {
  margin: 0 0 8px 0;
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

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  min-width: 32px;
  min-height: 32px;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
