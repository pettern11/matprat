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
let alfabeth1 = ['a', 'b', 'c'];
let alfabeth2 = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
let alfabeth3 = ['n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y'];

function getRecipeAPI() {
  alfabeth1.forEach((letter) => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
      .then((res) => res.json())
      // .then((data) => console.log(data.meals.length));
      .then((data) => aaaa1(data.meals));
  });
  alfabeth2.forEach((letter) => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
      .then((res) => res.json())
      // .then((data) => console.log(data.meals.length));
      .then((data) => aaaa2(data.meals));
  });
  alfabeth3.forEach((letter) => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
      .then((res) => res.json())
      // .then((data) => console.log(data.meals.length));
      .then((data) => aaaa3(data.meals));
  });
}

function aaaa1(array) {
  array.forEach((element) => {
    if (!recipe.includes(element.idMeal)) {
      recipe.push({
        id: element.idMeal,
        name: element.strMeal,
        instruction: element.strInstructions,
        picture: element.strMealThumb,
        country: element.strArea,
        category: element.strCategory,
      });
    }
  });
}
function aaaa2(array) {
  array.forEach((element) => {
    if (!recipe.includes(element.idMeal)) {
      recipe.push({
        id: element.idMeal,
        name: element.strMeal,
        instruction: element.strInstructions,
        picture: element.strMealThumb,
        country: element.strArea,
        category: element.strCategory,
      });
    }
  });
}
function aaaa3(array) {
  array.forEach((element) => {
    if (!recipe.includes(element.idMeal)) {
      recipe.push({
        id: element.idMeal,
        name: element.strMeal,
        instruction: element.strInstructions,
        picture: element.strMealThumb,
        country: element.strArea,
        category: element.strCategory,
      });
    }
  });
}

getRecipeAPI();

setTimeout(() => {
  recipe.forEach((element) => {
    pool.query(
      'INSERT INTO oppskrift SET oppskrift_id=?, oppskrift_navn=?, oppskrift_beskrivelse=?, oppskrift_steg=?,ant_pors=?,bilde_adr=?,kategori_id=?,land_id=?,ant_like=?',
      [element.id, element.name, '', element.instruction, 4, element.picture, 1, 1, 0],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}, 2000);
