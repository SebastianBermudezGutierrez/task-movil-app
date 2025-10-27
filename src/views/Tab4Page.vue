<template>
  <ion-page>
    <!-- Header con fondo translúcido -->
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title color="light">Sazón</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="personAdd" color="light"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="register-content">
      <div class="form-container">
        <h1 class="page-title">Registro de Usuario</h1>

        <form @submit.prevent="registerUser">
          <!-- Nombre completo -->
          <ion-item class="form-item">
            <ion-label position="stacked">Nombre completo</ion-label>
            <ion-input
              v-model="newUser.fullName"
              placeholder="Ingresa tu nombre completo"
              required
            ></ion-input>
          </ion-item>

          <!-- Username -->
          <ion-item class="form-item">
            <ion-label position="stacked">Nombre de usuario</ion-label>
            <ion-input
              v-model="newUser.username"
              placeholder="@username"
              required
            ></ion-input>
          </ion-item>

          <!-- Email -->
          <ion-item class="form-item">
            <ion-label position="stacked">Correo electrónico</ion-label>
            <ion-input
              v-model="newUser.email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
            ></ion-input>
          </ion-item>

          <!-- Contraseña -->
          <ion-item class="form-item">
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input
              v-model="newUser.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              required
            ></ion-input>
            <ion-button
              slot="end"
              fill="clear"
              @click="showPassword = !showPassword"
            >
              <ion-icon :icon="showPassword ? eyeOff : eye"></ion-icon>
            </ion-button>
          </ion-item>

          <!-- Confirmar contraseña -->
          <ion-item class="form-item">
            <ion-label position="stacked">Confirmar contraseña</ion-label>
            <ion-input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repite tu contraseña"
              required
            ></ion-input>
            <ion-button
              slot="end"
              fill="clear"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <ion-icon :icon="showConfirmPassword ? eyeOff : eye"></ion-icon>
            </ion-button>
          </ion-item>

          <!-- Biografía -->
          <ion-item class="form-item">
            <ion-label position="stacked">Biografía (opcional)</ion-label>
            <ion-textarea
              v-model="newUser.bio"
              placeholder="Cuéntanos sobre ti y tu pasión por la cocina..."
              rows="3"
            ></ion-textarea>
          </ion-item>

          <!-- URL de imagen de perfil -->
          <ion-item class="form-item">
            <ion-label position="stacked">URL de imagen de perfil (opcional)</ion-label>
            <ion-input
              v-model="imageUrl"
              placeholder="https://ejemplo.com/mi-foto.jpg"
              @input="updateProfileImageFromUrl"
            ></ion-input>
          </ion-item>

          <!-- Vista previa de imagen de perfil -->
          <div class="profile-preview-container" v-if="newUser.profileImage">
            <h3>Vista previa del perfil:</h3>
            <div class="profile-preview">
              <img :src="newUser.profileImage" alt="Profile" class="profile-image">
              <div class="profile-info">
                <h4>{{ newUser.fullName || 'Nombre completo' }}</h4>
                <p>@{{ newUser.username || 'username' }}</p>
                <p class="bio-preview">{{ newUser.bio || 'Biografía...' }}</p>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="error-message">
            <ion-icon :icon="alertCircle" color="danger"></ion-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Botón registrar -->
          <ion-button 
            expand="block" 
            class="register-button" 
            type="submit"
            :disabled="!isFormValid"
          >
            Registrarse
          </ion-button>

          <!-- Enlace para iniciar sesión -->
          <div class="login-link">
            <p>¿Ya tienes cuenta?</p>
            <ion-button fill="clear" @click="goToLogin">
              Iniciar sesión
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { personAdd, eye, eyeOff, alertCircle } from 'ionicons/icons'
import { registerUser as registerUserData, emailExists, usernameExists, setCurrentUser } from '@/data/users.js'

const router = useRouter()

const newUser = ref({
  fullName: '',
  username: '',
  email: '',
  password: '',
  bio: '',
  profileImage: null
})

const confirmPassword = ref('')
const imageUrl = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return newUser.value.fullName && 
         newUser.value.username && 
         newUser.value.email && 
         newUser.value.password && 
         confirmPassword.value &&
         newUser.value.password === confirmPassword.value
})

const updateProfileImageFromUrl = () => {
  if (imageUrl.value.trim()) {
    newUser.value.profileImage = imageUrl.value.trim()
  } else {
    newUser.value.profileImage = null
  }
}

const registerUser = () => {
  errorMessage.value = ''
  
  // Validaciones
  if (newUser.value.password !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  if (newUser.value.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (emailExists(newUser.value.email)) {
    errorMessage.value = 'Este correo electrónico ya está registrado'
    return
  }

  if (usernameExists(newUser.value.username)) {
    errorMessage.value = 'Este nombre de usuario ya está en uso'
    return
  }

  // Registrar usuario
  const user = registerUserData(newUser.value)
  setCurrentUser(user)
  
  // Limpiar formulario
  newUser.value = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    bio: '',
    profileImage: null
  }
  confirmPassword.value = ''
  imageUrl.value = ''
  
  // Redirigir a la lista de recetas
  setTimeout(() => {
    router.push('/tabs/tab1')
  }, 1000)
}

const goToLogin = () => {
  router.push('/home')
}
</script>

<style scoped>
.custom-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.register-content {
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

.register-button {
  --background: #990000;
  --background-activated: #7c0000;
  --background-hover: #7c0000;
  --border-radius: 12px;
  height: 50px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 20px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: white;
}

.login-link p {
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.login-link ion-button {
  --color: #990000;
  font-weight: 600;
}
</style>
