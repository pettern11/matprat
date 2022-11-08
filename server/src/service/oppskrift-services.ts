import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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

class Service {
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
      pool.query(
        'SELECT * FROM oppskrift WHERE oppskrift_id=?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Recipe[]);
        }
      );
    });
  }

  createRecipe(recipe: Recipe) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO oppskrift SET oppskrift_navn=?, oppskrift_beskrivelse=?, oppskrift_steg=?,ant_pors=?,bilde_adr=?,kategori_id=?,land_id=?,ant_like=?',
        [
          recipe.oppskrift_navn,
          recipe.oppskrift_beskrivelse,
          recipe.oppskrift_steg,
          recipe.ant_pors,
          recipe.bilde_adr,
          recipe.kategori_id,
          recipe.land_id,
          recipe.ant_like,
        ],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  updateRecipe(recipe: Recipe) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE oppskrift SET oppskrift_steg=?, ant_pors=? WHERE oppskrift_id=?',
        [recipe.oppskrift_steg, recipe.ant_pors, recipe.oppskrift_id],
        (error: any, _results: any) => {
          if (error) return reject(error);

          if(_results.affectedRows == 0){return reject()};

          resolve();
        }
      );
    });
  }

  deleteRecipe(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM oppskrift WHERE oppskrift_id = ?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No row deleted'));

          resolve();
        }
      );
    });
  }

  updateLiked(oppskrift_id: number, liked: boolean) {
    return new Promise<void>((resolve, reject) => {
      let likeIncrementsAntLike =
        liked == true
          ? 'UPDATE oppskrift SET ant_like=ant_like+1 WHERE oppskrift_id=?'
          : 'UPDATE oppskrift SET ant_like=ant_like-1 WHERE oppskrift_id=?';
      pool.query(
        'UPDATE oppskrift SET liked=? WHERE oppskrift_id=?',
        [liked, oppskrift_id],
        (error, _result: ResultSetHeader) => {
          if (error) return reject(error);
          if(_result.affectedRows == 0){ return reject()};

          resolve();
        }
      );

      pool.query(likeIncrementsAntLike, [oppskrift_id], (error, _result) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

export const oppskriftService = new Service(); 