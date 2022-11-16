import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  oppskrift_id: number;
  oppskrift_navn: string;
  oppskrift_beskrivelse: string;
  oppskrift_steg: string;
  ant_pors: number;
  bilde_adr: string;
  kategori_id: number;
  land_id: number;
  ant_like: number;
  liked: boolean;
};

export type Recipe_Content = {
  oppskrift_id: number;
  ingred_id: number;
  mengde: string;
  maleenhet: string;
};

export type Country = {
  land_id: number;
  land_navn: string;
};
export type Category = {
  kategori_id: number;
  kategori_navn: string;
};
export type IngredientToShoppinglist = {
  ingred_id: number;
  mengde: number;
  maleenhet: string;
};
export type ElementShoppingList = {
  ingred_id: number;
  ingred_navn: string;
  mengde: number;
  maleenhet: string;
};
export type Ingredient = {
  ingred_id: number;
  ingred_navn: string;
};
export type List = {
  id: number;
  ingred_id: number;
  mengde: string;
  maleenhet: string;
};
export type IceboxIngredient = {
  ingred_id: number;
  ingred_navn: string;
};
class Service {
  /**
   * Get all tasks.
   */
  getAllRepice() {
    return axios.get<Recipe[]>('/').then((response) => response.data);
  }

  getRecipe(id: number) {
    return axios.get<Recipe[]>('/recipe/' + id).then((response) => response.data);
  }
  getRecipeContent(id: number) {
    return axios.get<Recipe_Content[]>('/recipecontent/' + id).then((response) => response.data);
  }
  getAllCountry() {
    return axios.get<Country[]>('/country').then((response) => response.data);
  }
  getAllCategory() {
    return axios.get<Category[]>('/category').then((response) => response.data);
  }
  getAllIngredient() {
    return axios.get<Ingredient[]>('/ingredient').then((response) => response.data);
  }
  getShoppingList() {
    return axios.get<List[]>('/shoppinglist').then((response) => response.data);
  }
  /* addItemToShoppingList(item: ElementShoppingList) {
    return axios.post<{}>('/additemshoppinglist', {item: item}).then((response) => response.data);
  } */
  addIngredient(ingredient: List) {
    return axios
      .post<{}>('/addingredient', { ingredient: ingredient })
      .then((response) => response.data);
  }
  getAllIceboxIngredients() {
    return axios.get<IceboxIngredient[]>('/icebox').then((response) => response.data);
  }
  getAllRecipeContent() {
    return axios.get<Recipe_Content[]>('/recipecontent').then((response) => response.data);
  }
  deleteIceboxIngredient(ingred_id: number) {
    return axios
      .delete<IceboxIngredient>('/deleteiceboxingredient/' + ingred_id)
      .then((response) => response.data);
  }
  createIngredient(name: string) {
    return axios.post<{}>('/newingredient', { name: name }).then((response) => response.data);
  }

  createCountry(name: string) {
    return axios.post<{}>('/newcountry', { name: name }).then((response) => response.data);
  }
  createCategory(name: string) {
    return axios.post<{}>('/newcategory', { name: name }).then((response) => response.data);
  }

  createRecipe(recipe: Recipe) {
    return axios
      .post<{ id: number }>('/createrecipe', { recipe: recipe })
      .then((response) => response.data.id);
  }

  addIngredientToIcebox(selectedIceboxIngredient: IceboxIngredient) {
    return axios
      .post<{}>('/addingredienttoicebox', { selectedIceboxIngredient: selectedIceboxIngredient })
      .then((response) => response.data);
  }

  createRecipeIngredient(recipe_content: Recipe_Content[]) {
    return axios
      .post<Recipe_Content>('/create_recipe_ingredient', { recipe_content: recipe_content })
      .then((response) => response.data);
  }
  updateRecipeIngredient(recipeContent: Recipe_Content[]) {
    return axios
      .put('/update_recipe_ingredient', { recipeContent: recipeContent })
      .then((response) => response.data);
  }
  updateIngredientShoppingList(ingredient: List) {
    return axios
      .put<{}>('/updateingredient', { ingredient: ingredient })
      .then((response) => response.data);
  }
  deleteIngredientShoppingList(id: number) {
    return axios
      .delete<{}>('/deleteingredientshoppinglist/' + id)
      .then((response) => response.data);
  }
  deleteAllShoppingList() {
    return axios.delete<{}>('/deleteallshoppinglist').then((response) => response.data);
  }
  updateRecipe(recipe: Recipe) {
    return axios
      .put('/update_recipe/' + recipe.oppskrift_id, { recipe: recipe })
      .then((response) => response.data);
  }
  deleteIngredient(recipe_id: number, ingred_id: number) {
    return axios
      .delete<Recipe_Content>('/deleteingredient/' + recipe_id + '/' + ingred_id)
      .then((response) => response.data);
  }
  deleteRecipe(id: number) {
    return axios.delete<Recipe_Content>('/deleterecipe/' + id).then((response) => response.data);
  }
  likeRecipe(oppskrift_id: number, liked: boolean) {
    return axios
      .put<{}>('/recipelike/' + oppskrift_id, { liked: liked })
      .then((response) => response.data);
  }
}

const service = new Service();
export default service;
