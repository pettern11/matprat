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

class Service {
  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM oppskrift', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }
}

export const service = new Service();
