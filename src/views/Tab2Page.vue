<template>
  <ion-page>
    <!-- Header -->
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title color="light">Categorías</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showAddCategoryModal = true" class="create-button">
            <ion-icon :icon="add" color="light"></ion-icon>
            <span class="button-text">Nueva Categoría</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="category-content">
      <!-- Lista de categorías -->
      <div class="categories-container">
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Cargando categorías...</p>
        </div>

        <div v-else-if="categories.length === 0" class="empty-state">
          <ion-icon :icon="folderOpen" size="large" color="medium"></ion-icon>
          <h3>No hay categorías</h3>
          <p>Crea tu primera categoría para organizar tus tareas</p>
        </div>

        <div v-else>
          <div v-for="category in categories" :key="category.id" class="category-card">
            <div class="category-content-wrapper">
              <div class="category-info" @click="editCategory(category)">
                <h3 class="category-name">{{ category.name }}</h3>
                <p v-if="category.description" class="category-description">{{ category.description }}</p>
                <div class="category-meta">
                  <ion-chip color="primary">
                    <ion-label>{{ getTaskCount(category.id) }} tareas</ion-label>
                  </ion-chip>
                </div>
              </div>
              
              <div class="category-actions">
                <ion-button fill="clear" size="small" @click="editCategory(category)">
                  <ion-icon :icon="create" color="primary"></ion-icon>
                </ion-button>
                <ion-button fill="clear" size="small" @click="deleteCategory(category.id)">
                  <ion-icon :icon="trash" color="danger"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botón flotante mejorado para agregar categoría -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="showAddCategoryModal = true" color="primary" class="create-fab">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      
      <!-- Botón de acción rápida en la parte inferior -->
      <div class="quick-action-bar">
        <ion-button expand="block" @click="showAddCategoryModal = true" class="quick-create-btn">
          <ion-icon :icon="add" slot="start"></ion-icon>
          Crear Nueva Categoría
        </ion-button>
      </div>
    </ion-content>

    <!-- Modal para agregar/editar categoría -->
    <ion-modal :is-open="showAddCategoryModal" @did-dismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="modal-content">
        <form @submit.prevent="saveCategory">
          <ion-list>
            <ion-item>
              <ion-input
                v-model="categoryForm.name"
                label="Nombre"
                label-placement="stacked"
                placeholder="Nombre de la categoría"
                required
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-textarea
                v-model="categoryForm.description"
                label="Descripción"
                label-placement="stacked"
                placeholder="Descripción (opcional)"
                rows="3"
              ></ion-textarea>
            </ion-item>
          </ion-list>
          
          <div class="modal-actions">
            <ion-button expand="block" type="submit" :disabled="!categoryForm.name">
              {{ editingCategory ? 'Actualizar' : 'Crear' }} Categoría
            </ion-button>
          </div>
        </form>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonChip,
  IonLabel,
  IonModal,
  IonSpinner
} from '@ionic/vue'
import { add, folderOpen, create, trash } from 'ionicons/icons'
import { categoryService, taskService } from '@/services/apiServiceFetch.js'

// Estado reactivo
const categories = ref([])
const tasks = ref([])
const loading = ref(false)
const showAddCategoryModal = ref(false)
const editingCategory = ref(null)

// Formulario de categoría
const categoryForm = ref({
  name: '',
  description: ''
})

// Cargar datos al montar el componente
onMounted(async () => {
  await loadData()
})

// Cargar categorías y tareas
const loadData = async () => {
  loading.value = true
  try {
    const [categoriesData, tasksData] = await Promise.all([
      categoryService.getAll(),
      taskService.getAll()
    ])
    categories.value = categoriesData
    tasks.value = tasksData
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

// Obtener número de tareas por categoría
const getTaskCount = (categoryId) => {
  return tasks.value.filter(task => task.categoryId === categoryId).length
}

// Editar categoría
const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || ''
  }
  showAddCategoryModal.value = true
}

// Eliminar categoría
const deleteCategory = async (categoryId) => {
  try {
    await categoryService.delete(categoryId)
    categories.value = categories.value.filter(category => category.id !== categoryId)
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
  }
}

// Guardar categoría
const saveCategory = async () => {
  try {
    console.log('Guardando categoría...', categoryForm.value)
    
    if (editingCategory.value) {
      // Actualizar categoría existente
      console.log('Actualizando categoría existente...')
      const updatedCategory = await categoryService.update(editingCategory.value.id, categoryForm.value)
      const index = categories.value.findIndex(category => category.id === editingCategory.value.id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
    } else {
      // Crear nueva categoría
      console.log('Creando nueva categoría...')
      const newCategory = await categoryService.create(categoryForm.value)
      console.log('Categoría creada:', newCategory)
      categories.value.unshift(newCategory)
    }

    closeModal()
  } catch (error) {
    console.error('Error al guardar categoría:', error)
    alert('Error al guardar categoría: ' + error.message)
  }
}

// Cerrar modal
const closeModal = () => {
  showAddCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: ''
  }
}
</script>

<style scoped>
.custom-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.category-content {
  --background: #f5f5f5;
}

.categories-container {
  padding: 16px;
  padding-bottom: 100px;
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

.category-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-content-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.category-info {
  flex: 1;
  cursor: pointer;
}

.category-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.category-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.category-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.category-actions {
  display: flex;
  gap: 4px;
}

.modal-content {
  --background: #f5f5f5;
}

.modal-actions {
  padding: 16px;
}

/* Botones de crear más visibles */
.create-button {
  --background: #28a745;
  --background-activated: #1e7e34;
  --background-hover: #1e7e34;
  --border-radius: 20px;
  --padding-start: 12px;
  --padding-end: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.button-text {
  margin-left: 8px;
  font-size: 14px;
}

/* Botón flotante mejorado */
.create-fab {
  --background: #28a745;
  --background-activated: #1e7e34;
  --background-hover: #1e7e34;
  --box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
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
  border: 2px solid #28a745;
}

.quick-create-btn {
  --background: #28a745;
  --background-activated: #1e7e34;
  --background-hover: #1e7e34;
  --border-radius: 8px;
  height: 48px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

/* Ajustar padding para el botón flotante */
.categories-container {
  padding-bottom: 160px;
}

/* Responsive */
@media (max-width: 768px) {
  .category-content-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-actions {
    align-self: flex-end;
    margin-top: 8px;
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
