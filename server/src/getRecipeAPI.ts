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
}
const apiCalls = new API_Calls();

apiCalls.getCategory();
apiCalls.getCountry();

apiCalls.getRecipeA_C();
apiCalls.getRecipeD_M();
apiCalls.getRecipeN_Y();

setTimeout(() => {
  pushRecipe();
}, 10000);

function pushCountry() {
  //@ts-ignore
  country.forEach((element) => {
    pool.query('INSERT INTO land SET land_navn=?', [element], (error, results) => {
      if (error) return error;

      results;
    });
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
function a_to_c(array) {
  setTimeout(() => {
    array.forEach((element) => {
      if (!recipe.includes(element.idMeal)) {
        const indexCountry = country.map((e) => e.land_navn).indexOf(element.strArea);
        const indexCategory = category.map((e) => e.kategori_navn).indexOf(element.strCategory);
        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
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
        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
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

        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
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
}
