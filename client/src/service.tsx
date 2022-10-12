import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  oppskrift_id: number;
  oppskrift_navn: string;
  oppskrift_beskrivelse: string;
  ant_pors: number;
  bilde_adr: string;
  kategori_id: number;
  land_id: number;
  ant_like: number;
};
class Service {
  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Recipe[]>('/').then((response) => response.data);
  }
}

const service = new Service();
export default service;
