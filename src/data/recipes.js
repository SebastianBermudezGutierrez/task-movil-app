// Datos quemados para las recetas
export const recipes = [
  {
    id: 1,
    title: "Bandeja Paisa",
    description: "Bandeja paisa casera",
    image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Bandeja+Paisa",
    ingredients: [
      "2 tazas de arroz",
      "1 taza de frijoles rojos",
      "2 huevos",
      "200g de chicharrón",
      "2 chorizos",
      "1 aguacate",
      "2 plátanos maduros",
      "Sal al gusto"
    ],
    steps: [
      "Cocinar el arroz con sal",
      "Preparar los frijoles rojos",
      "Freír los huevos",
      "Preparar el chicharrón",
      "Asar los chorizos",
      "Cortar el aguacate",
      "Freír los plátanos",
      "Servir todo junto"
    ],
    author: "User",
    date: "15/01/2025",
    isBookmarked: false
  },
  {
    id: 2,
    title: "Churrasco",
    description: "Churrasco caribeño",
    image: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Churrasco",
    ingredients: [
      "500g de carne de res",
      "2 cucharadas de aceite de oliva",
      "2 dientes de ajo",
      "1 cebolla",
      "Sal y pimienta al gusto",
      "Hierbas aromáticas"
    ],
    steps: [
      "Sazonar la carne con sal y pimienta",
      "Preparar una marinada con aceite y ajo",
      "Dejar marinar por 30 minutos",
      "Asar a la parrilla por 8-10 minutos por lado",
      "Servir con guacamole y ensalada"
    ],
    author: "User",
    date: "14/01/2025",
    isBookmarked: true
  },
  {
    id: 3,
    title: "Merengón",
    description: "Postre tradicional colombiano",
    image: "https://via.placeholder.com/300x200/FFE66D/FFFFFF?text=Merengón",
    ingredients: [
      "6 claras de huevo",
      "300g de azúcar",
      "500ml de crema de leche",
      "2 cucharadas de azúcar para la crema",
      "Frutas frescas (kiwi, durazno)"
    ],
    steps: [
      "Batir las claras hasta punto de nieve",
      "Agregar azúcar gradualmente",
      "Hornear a 120°C por 1 hora",
      "Batir la crema con azúcar",
      "Montar con frutas frescas"
    ],
    author: "User",
    date: "13/01/2025",
    isBookmarked: false
  },
  {
    id: 4,
    title: "Tiramisú",
    description: "Postre italiano clásico",
    image: "https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=Tiramisú",
    ingredients: [
      "250g de queso mascarpone",
      "4 huevos",
      "100g de azúcar",
      "300ml de café fuerte",
      "200g de bizcochos de soletilla",
      "Cacao en polvo"
    ],
    steps: [
      "Preparar café fuerte y dejar enfriar",
      "Separar yemas y claras",
      "Batir yemas con azúcar",
      "Mezclar con mascarpone",
      "Montar en capas con bizcochos",
      "Refrigerar por 4 horas"
    ],
    author: "User",
    date: "12/01/2025",
    isBookmarked: true
  },
  {
    id: 5,
    title: "Gelatina",
    description: "Gelatina de frutos rojos",
    image: "https://via.placeholder.com/300x200/F38BA8/FFFFFF?text=Gelatina",
    ingredients: [
      "2 sobres de gelatina de fresa",
      "500ml de agua caliente",
      "500ml de agua fría",
      "Frutas frescas para decorar"
    ],
    steps: [
      "Disolver gelatina en agua caliente",
      "Agregar agua fría",
      "Verter en moldes",
      "Refrigerar por 3 horas",
      "Decorar con frutas"
    ],
    author: "User",
    date: "11/01/2025",
    isBookmarked: false
  }
]

// Función para obtener todas las recetas
export const getAllRecipes = () => {
  return recipes
}

// Función para obtener receta por ID
export const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === id)
}

// Función para agregar nueva receta
export const addRecipe = (newRecipe) => {
  const recipe = {
    id: recipes.length + 1,
    title: newRecipe.title,
    description: newRecipe.description,
    image: newRecipe.image || "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Nueva+Receta",
    ingredients: newRecipe.ingredients || [],
    steps: newRecipe.steps || [],
    author: "User",
    date: new Date().toLocaleDateString('es-CO'),
    isBookmarked: false
  }
  recipes.push(recipe)
  return recipe
}

// Función para actualizar receta
export const updateRecipe = (id, updatedRecipe) => {
  const index = recipes.findIndex(recipe => recipe.id === id)
  if (index !== -1) {
    recipes[index] = { ...recipes[index], ...updatedRecipe }
    return recipes[index]
  }
  return null
}

// Función para eliminar receta
export const deleteRecipe = (id) => {
  const index = recipes.findIndex(recipe => recipe.id === id)
  if (index !== -1) {
    return recipes.splice(index, 1)[0]
  }
  return null
}

// Función para toggle bookmark
export const toggleBookmark = (id) => {
  const recipe = recipes.find(recipe => recipe.id === id)
  if (recipe) {
    recipe.isBookmarked = !recipe.isBookmarked
    return recipe
  }
  return null
}

