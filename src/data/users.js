// Datos quemados para los usuarios
export const users = [
  {
    id: 1,
    username: "chef_master",
    email: "chef@example.com",
    password: "123456", // En producción esto sería un hash
    fullName: "Chef Master",
    bio: "Apasionado por la cocina tradicional colombiana",
    profileImage: "https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=CM",
    joinDate: "15/01/2025",
    isActive: true,
    recipesCount: 5,
    favoritesCount: 12
  },
  {
    id: 2,
    username: "cocina_casera",
    email: "cocina@example.com", 
    password: "123456",
    fullName: "María González",
    bio: "Especialista en postres y repostería",
    profileImage: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=MG",
    joinDate: "10/01/2025",
    isActive: true,
    recipesCount: 8,
    favoritesCount: 25
  },
  {
    id: 3,
    username: "sabores_unicos",
    email: "sabores@example.com",
    password: "123456", 
    fullName: "Carlos Mendoza",
    bio: "Explorando sabores de todo el mundo",
    profileImage: "https://via.placeholder.com/150x150/FFE66D/FFFFFF?text=CM",
    joinDate: "08/01/2025",
    isActive: true,
    recipesCount: 12,
    favoritesCount: 18
  }
]

// Usuario actual (simulado)
let currentUser = users[0]

// Función para obtener todos los usuarios
export const getAllUsers = () => {
  return users
}

// Función para obtener usuario por ID
export const getUserById = (id) => {
  return users.find(user => user.id === id)
}

// Función para obtener usuario actual
export const getCurrentUser = () => {
  return currentUser
}

// Función para establecer usuario actual
export const setCurrentUser = (user) => {
  currentUser = user
}

// Función para registrar nuevo usuario
export const registerUser = (userData) => {
  const newUser = {
    id: users.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password, // En producción esto sería un hash
    fullName: userData.fullName,
    bio: userData.bio || "",
    profileImage: userData.profileImage || "https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=U",
    joinDate: new Date().toLocaleDateString('es-CO'),
    isActive: true,
    recipesCount: 0,
    favoritesCount: 0
  }
  
  users.push(newUser)
  return newUser
}

// Función para actualizar usuario
export const updateUser = (id, updatedData) => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData }
    // Si es el usuario actual, actualizar también
    if (currentUser && currentUser.id === id) {
      currentUser = { ...currentUser, ...updatedData }
    }
    return users[index]
  }
  return null
}

// Función para eliminar usuario
export const deleteUser = (id) => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
  return null
}

// Función para autenticar usuario
export const authenticateUser = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

// Función para verificar si email ya existe
export const emailExists = (email) => {
  return users.some(user => user.email === email)
}

// Función para verificar si username ya existe
export const usernameExists = (username) => {
  return users.some(user => user.username === username)
}

// Función para actualizar estadísticas del usuario
export const updateUserStats = (userId) => {
  const user = getUserById(userId)
  if (user) {
    // Aquí podrías calcular las estadísticas reales basadas en las recetas
    // Por ahora mantenemos los valores quemados
    return user
  }
  return null
}

