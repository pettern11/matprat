import pool from './mysql-pool';
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
//ingridient for shoppinglist, slightly different from the other ingridient
export type IngredientToShoppinglist = {
  ingred_id: number;
  mengde: number;
  maleenhet: string;
};
export type ElementHandleliste = {
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
  mengde: number;
  maleenhet: string;
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

  getRecipeContent(id: number) {
    return new Promise<Recipe_Content[]>((resolve, reject) => {
      pool.query(
        'SELECT oppskrift_id, ingred_id, mengde, maleenhet FROM oppskrift_innhold WHERE oppskrift_id=?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          console.log(results);

          resolve(results as Recipe_Content[]);
        }
      );
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

  getShoppingList() {
    return new Promise<List[]>((resolve, reject) => {
      pool.query('SELECT * FROM handleliste', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as List[]);
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

          resolve();
        }
      );
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

  createRecipe(recipe: Recipe) {
    return new Promise<number>((resolve, reject) => {
      console.log(recipe);
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
  createRecipeIngredient(recipe_content: Recipe_Content[]) {
    return new Promise<void>((resolve, reject) => {
      recipe_content.forEach((element) => {
        console.log(element);

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
      console.log('homofaenfitte', recipeContent);
      recipeContent.forEach((element) => {
        pool.query(
          'UPDATE oppskrift_innhold SET mengde=?, maleenhet=? WHERE oppskrift_id=? AND ingred_id=?',
          [Number(element.mengde), element.maleenhet, element.oppskrift_id, element.ingred_id],
          (error: any, _results: any) => {
            if (error) return reject(error);

            resolve();
          }
        );
      });
    });
  }
  updateRecipe(recipe: Recipe) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE oppskrift SET oppskrift_navn=?, oppskrift_beskrivelse=?, oppskrift_steg=?, ant_pors=?, bilde_adr=? WHERE oppskrift_id=?',
        [
          recipe.oppskrift_navn,
          recipe.oppskrift_beskrivelse,
          recipe.oppskrift_steg,
          recipe.ant_pors,
          recipe.bilde_adr,
          recipe.oppskrift_id,
        ],
        (error: any, _results: any) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
  deleteIngredient(recipe_id: number, ingred_id: number) {
    return new Promise<void>((resolve, reject) => {
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
      console.log(liked);
      let likeIncrementsAntLike =
        liked == true
          ? 'UPDATE oppskrift SET ant_like=ant_like+1 WHERE oppskrift_id=?'
          : 'UPDATE oppskrift SET ant_like=ant_like-1 WHERE oppskrift_id=?';
      pool.query(
        'UPDATE oppskrift SET liked=? WHERE oppskrift_id=?',
        [liked, oppskrift_id],
        (error, _result) => {
          if (error) return reject(error);

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

export const service = new Service();
