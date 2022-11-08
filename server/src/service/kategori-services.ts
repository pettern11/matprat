import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Category = {
  kategori_id: number;
  kategori_navn: string;
};

class Service {
  getAllCategory() {
    return new Promise<Category[]>((resolve, reject) => {
      pool.query('SELECT * FROM kategori', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Category[]);
      });
    });
  }

  createCategory(name: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO kategori SET kategori_navn=?',
        [name],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}
export const kategoriService = new Service(); 