import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Recipe_Content = {
  oppskrift_id: number;
  ingred_id: number;
  mengde: string;
  maleenhet: string;
};

class Service {
  getRecipeContent(id: number) {
    return new Promise<Recipe_Content[]>((resolve, reject) => {
      pool.query(
        'SELECT oppskrift_id, ingred_id, mengde, maleenhet FROM oppskrift_innhold WHERE oppskrift_id=?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe_Content[]);
        }
      );
    });
  }

  getAllRecipeContent() {
    return new Promise<Recipe_Content[]>((resolve, reject) => {
      pool.query('SELECT * FROM oppskrift_innhold', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe_Content[]);
      });
    });
  }

  createRecipeIngredient(recipe_content: Recipe_Content[]) {
    return new Promise<void>((resolve, reject) => {
      recipe_content.forEach((element) => {
        pool.query(
          'INSERT INTO oppskrift_innhold SET oppskrift_id=?, ingred_id=?, mengde=?,maleenhet=?',
          [element.oppskrift_id, element.ingred_id, element.mengde, element.maleenhet],
          (error: any, _results: any) => {
            if (error) return reject(error);

            resolve();
          }
        );
      });
    });
  }

  updateRecipeIngredient(recipeContent: Recipe_Content[]) {
    return new Promise<void>((resolve, reject) => {
      recipeContent.forEach((element) => {
        pool.query(
          'UPDATE oppskrift_innhold SET mengde=?, maleenhet=? WHERE oppskrift_id=? AND ingred_id=?',
          [element.mengde, element.maleenhet, element.oppskrift_id, element.ingred_id],
          (error: any, _results: any) => {
            if (error){ return reject(error)};

            resolve();
          }
        );
      });
    });
  }

  deleteIngredient(recipe_id: number, ingred_id: number) {
    return new Promise<void>((resolve, reject) => {
      console.log(recipe_id, ingred_id);
      pool.query(
        'DELETE FROM oppskrift_innhold WHERE oppskrift_id = ? AND ingred_id = ?',
        [recipe_id, ingred_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No row deleted'));

          resolve();
        }
      );
    });
  }
}
export const oppskrift_innholdService = new Service(); 