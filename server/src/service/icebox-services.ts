import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type IceboxIngredient = {
  ingred_id: number;
  ingred_navn: string;
};

class Service {

getAllIceboxIngredients() {
  return new Promise<IceboxIngredient[]>((resolve, reject) => {
    pool.query('SELECT * FROM icebox', (error, results: RowDataPacket[]) => {
      if (error) return reject(error);

      resolve(results as IceboxIngredient[]);
    });
  });
}

addIngredientToIcebox(selectedIceboxIngredient: IceboxIngredient) {
  return new Promise<void>((resolve, reject) => {
    pool.query(
      'INSERT INTO icebox SET ingred_id=?, ingred_navn=?',
      [selectedIceboxIngredient.ingred_id, selectedIceboxIngredient.ingred_navn],
      (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve();
      }
    );
  });
}

deleteIceboxIngredient(ingred_id: number) {
  return new Promise<void>((resolve, reject) => {
    console.log(ingred_id);
    pool.query(
      'DELETE FROM icebox WHERE ingred_id = ?',
      [ingred_id],
      (error, results: ResultSetHeader) => {console.log(results)
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(results);

        resolve();
      }
    );
  });
}

}
export const iceboxService = new Service();
