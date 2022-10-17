import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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
  land_id: number;
  land_navn: string;
};
export type Ingredient = {
  ingred_id: number;
  ingred_navn: string;
};
class Service {
  /**
   * Get all tasks.
   */
  getAllRecipe() {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM oppskrift', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }

  getRecipe(id: number) {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM oppskrift WHERE oppskrift_id=?',[id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }

  getRecipeContent(id: number) {
    return new Promise<Recipe_Content[]>((resolve, reject) => {
      pool.query('SELECT oppskrift_id, ingred_id, mengde, maleenhet FROM oppskrift_innhold WHERE oppskrift_id=?',[id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        console.log(results);

        resolve(results as Recipe_Content[]);
      });
    });
  }


  getAllCountry() {
    return new Promise<Country[]>((resolve, reject) => {
      pool.query('SELECT * FROM land', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Country[]);
      });
    });
  }

  getAllCategory() {
    return new Promise<Category[]>((resolve, reject) => {
      pool.query('SELECT * FROM kategori', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Category[]);
      });
    });
  }

  getAllIngredient() {
    return new Promise<Ingredient[]>((resolve, reject) => {
      pool.query('SELECT * FROM ingrediens', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Ingredient[]);
      });
    });
  }
  createCountry(name: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query('INSERT INTO land SET land_navn=?', [name], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
  createIngredient(name: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO ingrediens SET ingred_navn=?',
        [name],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

export const service = new Service();
