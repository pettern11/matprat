// @ts-nocheck
import mysql from 'mysql2';

/*
getRecipeAPI.ts bruker ES-Modules, og krever ES5/6, og ikke commonJS.
Node forventer commonjs, men babel-node kan oversette es-moduler, vi bruker derfor babel-node for å kjøre scriptet.

babel-node skal i teorien fungere alene, men fant ut det ikke kjører uten nodemon foran. 
Enkleste løsning er å bruke nodemon, og manuelt avslutte programmet etter det har kjørt. */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // Reduce load on NTNU MySQL server
  connectionLimit: 1,
  // Convert MySQL boolean values to JavaScript boolean values
  typeCast: (field, next) =>
    field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
});

let recipe = [];
let country = [];
let category = [];
let ingredient = [];
let recipe_ingredient = [];
//@ts-ignore

class API_Calls {
  alfabeth1 = ['a', 'b', 'c'];
  alfabeth2 = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
  alfabeth3 = ['n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y'];
  getRecipeA_C() {
    this.alfabeth1.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => a_to_c(data.meals));
    });
  }
  getRecipeD_M() {
    this.alfabeth2.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => d_to_m(data.meals));
    });
  }
  getRecipeN_Y() {
    this.alfabeth3.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => n_to_y(data.meals));
    });
  }
  getCategory() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((res) => res.json())
      .then((data) => addCategory(data.meals));
  }
  getCountry() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
      .then((res) => res.json())
      .then((data) => addCountry(data.meals));
  }
  getIngredients() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
      .then((res) => res.json())
      .then((data) => addIngredient(data.meals));
  }
}
const apiCalls = new API_Calls();
apiCalls.getIngredients();
apiCalls.getCategory();
apiCalls.getCountry();

apiCalls.getRecipeA_C();
apiCalls.getRecipeD_M();
apiCalls.getRecipeN_Y();

setTimeout(() => {
  pushRecipe();
}, 13000);
// setTimeout(() => {
//   matchRecipeIngredient();
// }, 10000);

function matchRecipeIngredient() {
  recipe_ingredient.forEach((element) => {
    // console.log(element);
    let number;
    if (isNaN(element.number)) {
      number = 1;
    } else {
      number = element.number;
    }
    console.log(element.recipe_id);
    pool.query(
      'INSERT INTO oppskrift_innhold SET oppskrift_id=?, ingred_id=?, mengde=?, maleenhet=?',
      [element.recipe_id, element.ingred_id, number, element.type],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}
function pushCountry() {
  //@ts-ignore
  country.forEach((element) => {
    pool.query('INSERT INTO land SET land_navn=?', [element], (error, results) => {
      if (error) return error;

      results;
    });
  });
}
function pushIngredient() {
  //@ts-ignore
  ingredient.forEach((element) => {
    pool.query(
      'INSERT INTO ingrediens SET ingred_id=?, ingred_navn=?',
      [element.id, element.name],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}
function pushCategory() {
  //@ts-ignore
  category.forEach((element) => {
    pool.query('INSERT INTO kategori SET kategori_navn=?', [element], (error, results) => {
      if (error) return error;

      results;
    });
  });
}
function getCountryID() {
  country = [];
  pool.query('SELECT * FROM land', (error, results: []) => {
    if (error) return error;
    country = results;
  });
}
function getCategoryID() {
  category = [];
  pool.query('SELECT * FROM kategori', (error, results: []) => {
    if (error) return error;
    category = results;
  });
}
function addCategory(array) {
  array.forEach((element) => {
    category.push(element.strCategory);
  });
  pushCategory();
  getCategoryID();
}
function addCountry(array) {
  array.forEach((element) => {
    country.push(element.strArea);
  });
  pushCountry();
  getCountryID();
}
function addIngredient(array) {
  array.forEach((element) => {
    ingredient.push({ id: element.idIngredient, name: element.strIngredient });
  });
  pushIngredient();
}
function stringToNumber(string) {
  let number;
  let numsStr = string.replace(/[^0-9/]/g, '');
  let firstNumber = parseInt(numsStr);
  let restOfString = numsStr.replace(firstNumber, '');
  if (restOfString.includes('/')) {
    let newString = restOfString.replace('/', '');
    let secondNumber = parseInt(newString);
    number = firstNumber / secondNumber;
  } else {
    number = firstNumber;
  }
  return number;
}
function removeNumber(string) {
  let numberFree = string.replace(/[0-9/']/g, '');
  return numberFree;
}
function a_to_c(array) {
  setTimeout(() => {
    array.forEach((element) => {
      if (!recipe.includes(element.idMeal)) {
        const indexCountry = country.map((e) => e.land_navn).indexOf(element.strArea);
        const indexCategory = category.map((e) => e.kategori_navn).indexOf(element.strCategory);
        const ingredient_list = [
          element.strIngredient1,
          element.strIngredient2,
          element.strIngredient3,
          element.strIngredient4,
          element.strIngredient5,
          element.strIngredient6,
          element.strIngredient7,
          element.strIngredient8,
          element.strIngredient9,
          element.strIngredient10,
          element.strIngredient11,
          element.strIngredient12,
          element.strIngredient13,
          element.strIngredient14,
          element.strIngredient15,
          element.strIngredient16,
          element.strIngredient17,
          element.strIngredient18,
          element.strIngredient19,
          element.strIngredient20,
        ];
        const ingredient_measure = [
          element.strMeasure1,
          element.strMeasure2,
          element.strMeasure3,
          element.strMeasure4,
          element.strMeasure5,
          element.strMeasure6,
          element.strMeasure7,
          element.strMeasure8,
          element.strMeasure9,
          element.strMeasure10,
          element.strMeasure11,
          element.strMeasure12,
          element.strMeasure13,
          element.strMeasure14,
          element.strMeasure15,
          element.strMeasure16,
          element.strMeasure17,
          element.strMeasure18,
          element.strMeasure19,
          element.strMeasure20,
        ];
        let ingred = [];
        let measure = [];
        for (let i = 0; i < 20; i++) {
          let indexIngred = ingredient
            .map((e) => e.name.toLowerCase())
            .indexOf(ingredient_list[i] ? ingredient_list[i].toLowerCase() : '');

          if (ingredient[indexIngred]) {
            ingred.push(ingredient[indexIngred].id);
          }

          if (ingredient_measure[i]) {
            measure.push({
              number:
                stringToNumber(ingredient_measure[i]) == NaN
                  ? '1'
                  : stringToNumber(ingredient_measure[i]),
              type: removeNumber(ingredient_measure[i]),
            });
          }
        }
        // console.log(measure, i);
        // element.idMeal == 52765 ? console.log('her er jeg', element.strIngredient1) : '';

        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
        // let elementID = element.idMeal;
        // ingred.forEach((ingredient, i) => {
        //   console.log(elementID);
        // });
        for (let i = 0; i < 20; i++) {
          // console.log(element.idMeal, ingred[i], measure[i]);
          if (
            measure[i] == undefined ||
            (isNaN(measure[i].number) && measure[i].type == '') ||
            (measure[i].number && measure[i].type == null)
          ) {
            break;
          }

          recipe_ingredient.push({
            recipe_id: element.idMeal,
            ingred_id: ingred[i],
            number: measure[i].number,
            type: measure[i].type,
          });
        }
        // console.log(recipe_ingredient);
      } //@ts-ignore
    });
  }, 2000);
}

function d_to_m(array) {
  setTimeout(() => {
    array.forEach((element) => {
      if (!recipe.includes(element.idMeal)) {
        const indexCountry = country.map((e) => e.land_navn).indexOf(element.strArea);
        const indexCategory = category.map((e) => e.kategori_navn).indexOf(element.strCategory);
        const ingredient_list = [
          element.strIngredient1,
          element.strIngredient2,
          element.strIngredient3,
          element.strIngredient4,
          element.strIngredient5,
          element.strIngredient6,
          element.strIngredient7,
          element.strIngredient8,
          element.strIngredient9,
          element.strIngredient10,
          element.strIngredient11,
          element.strIngredient12,
          element.strIngredient13,
          element.strIngredient14,
          element.strIngredient15,
          element.strIngredient16,
          element.strIngredient17,
          element.strIngredient18,
          element.strIngredient19,
          element.strIngredient20,
        ];
        const ingredient_measure = [
          element.strMeasure1,
          element.strMeasure2,
          element.strMeasure3,
          element.strMeasure4,
          element.strMeasure5,
          element.strMeasure6,
          element.strMeasure7,
          element.strMeasure8,
          element.strMeasure9,
          element.strMeasure10,
          element.strMeasure11,
          element.strMeasure12,
          element.strMeasure13,
          element.strMeasure14,
          element.strMeasure15,
          element.strMeasure16,
          element.strMeasure17,
          element.strMeasure18,
          element.strMeasure19,
          element.strMeasure20,
        ];
        let ingred = [];
        let measure = [];
        for (let i = 0; i < 20; i++) {
          let indexIngred = ingredient
            .map((e) => e.name.toLowerCase())
            .indexOf(ingredient_list[i] ? ingredient_list[i].toLowerCase() : '');

          if (ingredient[indexIngred]) {
            ingred.push(ingredient[indexIngred].id);
          }

          if (ingredient_measure[i]) {
            measure.push({
              number:
                stringToNumber(ingredient_measure[i]) == NaN
                  ? '1'
                  : stringToNumber(ingredient_measure[i]),
              type: removeNumber(ingredient_measure[i]),
            });
          }
        }
        // console.log(measure, i);
        // element.idMeal == 52765 ? console.log('her er jeg', element.strIngredient1) : '';

        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
        // let elementID = element.idMeal;
        // ingred.forEach((ingredient, i) => {
        //   console.log(elementID);
        // });
        for (let i = 0; i < 20; i++) {
          // console.log(element.idMeal, ingred[i], measure[i]);
          if (
            measure[i] == undefined ||
            (isNaN(measure[i].number) && measure[i].type == '') ||
            (measure[i].number && measure[i].type == null)
          ) {
            break;
          }

          recipe_ingredient.push({
            recipe_id: element.idMeal,
            ingred_id: ingred[i],
            number: measure[i].number,
            type: measure[i].type,
          });
        }
        // console.log(recipe_ingredient);
      } //@ts-ignore
    });
  }, 2000);
}
function n_to_y(array) {
  setTimeout(() => {
    array.forEach((element) => {
      if (!recipe.includes(element.idMeal)) {
        const indexCountry = country.map((e) => e.land_navn).indexOf(element.strArea);
        const indexCategory = category.map((e) => e.kategori_navn).indexOf(element.strCategory);
        const ingredient_list = [
          element.strIngredient1,
          element.strIngredient2,
          element.strIngredient3,
          element.strIngredient4,
          element.strIngredient5,
          element.strIngredient6,
          element.strIngredient7,
          element.strIngredient8,
          element.strIngredient9,
          element.strIngredient10,
          element.strIngredient11,
          element.strIngredient12,
          element.strIngredient13,
          element.strIngredient14,
          element.strIngredient15,
          element.strIngredient16,
          element.strIngredient17,
          element.strIngredient18,
          element.strIngredient19,
          element.strIngredient20,
        ];
        const ingredient_measure = [
          element.strMeasure1,
          element.strMeasure2,
          element.strMeasure3,
          element.strMeasure4,
          element.strMeasure5,
          element.strMeasure6,
          element.strMeasure7,
          element.strMeasure8,
          element.strMeasure9,
          element.strMeasure10,
          element.strMeasure11,
          element.strMeasure12,
          element.strMeasure13,
          element.strMeasure14,
          element.strMeasure15,
          element.strMeasure16,
          element.strMeasure17,
          element.strMeasure18,
          element.strMeasure19,
          element.strMeasure20,
        ];
        let ingred = [];
        let measure = [];
        for (let i = 0; i < 20; i++) {
          let indexIngred = ingredient
            .map((e) => e.name.toLowerCase())
            .indexOf(ingredient_list[i] ? ingredient_list[i].toLowerCase() : '');

          if (ingredient[indexIngred]) {
            ingred.push(ingredient[indexIngred].id);
          }

          if (ingredient_measure[i]) {
            measure.push({
              number:
                stringToNumber(ingredient_measure[i]) == NaN
                  ? '1'
                  : stringToNumber(ingredient_measure[i]),
              type: removeNumber(ingredient_measure[i]),
            });
          }
        }
        // console.log(measure, i);
        // element.idMeal == 52765 ? console.log('her er jeg', element.strIngredient1) : '';

        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
        // let elementID = element.idMeal;
        // ingred.forEach((ingredient, i) => {
        //   console.log(elementID);
        // });
        for (let i = 0; i < 20; i++) {
          // console.log(element.idMeal, ingred[i], measure[i]);
          if (
            measure[i] == undefined ||
            (isNaN(measure[i].number) && measure[i].type == '') ||
            (measure[i].number && measure[i].type == null)
          ) {
            break;
          }

          recipe_ingredient.push({
            recipe_id: element.idMeal,
            ingred_id: ingred[i],
            number: measure[i].number,
            type: measure[i].type,
          });
        }
        // console.log(recipe_ingredient);
      } //@ts-ignore
    });
  }, 2000);
}
function pushRecipe() {
  console.log('kommer vi hit?');
  console.log(recipe.length);
  //@ts-ignore
  recipe.forEach((element) => {
    pool.query(
      'INSERT INTO oppskrift SET oppskrift_id=?, oppskrift_navn=?, oppskrift_beskrivelse=?, oppskrift_steg=?,ant_pors=?,bilde_adr=?,kategori_id=?,land_id=?,ant_like=?',
      [
        element.id,
        element.name,
        '',
        element.instruction,
        4,
        element.picture,
        '' + element.category + '',
        '' + element.country + '',
        0,
      ],
      (error, results) => {
        if (error) return error;
        results;
      }
    );
  });
  matchRecipeIngredient();
}
