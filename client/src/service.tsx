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
};

export type Recipe_Content = {   
  oppskrift_id: number;   
  ingred_id: number;   
  mengde: number;   
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
export type Ingredient = {
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
  createIngredient(name: string) {
    return axios.post<{}>('/newingredient', { name: name }).then((response) => response.data);
  }
  createCountry(name: string) {
    return axios.post<{}>('/newcountry', { name: name }).then((response) => response.data);
  }
}

const service = new Service();
export default service;
