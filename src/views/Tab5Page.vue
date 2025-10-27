<template>
  <ion-page>
    <!-- Header con fondo translúcido -->
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title color="light">Sazón</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="person" color="light"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="profile-content">
      <div class="form-container">
        <h1 class="page-title">Mi Perfil</h1>

        <!-- Vista previa del perfil actual -->
        <div class="current-profile" v-if="currentUser">
          <div class="profile-header">
            <img :src="currentUser.profileImage" alt="Profile" class="profile-avatar">
            <div class="profile-stats">
              <h2>{{ currentUser.fullName }}</h2>
              <p>@{{ currentUser.username }}</p>
              <div class="stats">
                <span>{{ currentUser.recipesCount }} recetas</span>
                <span>{{ currentUser.favoritesCount }} favoritos</span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="updateProfile">
          <!-- Nombre completo -->
          <ion-item class="form-item">
            <ion-label position="stacked">Nombre completo</ion-label>
            <ion-input
              v-model="userProfile.fullName"
              placeholder="Ingresa tu nombre completo"
              required
            ></ion-input>
          </ion-item>

          <!-- Username -->
          <ion-item class="form-item">
            <ion-label position="stacked">Nombre de usuario</ion-label>
            <ion-input
              v-model="userProfile.username"
              placeholder="@username"
              required
            ></ion-input>
          </ion-item>

          <!-- Email -->
          <ion-item class="form-item">
            <ion-label position="stacked">Correo electrónico</ion-label>
            <ion-input
              v-model="userProfile.email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
            ></ion-input>
          </ion-item>

          <!-- Biografía -->
          <ion-item class="form-item">
            <ion-label position="stacked">Biografía</ion-label>
            <ion-textarea
              v-model="userProfile.bio"
              placeholder="Cuéntanos sobre ti y tu pasión por la cocina..."
              rows="3"
            ></ion-textarea>
          </ion-item>

          <!-- URL de imagen de perfil -->
          <ion-item class="form-item">
            <ion-label position="stacked">URL de imagen de perfil</ion-label>
            <ion-input
              v-model="imageUrl"
              placeholder="https://ejemplo.com/mi-foto.jpg"
              @input="updateProfileImageFromUrl"
            ></ion-input>
          </ion-item>

          <!-- Vista previa de imagen de perfil -->
          <div class="profile-preview-container" v-if="userProfile.profileImage">
            <h3>Vista previa actualizada:</h3>
            <div class="profile-preview">
              <img :src="userProfile.profileImage" alt="Profile" class="profile-image">
              <div class="profile-info">
                <h4>{{ userProfile.fullName || 'Nombre completo' }}</h4>
                <p>@{{ userProfile.username || 'username' }}</p>
                <p class="bio-preview">{{ userProfile.bio || 'Biografía...' }}</p>
              </div>
            </div>
          </div>

          <!-- Sección de cambio de contraseña -->
          <div class="password-section">
            <h3>Cambiar contraseña (opcional)</h3>
            
            <ion-item class="form-item">
              <ion-label position="stacked">Contraseña actual</ion-label>
              <ion-input
                v-model="passwordData.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña actual"
              ></ion-input>
              <ion-button
                slot="end"
                fill="clear"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <ion-icon :icon="showCurrentPassword ? eyeOff : eye"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item class="form-item">
              <ion-label position="stacked">Nueva contraseña</ion-label>
              <ion-input
                v-model="passwordData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Nueva contraseña"
              ></ion-input>
              <ion-button
                slot="end"
                fill="clear"
                @click="showNewPassword = !showNewPassword"
              >
                <ion-icon :icon="showNewPassword ? eyeOff : eye"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item class="form-item">
              <ion-label position="stacked">Confirmar nueva contraseña</ion-label>
              <ion-input
                v-model="passwordData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirma tu nueva contraseña"
              ></ion-input>
              <ion-button
                slot="end"
                fill="clear"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <ion-icon :icon="showConfirmPassword ? eyeOff : eye"></ion-icon>
              </ion-button>
            </ion-item>
          </div>

          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="error-message">
            <ion-icon :icon="alertCircle" color="danger"></ion-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Mensaje de éxito -->
          <div v-if="successMessage" class="success-message">
            <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Botones de acción -->
          <div class="action-buttons">
            <ion-button 
              expand="block" 
              class="update-button" 
              type="submit"
              :disabled="!isFormValid"
            >
              Actualizar Perfil
            </ion-button>

            <ion-button 
              expand="block" 
              fill="outline"
              class="logout-button"
              @click="logout"
            >
              Cerrar Sesión
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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
import { person, eye, eyeOff, alertCircle, checkmarkCircle } from 'ionicons/icons'
import { getCurrentUser, updateUser, usernameExists, emailExists } from '@/data/users.js'

const router = useRouter()

const currentUser = ref(null)
const userProfile = ref({
  fullName: '',
  username: '',
  email: '',
  bio: '',
  profileImage: null
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const imageUrl = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isFormValid = computed(() => {
  return userProfile.value.fullName && 
         userProfile.value.username && 
         userProfile.value.email
})

onMounted(() => {
  loadUserProfile()
})

const loadUserProfile = () => {
  currentUser.value = getCurrentUser()
  if (currentUser.value) {
    userProfile.value = {
      fullName: currentUser.value.fullName,
      username: currentUser.value.username,
      email: currentUser.value.email,
      bio: currentUser.value.bio,
      profileImage: currentUser.value.profileImage
    }
    imageUrl.value = currentUser.value.profileImage || ''
  }
}

const updateProfileImageFromUrl = () => {
  if (imageUrl.value.trim()) {
    userProfile.value.profileImage = imageUrl.value.trim()
  } else {
    userProfile.value.profileImage = null
  }
}

const updateProfile = () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!currentUser.value) {
    errorMessage.value = 'No hay usuario logueado'
    return
  }

  // Validar cambios de email y username
  if (userProfile.value.email !== currentUser.value.email && 
      emailExists(userProfile.value.email)) {
    errorMessage.value = 'Este correo electrónico ya está registrado'
    return
  }

  if (userProfile.value.username !== currentUser.value.username && 
      usernameExists(userProfile.value.username)) {
    errorMessage.value = 'Este nombre de usuario ya está en uso'
    return
  }

  // Validar cambio de contraseña si se proporcionó
  if (passwordData.value.currentPassword || 
      passwordData.value.newPassword || 
      passwordData.value.confirmPassword) {
    
    if (!passwordData.value.currentPassword || 
        !passwordData.value.newPassword || 
        !passwordData.value.confirmPassword) {
      errorMessage.value = 'Para cambiar la contraseña, completa todos los campos'
      return
    }

    if (passwordData.value.currentPassword !== currentUser.value.password) {
      errorMessage.value = 'La contraseña actual es incorrecta'
      return
    }

    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
      errorMessage.value = 'Las nuevas contraseñas no coinciden'
      return
    }

    if (passwordData.value.newPassword.length < 6) {
      errorMessage.value = 'La nueva contraseña debe tener al menos 6 caracteres'
      return
    }
  }

  // Actualizar perfil
  const updatedData = {
    fullName: userProfile.value.fullName,
    username: userProfile.value.username,
    email: userProfile.value.email,
    bio: userProfile.value.bio,
    profileImage: userProfile.value.profileImage
  }

  // Si se cambió la contraseña, incluirla
  if (passwordData.value.newPassword) {
    updatedData.password = passwordData.value.newPassword
  }

  updateUser(currentUser.value.id, updatedData)
  
  // Limpiar campos de contraseña
  passwordData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  successMessage.value = 'Perfil actualizado correctamente'
  
  // Recargar perfil
  setTimeout(() => {
    loadUserProfile()
    successMessage.value = ''
  }, 2000)
}

const logout = () => {
  // En una implementación real, aquí limpiarías la sesión
  router.push('/home')
}
</script>

<style scoped>
.custom-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.profile-content {
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

.current-profile {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #990000;
}

.profile-stats h2 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 20px;
}

.profile-stats p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 16px;
}

.stats {
  display: flex;
  gap: 15px;
}

.stats span {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
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

.profile-preview-container {
  margin: 20px 0;
  text-align: center;
}

.profile-preview-container h3 {
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.profile-preview {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #990000;
}

.profile-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.profile-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.bio-preview {
  font-style: italic;
  color: #888;
}

.password-section {
  margin-top: 30px;
}

.password-section h3 {
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.error-message {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4444;
  font-weight: 500;
}

.success-message {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #44ff44;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #44aa44;
  font-weight: 500;
}

.action-buttons {
  margin-top: 30px;
}

.update-button {
  --background: #990000;
  --background-activated: #7c0000;
  --background-hover: #7c0000;
  --border-radius: 12px;
  height: 50px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.logout-button {
  --border-color: #990000;
  --color: #990000;
  --border-radius: 12px;
  height: 50px;
  font-weight: 600;
  font-size: 16px;
}
</style>
