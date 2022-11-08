import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type IngredientToShoppinglist = {
  ingred_id: number;
  mengde: string;
  maleenhet: string;
};

export type List = {
  id: number;
  ingred_id: number;
  mengde: number;
  maleenhet: string;
};

class Service {

  getShoppingList() {
    return new Promise<List[]>((resolve, reject) => {
      pool.query('SELECT * FROM handleliste', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as List[]);
      });
    });
  }

  addIngredientShoppinglist(ingredient: IngredientToShoppinglist) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO handleliste SET ingred_id=?, mengde=?, maleenhet=?',
        [ingredient.ingred_id, ingredient.mengde, ingredient.maleenhet],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  updateIngredientShoppinglist(ingredient: List) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE handleliste SET mengde=?, maleenhet=? WHERE id=?',
        [ingredient.mengde, ingredient.maleenhet, ingredient.id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) return reject('Not found');

          resolve();
        }
      );
    });
  }
  
  deleteIngredientShoppinglist(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM handleliste WHERE id = ?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No row deleted'));

          resolve();
        }
      );
    });
  }

  deleteAllShoppinglist() {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM handleliste', (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      });
    });
  }

}
export const shoppingListService = new Service(); 