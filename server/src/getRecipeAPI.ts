// import pool from './mysql-pool';
// import type { RowDataPacket, ResultSetHeader } from 'mysql2';
// import { Country, Category, Ingredient, Recipe, Recipe_Content } from './services';

// function getIngredientAPI() {
//   fetch('www.themealdb.com/api/json/v1/1/list.php?i=list')
//     .then((res) => res.json())
//     .then((data) => console.log(data.meals));
// }
// function getCountryAPI() {
//   fetch('www.themealdb.com/api/json/v1/1/list.php?a=list')
//     .then((res) => res.json())
//     .then((data) => console.log(data.meals));
// }
let allRecipes = [];
let navn = [];
function getRecipeAPI() {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then((res) => res.json())
    // .then((data) => console.log(data.meals.length));
    .then((data) =>
      data.meals.forEach((element) => {
        allRecipes.push(element);
        // console.log(element);
      })
    )
    .then(() =>
      allRecipes.forEach((element) => {
        navn.push(element.strMeal);
      })
    );
}

// getIngredientAPI();
// getCountryAPI();
getRecipeAPI();
setTimeout(() => {
  console.log(navn);
}, 1000);
