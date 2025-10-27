<template>
  <ion-page>
    <!-- Header con fondo translúcido -->
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title color="light">Sazón</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="create" color="light"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="edit-recipe-content">
      <div class="form-container">
        <h1 class="page-title">Editar receta</h1>

        <form @submit.prevent="updateRecipe">
          <!-- Título -->
          <ion-item class="form-item">
            <ion-label position="stacked">Título</ion-label>
            <ion-input
              v-model="recipe.title"
              placeholder="0/0/0"
              required
            ></ion-input>
          </ion-item>

          <!-- URL de imagen -->
          <ion-item class="form-item">
            <ion-label position="stacked">URL de imagen</ion-label>
            <ion-input
              v-model="imageUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              @input="updateImageFromUrl"
            ></ion-input>
          </ion-item>

          <!-- Vista previa de imagen -->
          <div class="image-preview-container" v-if="recipe.image">
            <img :src="recipe.image" alt="Recipe" class="recipe-preview">
            <ion-button 
              fill="clear" 
              size="small" 
              class="remove-image-btn"
              @click="removeImage"
            >
              <ion-icon :icon="close" color="danger"></ion-icon>
              Eliminar imagen
            </ion-button>
          </div>

          <!-- Placeholder cuando no hay imagen -->
          <div v-else class="image-placeholder">
            <ion-icon :icon="image" size="large" color="medium"></ion-icon>
            <p>Ingresa una URL de imagen arriba</p>
          </div>

          <!-- Descripción -->
          <ion-item class="form-item">
            <ion-label position="stacked">Descripción...</ion-label>
            <ion-textarea
              v-model="recipe.description"
              placeholder="Describe tu receta..."
              rows="3"
            ></ion-textarea>
          </ion-item>

          <!-- Ingredientes -->
          <ion-item class="form-item">
            <ion-label position="stacked">Ingredientes...</ion-label>
            <ion-textarea
              v-model="ingredientsText"
              placeholder="Lista los ingredientes, uno por línea..."
              rows="4"
            ></ion-textarea>
          </ion-item>

          <!-- Pasos -->
          <ion-item class="form-item">
            <ion-label position="stacked">Pasos a seguir...</ion-label>
            <ion-textarea
              v-model="stepsText"
              placeholder="Describe los pasos, uno por línea..."
              rows="4"
            ></ion-textarea>
          </ion-item>

          <!-- Botón editar -->
          <ion-button 
            expand="block" 
            class="save-button" 
            type="submit"
            :disabled="!recipe.title"
          >
            Editar
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea
} from '@ionic/vue'
import { create, image, close } from 'ionicons/icons'
import { getRecipeById, updateRecipe as updateRecipeData } from '@/data/recipes.js'

const router = useRouter()
const route = useRoute()

const recipe = ref({
  id: null,
  title: '',
  description: '',
  image: null,
  ingredients: [],
  steps: []
})

const ingredientsText = ref('')
const stepsText = ref('')
const imageUrl = ref('')

// Cargar receta si hay un ID en la ruta
onMounted(() => {
  if (route.params.id) {
    const recipeData = getRecipeById(parseInt(route.params.id))
  if (recipeData) {
    recipe.value = { ...recipeData }
    ingredientsText.value = recipe.value.ingredients.join('\n')
    stepsText.value = recipe.value.steps.join('\n')
    imageUrl.value = recipe.value.image || ''
  }
  } else {
    // Si no hay ID, cargar la primera receta como ejemplo
    const firstRecipe = getRecipeById(1)
  if (firstRecipe) {
    recipe.value = { ...firstRecipe }
    ingredientsText.value = recipe.value.ingredients.join('\n')
    stepsText.value = recipe.value.steps.join('\n')
    imageUrl.value = recipe.value.image || ''
  }
  }
})

const updateRecipe = () => {
  if (!recipe.value.title || !recipe.value.id) return

  const ingredients = ingredientsText.value
    .split('\n')
    .filter(item => item.trim() !== '')
    .map(item => item.trim())

  const steps = stepsText.value
    .split('\n')
    .filter(step => step.trim() !== '')
    .map(step => step.trim())

  const updatedData = {
    title: recipe.value.title,
    description: recipe.value.description,
    image: recipe.value.image,
    ingredients,
    steps
  }

  updateRecipeData(recipe.value.id, updatedData)
  
  // Mostrar mensaje de éxito y regresar a la lista
  setTimeout(() => {
    router.push('/tabs/tab1')
  }, 500)
}

const updateImageFromUrl = () => {
  if (imageUrl.value.trim()) {
    recipe.value.image = imageUrl.value.trim()
  } else {
    recipe.value.image = null
  }
}

const removeImage = () => {
  recipe.value.image = null
  imageUrl.value = ''
}
</script>

<style scoped>
.custom-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.edit-recipe-content {
  --background: transparent;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
  background-image: url('@/assets/food.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.form-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.form-item {
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 12px;
  --color: #333;
  --highlight-color-focused: #990000;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.form-item ion-label {
  color: #333 !important;
  font-weight: 600;
}

.form-item ion-input,
.form-item ion-textarea {
  --color: #333;
  --placeholder-color: #666;
}

.image-preview-container {
  margin-bottom: 20px;
  text-align: center;
}

.remove-image-btn {
  margin-top: 8px;
}

.image-placeholder {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px dashed #ccc;
  transition: all 0.3s ease;
}

.image-placeholder:hover {
  border-color: #990000;
  background: rgba(255, 255, 255, 1);
}

.image-placeholder p {
  margin: 10px 0 0 0;
  color: #666;
  font-size: 14px;
}

.recipe-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.save-button {
  --background: #990000;
  --background-activated: #7c0000;
  --background-hover: #7c0000;
  --border-radius: 12px;
  height: 50px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 20px;
}
</style>
